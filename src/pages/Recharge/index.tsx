import { getProductListReq } from '@/api/common';
import './index.scss'
import { FC, useEffect, useState } from 'react';
import EventBus from '@/utils/eventBus';
import { FormattedMessage } from 'react-intl';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Toast } from 'antd-mobile';

function RechargePage() {
  const [list, setList] = useState([])
  const eventBus = EventBus.getInstance()
  const [current, setCurrent] = useState(0)
  const [tonConnectUI] = useTonConnectUI();
  const handleClick = (index: number) => {
    setCurrent(index)
  }

  const initData = async () => {
    eventBus.emit('loading', true)
    const res = await getProductListReq()
    eventBus.emit('loading', false)
    setList(res.data)
  }

  const handleRecharge = async (index: number) => {
    if (!tonConnectUI.connected) {
      tonConnectUI.modal.open()
      return
    }
    const item = list[index] as any
    eventBus.emit('loading', true)
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
            return <ListItem score={item.score} price={item.price} selected={current == index} key={index} index={index} onClick={handleClick}/>
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
            return <img src='/assets/coin.png' className={`img${index} img`} />
          })
        }
      </div>
      <div className='score'>{score.toLocaleString()}</div>
    </div>
    <div className='bot'>
        TON {price}
      </div>
  </div>
}

export default RechargePage;