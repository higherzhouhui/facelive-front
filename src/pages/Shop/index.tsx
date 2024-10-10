import './index.scss';
import Header from '@/components/Header';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton, Tabs, Toast } from 'antd-mobile';
import { getPieceListReq, userBuySkinOrPieceReq, useCoinBuyPieceReq } from '@/api/common';
import { useTonConnectUI } from '@tonconnect/ui-react';
import EventBus from '@/utils/eventBus';

export default function () {
  return <div className="shop-page fadeIn">
    <Header title='SHOP' />
    <div className='shop-content'>
      <Tabs>
        <Tabs.Tab title='Skin' key='fruits'>
          <ShopItem type='skin' />
        </Tabs.Tab>
        <Tabs.Tab title='Piece' key='vegetables'>
          <ShopItem type='piece' />
        </Tabs.Tab>
      </Tabs>
    </div>
  </div>
}

type ShopItemType = {
  type: string
}
const ShopItem: FC<ShopItemType> = ({ type }) => {
  const systemInfo = useSelector((state: any) => state.user.system)
  const eventBus = EventBus.getInstance()

  const [loading, setLoading] = useState(true)
  const [shopList, setShopList] = useState([])
  const [tonConnectUI] = useTonConnectUI();
  const handleBuyUseCoin = async (item: any) => {
    eventBus.emit('loading', true)
    const data = {
      id: item.id,
      price: item.price * 10,
    }
    const res = await useCoinBuyPieceReq(data)
    eventBus.emit('loading', false)
    if (res.code == 0) {
      const desc = `Purchase successful! Congratulations on obtaining ${res.data.piece} fragments🎉`
      Toast.show({
        content: desc,
        duration: 5000,
      })
    }
  }
  const handleBuy = async (item: any) => {
    if (item.price == 0) {
      return
    }
    eventBus.emit('loading', true)
    if (!tonConnectUI.connected) {
      tonConnectUI.modal.open()
      return
    }
    const transaction = {
      validUntil: new Date().getTime() + 300 * 1000,
      messages: [
        {
          address: "UQAiHulkwOdTIgxN6-y02u0aZfiEhZhRYhPyPp6ZhlbO1tHF",
          amount: `${item.price * 100000000}` //Toncoin in nanotons
        }
      ]
    }
    try {
      await tonConnectUI.sendTransaction(transaction)
      const data = {
        id: item.id,
        from: tonConnectUI.account?.address,
        to: transaction.messages[0].address,
        price: item.price,
        type: type,
        name: item.skin || item.name,
      }
      const res = await userBuySkinOrPieceReq(data)
      eventBus.emit('loading', false)

      if (res.code == 0) {
        let desc = `Purchase successful!🎉`
        if (type == 'piece') {
          desc = `Purchase successful! Congratulations on obtaining ${res.data.amount} fragments🎉`
        }
        Toast.show({
          content: desc,
          duration: 5000,
        })
      }
    } catch (error: any) {
      eventBus.emit('loading', false)
      Toast.show({
        content: error?.message
      })
    }
  }

  const initData = async () => {
    setLoading(true)
    if (type == 'skin') {
      setShopList(systemInfo.skin)
    } else {
      const res = await getPieceListReq()
      if (res.code == 0) {
        setShopList(res.data)
      }
    }
    setLoading(false)
  }
  useEffect(() => {
    initData()
  }, [])
  return <div className='list-content'>
    {
      loading ? [...Array(3)].map((item, index) => {
        return <Skeleton key={index} className='skeleton' animated/>
      }) : <div></div>
    }
    {
      shopList.map((item: any, index: number) => {
        return <div className='list-item' key={index}>
          <div className='list-left'>
            <img src={`/assets/shop/${item.skin || item.name}.png`} className='logo' alt='logo' />
            <div className='price'>
              {item.price}
              <img src="/assets/common/ton.png" alt="ton" />
            </div>
          </div>
          <div className='list-right'>
            <div className='name'>{item.skin || item.name}</div>
            {
              type == 'skin' ? <div></div> : <div className='desc'>
                {`${item.min} - ${item.max}`}
                <img src='/assets/shop/piece.png' className='piece' />
              </div>
            }
            <div className={`buy-btn ${item.skin}-btn`} onClick={() => handleBuy(item)}>BUY NOW</div>
            {
              type == 'piece' ? <div className={`buy-btn ${item.skin}-btn`} onClick={() => handleBuyUseCoin(item)}>{item.price * 10} COIN</div> : null
            }
          </div>
        </div>
      })
    }
  </div>
}