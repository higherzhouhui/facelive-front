import './index.scss'
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { followAnchorReq, getNextAnchorInfo, beginChatReq, getSwiperListReq, getMoreAnchorReq } from '@/api/common';
import EventBus from '@/utils/eventBus';
import { getFileUrl, secondsToTime } from '@/utils/common';
import { FormattedMessage } from 'react-intl';
import CountryFlag from '@/components/Flag';
import { initUtils } from '@telegram-apps/sdk';
import { useDispatch, useSelector } from 'react-redux';
import { DotLoading, Modal, Swiper } from 'antd-mobile';
import { setUserInfoAction } from '@/redux/slices/userSlice';
import { useHapticFeedback } from '@telegram-apps/sdk-react';


type AnchorDetailType = {
  anchorDetail: any,
  currentId: any,
  audioRef: any,
  endAudioRef: any,
}

function AnchorDetail({ anchorDetail, currentId, audioRef, endAudioRef }: AnchorDetailType) {
  const hapticFeedback = useHapticFeedback()
  const userinfo = useSelector((state: any) => state.user.info);
  const dispatch = useDispatch()
  const [detail, setDetail] = useState<any>({})
  const utils = initUtils()
  const [next, setNext] = useState(false)
  const [oldCover, setOldCover] = useState('')
  const [visible, setVisible] = useState(false)
  const [visibleNext, setVisibleNext] = useState(false)
  const [visibleQuit, setVisibleQuit] = useState(false)
  const [visibleCoin, setVisibleCoin] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const navigate = useNavigate()
  const inTimer = useRef<any>(null)
  const timer = useRef<any>(null)
  const countTime = useRef<any>(null)
  const touchTimer = useRef<any>(null)
  const lastTouch = useRef<any>(null)
  const anchorId = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const videoRef = useRef<any>(null)
  const [videoUrl, setVideoUrl] = useState('')
  // const audioRef = useRef<any>(null)
  // const endAudioRef = useRef<any>(null)
  const loadingTimer = useRef<any>(null)
  const [chatLoading, setChatLoading] = useState(false)

  const getAnchorDetail = async (info: any) => {
    setIsPlaying(false)
    if (timer.current) {
      clearTimeout(timer.current)
    }
    if (inTimer) {
      clearTimeout(inTimer.current)
    }
    if (loadingTimer.current) {
      clearInterval(loadingTimer.current)
    }
    videoRef?.current?.pause()
    audioRef?.current?.pause()

    setChatLoading(false)
    setVisible(false)
    setVisibleCoin(false)
    setVisibleQuit(false)
    setDetail(info)
    setOldCover(info?.cover)
    if (localStorage.getItem('chat') == '1' && sessionStorage.getItem('anchorId') == info?.id) {
      handleBeginVideo()
      localStorage.removeItem('chat')
    }
  }
  const handleRoute = (index: number) => {
    if (index == 0) {
      navigate('/recharge')
    } else {
      navigate('/frens')
    }
  }
  const handleOverChat = () => {
    setVisibleQuit(true)
    hapticFeedback.notificationOccurred('warning')
  }

  const handleConfirm = async (index: number) => {
    if (index == 0) {
      hapticFeedback.notificationOccurred('success')
      setChatLoading(true)
      setVideoUrl(detail?.video)
      audioRef?.current?.play()
      // const delay = 4000 + Math.random() * 6000
      loadingTimer.current = setInterval(() => {
        if (videoRef?.current?.readyState >= 3) {
          handlePlayVideo()
          audioRef?.current?.pause()
          clearInterval(loadingTimer.current)
        }
      }, 2000);
    } else {
      setVisibleCoin(false)
    }
  }
  const handlePlayVideo = async (Continue?: boolean) => {
    if (!Continue) {
      videoRef.current.currentTime = detail?.currentTime || 0
    }
    videoRef.current.muted = false

    if (timer.current) {
      clearTimeout(timer.current)
    }
    if (timer.current) {
      clearInterval(inTimer.current)
    }
    const res = await beginChatReq({ id: detail.id })
    setChatLoading(false)
    setVisibleCoin(false)
    if (res.code == 0) {
      setDetail({
        ...detail,
        time: res.data.time,
        currentTime: detail.currentTime + 60
      })
      dispatch(setUserInfoAction(res.data))
      const execPlay = () => {
        videoRef.current.play()
        setIsPlaying(true)
        if (!countTime.current) {
          countTime.current = 0
        }
        inTimer.current = setInterval(() => {
          countTime.current += 1
        }, 1000);
        // 60秒后重新扣费
        timer.current = setTimeout(() => {
          handlePlayVideo(true)
          clearTimeout(timer.current)
          clearTimeout(inTimer.current)
        }, 60000);
      }
      execPlay()

      // if (videoRef.current.readyState >= 3) {
      //   execPlay()
      // } else {
      //   // 否则，等待视频加载完成
      //   videoRef.current.addEventListener('canplaythrough', function () {
      //     if (isPlaying) {
      //       execPlay()
      //     }
      //   });
      // }
    } else {
      videoRef?.current?.pause()
      setIsPlaying(false)
      setVisible(true)
      clearTimeout(timer.current)
      clearTimeout(inTimer.current)
    }
  }

  const handelConfirmQuit = (index: any) => {
    if (index == 0) {
      clearTimeout(timer.current)
      clearInterval(inTimer.current)
      setIsPlaying(false)
      endAudioRef?.current?.play()
      videoRef?.current?.pause()
    } else {
      setVisibleQuit(false)
    }
  }
  const handleLike = async () => {
    const res = await followAnchorReq({ id: detail?.id, status: detail?.isLike, heart: detail?.heart })
    if (res.code == 0) {
      setDetail({
        ...detail,
        isLike: res.data.status,
        heart: res.data.heart
      })
    }
  }
  const handleBeginVideo = () => {
    if (userinfo.score < detail.coin) {
      setVisible(true)
    } else {
      setVisibleCoin(true)
    }
  }


  const handleToChannel = () => {
    utils.openTelegramLink(detail?.channel)
  }

  const handelConfirmNext = async (index: any) => {
    if (loading) {
      return
    }
    if (index == 0) {
      setNext(true)
      setIsPlaying(false)
      countTime.current = 0
      if (timer.current) {
        clearTimeout(timer.current)
      }
      setLoading(true)
      const res = await getNextAnchorInfo({ id: detail?.id })
      setLoading(false)
      if (res.code == 0) {
        setDetail(res.data)
        anchorId.current = res.data.id
        setTimeout(() => {
          setOldCover(res.data.cover)
        }, 400);
      }
      setTimeout(() => {
        setNext(false)
      }, 400);
    } else {
      setVisibleNext(false)
    }
  }

  const handleEndLoading = () => {
    setChatLoading(false)
    audioRef?.current?.pause()
    videoRef?.current?.pause()
    clearInterval(loadingTimer.current)
  }

  const handleNextAnchor = async () => {
    if (isPlaying) {
      setVisibleNext(true)
    } else {
      setNext(true)
      setIsPlaying(false)
      if (timer.current) {
        clearTimeout(timer.current)
      }
      // eventBus.emit('loading', true)
      const res = await getNextAnchorInfo({ id: anchorId.current })
      // eventBus.emit('loading', false)
      if (res.code == 0) {
        setDetail(res.data)
        anchorId.current = res.data.id
        sessionStorage.setItem('anchorId', `${res.data.id}`)
        setTimeout(() => {
          setOldCover(res.data.cover)
        }, 500);
      }
      setTimeout(() => {
        setNext(false)
      }, 500);
    }
  }


  useEffect(() => {
    // const _id = sessionStorage.getItem('anchorId') || 1
    // setId(_id)
    return () => {
      audioRef?.current?.pause()
      videoRef?.current?.pause()
      if (timer.current) {
        clearTimeout(timer.current)
      }
      if (inTimer.current) {
        clearInterval(inTimer.current)
      }
      if (loadingTimer) {
        clearInterval(loadingTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (anchorDetail) {
      getAnchorDetail(anchorDetail)
      if (currentId == anchorDetail.id) {
        sessionStorage.setItem('anchorId', `${currentId}`)
      }
    } else {
      getAnchorDetail({})
    }
  }, [anchorDetail, currentId])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('progress', function () {
        // 当前已加载的百分比
        var loadedPercent = (videoRef.current.buffered.end(videoRef.current.buffered.length - 1) / videoRef.current.duration) * 100;
        console.log('已加载百分比: ' + loadedPercent.toFixed(2) + '%');
        if (loadedPercent == 100) {

        } else {
        }
      });
    }

    // 获取元素
    const element = document.getElementById('touch')!;

    // 记录开始触摸的位置
    let startX: any = 0;
    let startY: any = 0;

    // 监听触摸开始事件
    element.addEventListener('touchstart', (e) => {
      // 获取第一个触点
      const touch = e.touches[0];
      // 记录开始位置
      startX = touch.pageX;
      startY = touch.pageY;
    });
    const onTouchMove = (e: any) => {
      // 阻止默认的处理方式（例如滚动页面）
      e.preventDefault();

      // 获取移动过程中的第一个触点
      const touch = e.touches[0];
      // 计算滑动的距离
      const endX = touch.pageX;
      const endY = touch.pageY;
      const distanceX = endX - startX;
      const distanceY = endY - startY;
      const _last = lastTouch.current || 0
      if (distanceY < -50) {
        if (new Date().getTime() > _last + 1000) {
          lastTouch.current = new Date().getTime()
          // handleNextAnchor()
        }
        touchTimer.current = setTimeout(() => {
          lastTouch.current = 0
        }, 1000);
      }
    }
    // 监听触摸移动事件
    element.addEventListener('touchmove', onTouchMove)
    return () => {
      element.removeEventListener('touchmove', onTouchMove)
      if (touchTimer.current) {
        clearTimeout(touchTimer.current)
      }
    }
  }, [])

  return <div className='anchor-page'>
    {/* <div className={`cover ${next ? 'next' : ''}`} style={{ backgroundImage: `url(${getFileUrl(oldCover)})` }}></div> */}
    <div className={`video`}>
      <video src={getFileUrl(videoUrl)} loop id='video' poster={getFileUrl(detail?.cover)} ref={videoRef} preload={videoUrl ? 'load' : ''}></video>
    </div>
    <div className='top-shadow' />
    <div className='bot-shadow' />
    <div className='top'>
      {
        isPlaying ? <div>{secondsToTime(countTime.current)}</div> : <><div className='status' />
          <FormattedMessage id='online' /></>
      }
    </div>
    <div className='main-content' id='touch' style={{ opacity: !isPlaying ? 1 : 0, zIndex: !isPlaying ? 1 : -1 }}>
      <div className='right-operation'>
        <div className='heart' onClick={() => handleLike()}>
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4724" width="38" height="38"><path d="M760.384 64c47.808 0 91.968 11.968 132.352 35.84a264.32 264.32 0 0 1 95.872 97.152A263.68 263.68 0 0 1 1024 330.88c0 34.752-6.592 68.544-19.712 101.312a262.4 262.4 0 0 1-57.536 87.424L512 960 77.248 519.68A268.8 268.8 0 0 1 0 330.88c0-48.384 11.776-93.056 35.392-133.952A264.32 264.32 0 0 1 131.2 99.84 255.296 255.296 0 0 1 263.68 64 260.736 260.736 0 0 1 449.92 142.208l62.08 62.912 62.144-62.912a258.944 258.944 0 0 1 86.336-58.24A259.584 259.584 0 0 1 760.512 64h-0.128z" fill={detail?.isLike ? 'red' : '#fff'} p-id="4725"></path></svg>
          <div className='count'>{detail?.heart}</div>
        </div>
        <div className='heart' onClick={() => handleToChannel()}>
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3670" width="38" height="38"><path d="M853.333333 138.666667H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v516.266667c2.133333 38.4 34.133333 70.4 74.666667 70.4h151.466666v119.466667c2.133333 27.733333 36.266667 38.4 55.466667 19.2l136.533333-138.666667H853.333333c40.533333 0 74.666667-34.133333 74.666667-74.666667V213.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666zM514.133333 554.666667H298.666667c-17.066667 0-32-14.933333-32-32s12.8-29.866667 29.866666-32H512c17.066667 0 32 14.933333 32 32s-12.8 29.866667-29.866667 32z m160-149.333334H298.666667c-17.066667 0-32-14.933333-32-32s12.8-29.866667 29.866666-32h375.466667c17.066667 0 32 14.933333 32 32s-12.8 29.866667-29.866667 32z" fill="#ffffff" p-id="3671"></path></svg>
          <div className='count'>{detail?.comments}</div>
        </div>
      </div>
      <div className='intro'>
        {detail?.name}
        <CountryFlag country={detail?.country} />
      </div>
      <div className='label'>
        <div className='label-item'>
          <FormattedMessage id={detail?.language || 'en'} />
        </div>
        <div className='label-item'>
          {detail?.age}
          <FormattedMessage id='age' />
        </div>
        <div className='label-item'>
          <FormattedMessage id={detail?.style || 'hot'} />
        </div>
      </div>
      <div className='detail'>
        <div className='detail-item'>
          <div className='count'>{detail?.star}</div>
          <div>
            {
              [...Array(detail?.star || 0).fill('')].map((item: string, index: number) => {
                return <svg key={index} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5757" width="12" height="12"><path d="M512.009505 25.054894l158.199417 320.580987 353.791078 51.421464L767.995248 646.579761l60.432101 352.365345-316.417844-166.354615-316.436854 166.354615 60.432101-352.365345L0 397.057345l353.791078-51.421464z" fill="#EFCE4A" p-id="5758"></path></svg>
              })
            }
          </div>
        </div>
        <div className='detail-item'>
          <div className='count'>{detail?.time}+s</div>
          <div className='count-desc'>
            <FormattedMessage id='chatTime' />
          </div>
        </div>
        <div className='detail-item'>
          <div className='count'>{detail?.fens}</div>
          <div className='count-desc'>
            <FormattedMessage id='fens' />
          </div>
        </div>
        <div className='detail-item'>
          <div className='count'>{detail?.return}</div>
          <div className='count-desc'>
            <FormattedMessage id='huitouke' />
          </div>
        </div>
      </div>
      <div className='join-btn' onClick={() => handleToChannel()}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8035" width="22" height="22"><path d="M223.938672 768.021332a160.15732 160.15732 0 0 1-159.986668-159.986668c0-88.227314 71.759353-159.986668 159.986668-159.986668s159.986668 71.759353 159.986668 159.986668A160.15732 160.15732 0 0 1 223.938672 768.021332z m0-255.978669a96.077327 96.077327 0 0 0-95.992001 95.992001c0 52.944921 43.047079 95.992001 95.992001 95.992s95.992001-43.047079 95.992-95.992A96.077327 96.077327 0 0 0 223.938672 512.042663zM415.922673 1024a31.997334 31.997334 0 0 1-31.997333-31.997334c0-88.227314-71.759353-159.986668-159.986668-159.986667s-159.986668 71.759353-159.986668 159.986667a31.997334 31.997334 0 0 1-63.994667 0c0-123.509708 100.471627-223.981335 223.981335-223.981334s223.981335 100.471627 223.981335 223.981334a31.997334 31.997334 0 0 1-31.997334 31.997334zM959.920007 1024a31.997334 31.997334 0 0 1-31.997334-31.997334c0-88.227314-71.759353-159.986668-159.986668-159.986667s-159.986668 71.759353-159.986667 159.986667a31.997334 31.997334 0 0 1-63.994668 0c0-123.509708 100.471627-223.981335 223.981335-223.981334s223.981335 100.471627 223.981335 223.981334a31.997334 31.997334 0 0 1-31.997333 31.997334z" p-id="8036" fill="#F22B79"></path><path d="M991.874677 800.018665c-28.754937 0-78.798767-11.263061-107.511041-82.510457A158.621448 158.621448 0 0 1 767.893342 768.021332a158.664111 158.664111 0 0 1-116.427631-50.470461c-28.7976 71.16207-78.798767 82.467794-107.553704 82.467794a31.997334 31.997334 0 0 1 0-63.994667c59.600367 0 63.824015-118.987418 63.994667-127.136072v-0.853262a160.15732 160.15732 0 0 1 159.986668-159.986668 160.413299 160.413299 0 0 1 160.029331 159.986668c0 1.23723 2.389134 127.989334 63.952004 127.989334a31.997334 31.997334 0 0 1 0 63.994667z m-319.930672-191.984001a96.333306 96.333306 0 0 0 95.949337 95.992 96.077327 96.077327 0 0 0 95.992001-95.992c0-52.902258-43.047079-95.992001-95.992001-95.992001a96.162653 96.162653 0 0 0-95.949337 95.992001zM478.381468 458.7991a63.141405 63.141405 0 0 1-44.454962-19.625031L242.667778 241.387884A144.11599 144.11599 0 0 1 247.104741 37.415549a134.943421 134.943421 0 0 1 93.51754-37.372886 134.388801 134.388801 0 0 1 98.210483 41.980502l41.127239 42.577785 41.255229-42.705775a134.602116 134.602116 0 0 1 97.826515-41.895175l3.455712 0.042663c36.178318 0.853262 69.882176 15.785351 94.882759 41.980502a144.11599 144.11599 0 0 1 0 199.279393l-193.050579 199.535372a63.653362 63.653362 0 0 1-44.326973 18.046496l-1.621198-0.085326zM340.622281 63.994667a71.03408 71.03408 0 0 0-51.793017 22.142155 80.206649 80.206649 0 0 0-0.042663 110.92409l191.088076 197.572869 191.258729-197.743522a80.07866 80.07866 0 0 0-0.12799-110.710774 71.03408 71.03408 0 0 0-50.129156-22.184818h-1.535872c-18.601117 0-36.220982 7.039413-49.574535 19.753021-0.810599 0.767936-1.621198 1.535872-2.346471 2.346471l-64.506625 66.767769a31.997334 31.997334 0 0 1-45.990834 0l-64.250646-66.554454a71.247396 71.247396 0 0 0-52.048996-22.312807z" p-id="8037" fill="#F22B79"></path></svg>
        <div className='join-text'>
          <FormattedMessage id='jrqz' />
        </div>
        <div className='join'>
          <FormattedMessage id='xsjr' />
        </div>
      </div>
      <div className='chat-btn' onClick={() => handleBeginVideo()}>
        <div className='left'>
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11230" data-spm-anchor-id="a313x.search_index.0.i20.766b3a81FJsSKH" width="22" height="22"><path d="M512 65C264.88 65 64.53 265.35 64.53 512.5S264.88 960 512 960s447.5-200.35 447.5-447.5S759.17 65 512 65z m75.71 530.56a20.34 20.34 0 0 1-20.31 20.34H336.87a20.34 20.34 0 0 1-20.34-20.34V429.44a20.34 20.34 0 0 1 20.34-20.34H567.4a20.34 20.34 0 0 1 20.34 20.34z m119.79 12.77a6.78 6.78 0 0 1-10.66 5.56l-83.63-63.77a6.8 6.8 0 0 1-2.9-5.56v-64.12a6.8 6.8 0 0 1 2.9-5.56l83.63-63.77a6.78 6.78 0 0 1 10.66 5.56z" fill="#ffffff" p-id="11231" data-spm-anchor-id="a313x.search_index.0.i18.766b3a81FJsSKH"></path></svg>
          <FormattedMessage id='ksytsplt' />
          ({detail?.coin}
          <FormattedMessage id='coin' />/<FormattedMessage id='minute' />)
        </div>
        <div className='right' />
      </div>
      {/* <div className='next-btn' onClick={() => handleNextAnchor()}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13215" width="20" height="20"><path d="M493.504 558.144a31.904 31.904 0 0 0 45.28 0l308.352-308.352a31.968 31.968 0 1 0-45.248-45.248l-285.728 285.728-294.176-294.144a31.968 31.968 0 1 0-45.248 45.248l316.768 316.768z" p-id="13216" fill="#e6e6e6"></path><path d="M801.888 460.576l-285.728 285.728-294.144-294.144a31.968 31.968 0 1 0-45.248 45.248l316.768 316.768a31.904 31.904 0 0 0 45.28 0l308.352-308.352a32 32 0 1 0-45.28-45.248z" p-id="13217" fill="#e6e6e6"></path></svg>
      </div> */}
    </div>
    <div className='playing-content chat-loading' style={{ opacity: chatLoading ? 1 : 0, zIndex: chatLoading ? 10 : -1 }}>
      <div className='anchor-avatar'>
        {
          currentId == detail?.id ? <img src={getFileUrl(detail?.avatar)} alt='avatar' /> : null
        }
        <div className='anchor-name'>{detail?.name}</div>
        <div className='loading-text'>
          <FormattedMessage id='ddjt' /><DotLoading color='#fff' />
        </div>
      </div>
      <div className='end-btn' onClick={() => handleEndLoading()}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4698"><path d="M841.216 856.064c185.856-185.856 185.856-487.424 0-673.792C655.36-3.584 353.792-3.584 167.424 182.272c-185.856 185.856-185.856 487.424 0 673.792 186.368 185.856 487.936 185.856 673.792 0zM218.624 495.104c0-47.616 111.104-113.664 285.696-113.664 175.104 0 285.696 66.048 285.696 113.664 0 40.96 10.752 102.4-73.728 93.184-84.48-9.216-78.848-40.96-78.848-83.456 0-29.696-68.608-36.352-133.12-36.352-65.024 0-133.12 6.656-133.12 36.352 0 42.496 5.632 74.24-78.848 83.456-84.992 9.216-73.728-51.712-73.728-93.184z" fill="#ff4530" p-id="4699"></path></svg>
      </div>
    </div>

    <div className='playing-content' style={{ opacity: isPlaying ? 1 : 0, zIndex: isPlaying ? 1 : -1 }}>
      <div className='coin'>
        {userinfo.score}
        <img src='/assets/coin.png' />
      </div>
      <div className='anchor-avatar'>
      </div>
      <div className='end-btn' onClick={() => handleOverChat()}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4698"><path d="M841.216 856.064c185.856-185.856 185.856-487.424 0-673.792C655.36-3.584 353.792-3.584 167.424 182.272c-185.856 185.856-185.856 487.424 0 673.792 186.368 185.856 487.936 185.856 673.792 0zM218.624 495.104c0-47.616 111.104-113.664 285.696-113.664 175.104 0 285.696 66.048 285.696 113.664 0 40.96 10.752 102.4-73.728 93.184-84.48-9.216-78.848-40.96-78.848-83.456 0-29.696-68.608-36.352-133.12-36.352-65.024 0-133.12 6.656-133.12 36.352 0 42.496 5.632 74.24-78.848 83.456-84.992 9.216-73.728-51.712-73.728-93.184z" fill="#ff4530" p-id="4699"></path></svg>
      </div>
    </div>
    <Modal visible={visible} content={<FormattedMessage id='hintAccount' />} title={<FormattedMessage id='hint' />} closeOnAction
      onClose={() => {
        setVisible(false)
      }}
      actions={[
        {
          key: 'recharge',
          text: <span><FormattedMessage id='recharge' />({userinfo.score})</span>,
        },
        {
          key: 'invite',
          text: <FormattedMessage id='freeCoin' />,
        },
      ]}
      onAction={(action, index) => handleRoute(index)}
      closeOnMaskClick
    />
    <Modal visible={visibleQuit} content={<FormattedMessage id='hintQuit' />} title={<FormattedMessage id='hint' />} closeOnAction
      onClose={() => {
        setVisibleQuit(false)
      }}
      actions={[
        {
          key: 'confirm',
          text: <FormattedMessage id='confirm' />,
        },
        {
          key: 'cancel',
          text: <FormattedMessage id='cancel' />,
        },
      ]}
      onAction={(action, index) => handelConfirmQuit(index)}
      closeOnMaskClick
    />
    <Modal visible={visibleNext} content={<FormattedMessage id='hintNext' />} title={<FormattedMessage id='hint' />} closeOnAction
      onClose={() => {
        setVisibleNext(false)
      }}
      actions={[
        {
          key: 'confirm',
          text: <FormattedMessage id='confirm' />,
        },
        {
          key: 'cancel',
          text: <FormattedMessage id='cancel' />,
        },
      ]}
      onAction={(action, index) => handelConfirmNext(index)}
      closeOnMaskClick
    />
    <Modal visible={visibleCoin} content={<div style={{ wordBreak: 'break-all' }}> <FormattedMessage id='ksytsplt' />
      ({detail?.coin}
      <FormattedMessage id='coin' />/<FormattedMessage id='minute' />)<div><FormattedMessage id='yue' />: <b>{userinfo?.score} Coins</b></div></div>} title={<FormattedMessage id='qrks' />} closeOnAction
      onClose={() => {
        setVisibleCoin(false)
      }}
      actions={[
        {
          key: 'begin',
          text: <span><FormattedMessage id='begin' /></span>,
        },
        {
          key: 'cancel',
          text: <FormattedMessage id='cancel' />,
        },
      ]}
      onAction={(action, index) => handleConfirm(index)}
      closeOnMaskClick
    />
  </div>
}

