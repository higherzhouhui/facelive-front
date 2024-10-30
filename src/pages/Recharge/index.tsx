import { getProductListReq } from '@/api/common';
import './index.scss'
import { FC, useEffect, useState } from 'react';
import EventBus from '@/utils/eventBus';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

function RechargePage() {
  const [list, setList] = useState([])
  const eventBus = EventBus.getInstance()
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const handleClick = (index: number) => {
    setCurrent(index)
  }


  const initData = async () => {
    eventBus.emit('loading', true)
    const res = await getProductListReq()
    eventBus.emit('loading', false)
    setList(res.data)
  }

  const handleToPay = () => {
    const item = list[current]
    localStorage.setItem('payObj', JSON.stringify(item))
    navigate('/pay')
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
    <div className='logos'>
      <img src='/assets/recharge/usdt.png' />
      <img src='/assets/recharge/google.png' />
      <img src='/assets/recharge/apple.png' />
      <img src='/assets/recharge/visa.png' />
      <img src='/assets/recharge/stripe.png' />
    </div>
    <div className='bot-content'>
      <div className='recharge-btn touch-btn' onClick={() => handleToPay()}>
        <FormattedMessage id='recharge' />
      </div>
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
            return <img src='/assets/coin.png' className={`img${index} img`} key={index} />
          })
        }
      </div>
      <div className='score'>{score.toLocaleString()}</div>
    </div>
    <div className='bot'>
      ${price}
    </div>
  </div>
}

export default RechargePage;