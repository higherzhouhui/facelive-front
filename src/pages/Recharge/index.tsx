import { getProductListReq, buyProductReq, bindWalletReq } from '@/api/common';
import './index.scss'
import { FC, useEffect, useState } from 'react';
import EventBus from '@/utils/eventBus';
import { FormattedMessage } from 'react-intl';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { Toast } from 'antd-mobile';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import { useDispatch } from 'react-redux';
import { setUserInfoAction } from '@/redux/slices/userSlice';
import { getLabel } from '@/utils/common';

function RechargePage() {
  const [list, setList] = useState([])
  const eventBus = EventBus.getInstance()
  const [current, setCurrent] = useState(0)
  const [tonConnectUI] = useTonConnectUI();
  const hapticFeedback = useHapticFeedback()
  const userFriendlyAddress = useTonAddress()
  const dispatch = useDispatch()
  const handleClick = (index: number) => {
    setCurrent(index)
  }

  const initData = async () => {
    eventBus.emit('loading', true)
    const res = await getProductListReq()
    eventBus.emit('loading', false)
    setList(res.data)
  }

  const handleRecharge = async () => {
    hapticFeedback.notificationOccurred('warning')
    if (!tonConnectUI.connected) {
      tonConnectUI.modal.open()
      return
    }
    bindWalletReq({wallet: userFriendlyAddress})
    const to_address = "UQAiHulkwOdTIgxN6-y02u0aZfiEhZhRYhPyPp6ZhlbO1tHF"
    const item = list[current] as any
    eventBus.emit('loading', true)
    const transaction = {
      validUntil: new Date().getTime() + 300 * 1000,
      messages: [
        {
          address: to_address,
          amount: `${item.price * 100000000}` //Toncoin in nanotons
        }
      ]
    }
    try {
      await tonConnectUI.sendTransaction(transaction)
      const res = await buyProductReq({
        id: item.id,
        from_address: userFriendlyAddress,
        to_address: to_address,
      })
      if (res.code == 0) {
        Toast.show({
          content: getLabel('czcg')
        })
        dispatch(setUserInfoAction(res.data))
      }
    } catch (error: any) {
      eventBus.emit('loading', false)
      Toast.show({
        content: error?.message
      })
    }
  }

  useEffect(() => {
    initData()
  }, [])

  return <div className='product-page'>
    <div className='top-content'>
      <div className='title'>
        <FormattedMessage id='recharge' />
      </div>
      <div className='list'>
        {
          list.map((item: any, index: number) => {
            return <ListItem score={item.score} price={item.price} selected={current == index} key={index} index={index} onClick={handleClick} />
          })
        }
      </div>
    </div>
    <div className='recharge-btn' onClick={() => handleRecharge()}>
      <FormattedMessage id='recharge' />
    </div>
  </div>
}

type ListItemType = {
  score: number,
  price: number,
  selected?: boolean,
  index: number,
  onClick: (index: number) => void,
}

const ListItem: FC<ListItemType> = ({ score, price, selected, index, onClick }) => {
  return <div className={`list-item ${selected ? 'selected' : ''}`} onClick={() => onClick(index)}>
    <div className='top'>
      <div className='img-coin'>
        {
          [...Array(index + 1).fill('')].map((item: any, index: number) => {
            return <img src='/assets/coin.png' className={`img${index} img`} key={index}/>
          })
        }
      </div>
      <div className='score'>{score.toLocaleString()}</div>
    </div>
    <div className='bot'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1839 17.7069C13.6405 18.6507 13.3688 19.1226 13.0591 19.348C12.4278 19.8074 11.5723 19.8074 10.941 19.348C10.6312 19.1226 10.3595 18.6507 9.81613 17.7069L5.52066 10.2464C4.76864 8.94024 4.39263 8.28717 4.33762 7.75894C4.2255 6.68236 4.81894 5.65591 5.80788 5.21589C6.29309 5 7.04667 5 8.55383 5H15.4462C16.9534 5 17.7069 5 18.1922 5.21589C19.1811 5.65591 19.7745 6.68236 19.6624 7.75894C19.6074 8.28717 19.2314 8.94024 18.4794 10.2464L14.1839 17.7069ZM11.1 16.3412L6.56139 8.48002C6.31995 8.06185 6.19924 7.85276 6.18146 7.68365C6.14523 7.33896 6.33507 7.01015 6.65169 6.86919C6.80703 6.80002 7.04847 6.80002 7.53133 6.80002H7.53134L11.1 6.80002V16.3412ZM12.9 16.3412L17.4387 8.48002C17.6801 8.06185 17.8008 7.85276 17.8186 7.68365C17.8548 7.33896 17.665 7.01015 17.3484 6.86919C17.193 6.80002 16.9516 6.80002 16.4687 6.80002L12.9 6.80002V16.3412Z" fill="#FFFFFF"></path></svg>
      {price}
    </div>
  </div>
}

export default RechargePage;