function AnchorPage() {
  const [details, setDetails] = useState<any>([])
  const [id, setId] = useState('')
  const [currentKey, setCurrentKey] = useState(1)
  const endAudioRef = useRef<any>(null)
  const audioRef = useRef<any>(null)

  const onIndexChange = (next: number) => {
    if (next == details.length - 1) {
      setId(details[details.length - 1].id)
    }
    setCurrentKey(next)
  }

  const getMoreAnchor = async () => {
    const res = await getMoreAnchorReq({ id: id })
    if (res.code == 0) {
      const details = res.data.details
      setDetails((val: any) => [...val, ...details])
    }
  }

  const initData = async (id: any) => {
    const res = await getSwiperListReq({ id: id })
    if (res.code == 0) {
      const details = res.data.details
      setDetails((val: any) => [...val, ...details])
    }
  }

  useEffect(() => {
    if (id) {
      getMoreAnchor()
    }
  }, [id])

  useEffect(() => {
    const id = sessionStorage.getItem('anchorId') || '0'
    initData(id)
  }, [])
  return <div className='anchor-container'>
    <Swiper
      direction='vertical'
      stuckAtBoundary={false}
      defaultIndex={currentKey}
      onIndexChange={onIndexChange}
      indicator={false}
      loop
      style={{ '--height': 'var(--tg-viewport-height)' }}
    >
      {
        details.map((item: any, index: number) => {
          return <Swiper.Item key={index}>
            <AnchorDetail anchorDetail={item} currentId={details[currentKey].id} audioRef={audioRef} endAudioRef={endAudioRef} />
          </Swiper.Item>
        })
      }
    </Swiper>
    <audio id="audioPlayer" ref={audioRef} loop>
      <source src="/assets/mp3/loading.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
    <audio id="audioPlayer" ref={endAudioRef}>
      <source src="/assets/mp3/end.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  </div>
}

export default AnchorPage;