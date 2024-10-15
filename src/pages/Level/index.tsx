import Header from '@/components/Header'
import './index.scss'
import { SwiperRef, Swiper, Toast } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { getBagListReq, userUpgradeReq } from '@/api/common'
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfoAction } from '@/redux/slices/userSlice'
import EventBus from '@/utils/eventBus'

export default function () {
  const userInfo = useSelector((state: any) => state.user.info)
  const systemInfo = useSelector((state: any) => state.user.system)
  const eventBus = EventBus.getInstance()
  const [myLevelInfo, setMyLevelInfo] = useState<any>({})
  const ref = useRef<SwiperRef>(null)
  const [skinList, setSkinList] = useState([])
  const [progress, setProgress] = useState(0)
  const [upPiece, setUpPiece] = useState(0)
  const dispatch = useDispatch()
  const initData = async () => {
    eventBus.emit('loading', true)
    const res = await getBagListReq()
    eventBus.emit('loading', false)
    if (res.code == 0) {
      setSkinList(res.data)
    }
  }
  const handleUpgrade = async () => {
    eventBus.emit('loading', true)
    const res = await userUpgradeReq({piece: upPiece})
    eventBus.emit('loading', false)
    if (res.code == 0) {
      Toast.show({
        content: res.msg
      })
      dispatch(setUserInfoAction(res.data))
    }
  }
  useEffect(() => {
    initData()
  }, [])

  useEffect(() => {
    try {
      const _info = systemInfo?.level[userInfo?.current_level]
      setMyLevelInfo(_info)
      const levelDis = systemInfo?.level[userInfo?.current_level + 1].exp - _info.exp
      const extraExp = userInfo?.exp - _info.exp
      const _progress = (extraExp / levelDis) * 100
      setUpPiece(systemInfo?.level[userInfo?.current_level + 1].exp - userInfo?.exp)
      setProgress(_progress)
    } catch (error) {
      console.error(error)
    }
  }, [userInfo])
  const items = skinList.map((item: any, index) => (
    <Swiper.Item key={index}>
      <div className='swiper-item'>
        <div className='img-wrapper'>
          <img src={`/assets/shop/${item.skin.skin}.png`} className='skin-img' />
          <div className='level'>LV.{userInfo.current_level}</div>
        </div>

        <div className='column'>
          <div className='label'>Speed:</div>
          <div className='value'>{item.skin.speed * 100}%</div>
        </div>
        <div className='column'>
          <div className='label'>Life:</div>
          <div className='value'>{item.skin.life}</div>
        </div>
        <div className='column'>
          <div className='label'>Strike:</div>
          <div className='value'>{item.skin.strike * 100}%</div>
        </div>
        <div className='column'>
          <div className='label'>Attack:</div>
          <div className='value'>{myLevelInfo?.attack}</div>
        </div>
        <div className='column'>
          <div className='label'>Efficiency:</div>
          <div className='value'>{myLevelInfo?.efficiency * 100}%</div>
        </div>
      </div>
    </Swiper.Item>
  ))


  return <div className='level-page fadeIn'>
    <Header title='Level' />
    <div className='level-wrapper'>
      <div className='level-content'>
        <Swiper allowTouchMove={false} ref={ref} loop indicator={false}>
          {items}
        </Swiper>
        {
          userInfo?.current_level == 0 ? <div className='level-desc'>{systemInfo?.level[userInfo?.current_level + 1].exp} pieces or less</div> :
          <div className='level-desc'>{`${myLevelInfo.exp} ~ ${systemInfo?.level[userInfo?.current_level + 1].exp}`} pieces</div>
        }
        <div className='level-progress'>
          <div className='progress'><div className='p-bar' style={{ width: progress + '%' }} /></div>
        </div>
        <div className='total'>total: {userInfo?.piece} <img src="/assets/shop/piece.png" alt="piece" /></div>
        <div className='up-btn' onClick={() => handleUpgrade()}>
          <span>Upgrade {upPiece}</span>
          <img src="/assets/shop/piece.png" alt="piece" />
        </div>
        {/* <Button
          onClick={() => {
            ref.current?.swipePrev()
          }}
        >
          上一张
        </Button>
        <Button
          onClick={() => {
            ref.current?.swipeNext()
          }}
        >
          下一张
        </Button> */}
      </div>
    </div>
  </div>
}