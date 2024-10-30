import { InfiniteScroll, List } from 'antd-mobile'
import './index.scss'
import { useEffect, useState } from 'react'
import { getMyScoreHistoryReq, getSubUserListReq } from '@/api/common'
import { useLocation } from 'react-router-dom'
import { stringToColor } from '@/utils/common'
import moment from 'moment'
import BackTop from '@/components/BackTop'
import { FormattedMessage } from 'react-intl'

function FriendPage() {
  const [list, setList] = useState<any>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const myLocation = useLocation()
  const [isMyself, setIsMyself] = useState(false)

  const getList = async (mySelf: boolean) => {
    let res: any
    if (mySelf) {
      res = await getMyScoreHistoryReq({ page })
    } else {
      res = await getSubUserListReq({ page })
    }
    setPage((page => page + 1))
    return res.data.rows
  }
  const getType = (type: string) => {
    if (type == 'register') {
      type = 'Register'
    }
    if (type == 'checkIn_parent') {
      type = 'checkIn'
    }
    if (type == 'chat_video') {
      type = 'chat_video'
    }
    if (type == 'recharge_parent') {
      type = 'rechargeParent'
    }
    if (type == 'recharge_star' || type == 'recharge_ton') {
      type = 'recharge'
    }
    return type
  }
  async function loadMore() {
    const search = myLocation.search
    let isMyself = false
    if (search) {
      if (search.includes('myself')) {
        isMyself = true
      }
    }


    const append = await getList(isMyself)
    if (page == 1) {
      if (append.length < 20) {
        setHasMore(false)
      }
      setList(append)
    } else {
      setList((val: any) => [...val, ...append])
      setHasMore(append.length > 0)
    }
  }
  useEffect(() => {
    const search = myLocation.search
    if (search) {
      const _total = search.replace('?total=', '') as any
      if (_total) {
        setTotal(_total)
      }
      if (search.includes('myself')) {
        setIsMyself(true)
      } else {
        setIsMyself(false)
      }
    }

  }, [])

  return <div className="frens-detail-page">
    <div className="frens-title">
      {
        isMyself ? <span><FormattedMessage id='myScore' /></span> : <span>{total}&nbsp;<FormattedMessage id='friends' /></span>
      }
    </div>
    <List>
      {
        list.map((item: any, index: number) => {
          return <List.Item key={index}>
            <div className='frens-list'>
              <div className='frens-detail-left'>
                <div className='score' style={{ color: `${item.score > 0 ? 'var(--rise)' : 'var(--fall)'}` }}>
                  {
                    item.score > 0 ? '+' : ''
                  }
                  &nbsp;{item?.score?.toLocaleString()}<img src='/assets/coin.png' /></div>
                {
                  item.amount ? <div className='score' style={{ color: 'var(--fall)' }}>- &nbsp;{item.amount}
                    {
                      item.type == 'recharge_ton' ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.1839 17.7069C13.6405 18.6507 13.3688 19.1226 13.0591 19.348C12.4278 19.8074 11.5723 19.8074 10.941 19.348C10.6312 19.1226 10.3595 18.6507 9.81613 17.7069L5.52066 10.2464C4.76864 8.94024 4.39263 8.28717 4.33762 7.75894C4.2255 6.68236 4.81894 5.65591 5.80788 5.21589C6.29309 5 7.04667 5 8.55383 5H15.4462C16.9534 5 17.7069 5 18.1922 5.21589C19.1811 5.65591 19.7745 6.68236 19.6624 7.75894C19.6074 8.28717 19.2314 8.94024 18.4794 10.2464L14.1839 17.7069ZM11.1 16.3412L6.56139 8.48002C6.31995 8.06185 6.19924 7.85276 6.18146 7.68365C6.14523 7.33896 6.33507 7.01015 6.65169 6.86919C6.80703 6.80002 7.04847 6.80002 7.53133 6.80002H7.53134L11.1 6.80002V16.3412ZM12.9 16.3412L17.4387 8.48002C17.6801 8.06185 17.8008 7.85276 17.8186 7.68365C17.8548 7.33896 17.665 7.01015 17.3484 6.86919C17.193 6.80002 16.9516 6.80002 16.4687 6.80002L12.9 6.80002V16.3412Z" fill="#FFFFFF"></path></svg>
                        : <img src='/assets/star.png' width={22} />
                    }

                  </div> : <div></div>
                }
                <div className='frens-detail-time'>{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</div>
              </div>
              <div className='frens-detail-right'>
                <div className='by-user'>
                  by<div className="user-icon" style={{ background: stringToColor(item?.from_username) }}>
                    {item?.from_username?.slice(0, 2)}
                  </div>
                  <div className='frens-detail-name'>{item.from_username}</div>
                </div>
                <div className='type'><FormattedMessage id={getType(item.type)} /></div>
              </div>
            </div>
          </List.Item>
        })
      }
    </List>
    <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
      <div></div>
    </InfiniteScroll>
    <BackTop scrollName={'content'} />

  </div>
}

export default FriendPage