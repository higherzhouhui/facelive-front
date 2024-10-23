import './index.scss'
import { useEffect, useState } from 'react'
import { getSubUserTotalReq } from '@/api/common'
import { Button, Skeleton } from 'antd-mobile'
import { useSelector } from 'react-redux'
import { initUtils } from '@telegram-apps/sdk'
import { useNavigate } from 'react-router-dom'
import { handleCopyLink } from '@/utils/common'
import { useHapticFeedback } from '@telegram-apps/sdk-react'
import { FormattedMessage } from 'react-intl'

function FrensPage() {
  const userInfo = useSelector((state: any) => state.user.info);
  const config = useSelector((state: any) => state.user.system);
  const systemConfig = config.base
  const navigate = useNavigate()
  const utils = initUtils()
  const [isCopy, setIsCopy] = useState(false)
  const link = `${systemConfig?.tg_link}?startapp=${btoa(userInfo.user_id)}`;
  const [isH5PcRoot, setIsH5PcRoot] = useState(false)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const hapticFeedback = useHapticFeedback()
  const initData = async () => {
    setLoading(true)
    const [resTotal] = await Promise.all([getSubUserTotalReq()])
    setTotal(resTotal.data.total)
    setLoading(false)
  }
  const routeToDetail = () => {
    navigate(`/frens-detail?total=${total}`)
  }
  const handleShare = () => {
    if (isH5PcRoot) {
      const open = window.open(link)
      if (!open) {
        location.href = link
      }
    } else {
      utils.shareURL(link, ``)
    }
  }

  const copy = () => {
    handleCopyLink(link)
    hapticFeedback.notificationOccurred('success')
    setIsCopy(true)
    setTimeout(() => {
      setIsCopy(false)
    }, 3000);

  }

  useEffect(() => {
    initData()
    if (localStorage.getItem('h5PcRoot') == '1') {
      setIsH5PcRoot(true)
      // const _link = `${location.origin}?startParam=${btoa(userInfo.user_id)}`
      // setLink(_link)
    } else {
      setIsH5PcRoot(false)
    }
  }, [])
  return <div className='frens-page'>
    <div className='frens-page-top'>
      <div className='frens-title'>
        <img src='/assets/invite.png' width={42}/>
        <div className='invite-earn'>
          <FormattedMessage id='inviteTitle' />
          <div className='high'>
            <FormattedMessage id='coin' />
          </div>
        </div>
      </div>
      {
        loading ? <div className='skeleton-wrapper'>
          <Skeleton className='skeleton2' animated />
        </div> : <div></div>
      }
      {
        total ? <div className='sub-container' onClick={() => routeToDetail()}>
          <div className='total'>{total}</div>
          <div className='frens'>
            <FormattedMessage id='friends' />
          </div>
          <div className='view-frens touch-btn'>
            <FormattedMessage id='friends-detail' />
            &nbsp;&nbsp;&gt;</div>
        </div> : <div></div>
      }
      <div className='rules-container'>
        <div className='rules-title'>
          <FormattedMessage id='yqgz' />
        </div>
        <div className='rules-content'>
          <div className='rules-list'>
            <div className='rules-list-title'><FormattedMessage id='myqygpy' /></div>
            <div className='rules-desc'>
            <FormattedMessage id='njhd' /> {systemConfig?.invite_normal}
              &nbsp;<img src="/assets/coin.png" alt="unit" />
            </div>
          </div>
          <div className='rules-list'>
            <div className='rules-list-title'>
              <FormattedMessage id='yqyghy' />
            </div>
            {/* <div className='rules-list-title'>Invite a Friends with a Telegram Premium Account</div> */}
            <div className='rules-desc'>
            <FormattedMessage id='njhd' /> {systemConfig?.invite_hy}
              &nbsp;<img src="/assets/coin.png" alt="unit" />
            </div>
          </div>
          <div className='rules-list'>
            <div className='rules-list-title'><FormattedMessage id='czjl' /></div>
            <div className='rules-desc-special'>
            <FormattedMessage id='get' /> {systemConfig?.invite_friends_ratio}% <FormattedMessage id='npydczjb' />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='page-bottom'>
      <Button className='touch-btn' color="default" style={{ fontWeight: 'bold', height: '45px', borderRadius: '100px', flex: 1, background: 'var(--btnBg)', color: '#fff', border: 'none' }} onClick={() => handleShare()}>
        👆🏻 <FormattedMessage id='yqpy' />
      </Button>
      <Button color="default" className="copy" onClick={() => copy()} style={{ borderRadius: '100px', height: '45px', padding: '0 12px' }}>
        {
          isCopy ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3786" width="18" height="18"><path d="M416.832 798.08C400.64 798.08 384.512 791.872 372.16 779.52L119.424 525.76C94.784 500.992 94.784 460.8 119.424 436.032 144.128 411.264 184.128 411.264 208.768 436.032L416.832 644.928 814.4 245.76C839.04 220.928 879.04 220.928 903.744 245.76 928.384 270.528 928.384 310.656 903.744 335.424L461.504 779.52C449.152 791.872 432.96 798.08 416.832 798.08Z" fill="#fff" p-id="3787"></path></svg> : <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2452" width="18" height="18"><path d="M878.272 981.312H375.36a104.64 104.64 0 0 1-104.64-104.64V375.36c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v502.912c-1.6 56.192-48.448 103.04-104.64 103.04z m-502.912-616.96a10.688 10.688 0 0 0-10.944 11.008v502.912c0 6.208 4.672 10.88 10.88 10.88h502.976c6.208 0 10.88-4.672 10.88-10.88V375.36a10.688 10.688 0 0 0-10.88-10.944H375.36z" fill="#fff" p-id="2453"></path><path d="M192.64 753.28h-45.312a104.64 104.64 0 0 1-104.64-104.64V147.328c0-57.792 46.848-104.64 104.64-104.64h502.912c57.792 0 104.64 46.848 104.64 104.64v49.92a46.016 46.016 0 0 1-46.848 46.912 46.08 46.08 0 0 1-46.848-46.848v-49.984a10.688 10.688 0 0 0-10.944-10.944H147.328a10.688 10.688 0 0 0-10.944 10.88v502.976c0 6.208 4.672 10.88 10.88 10.88h45.312a46.08 46.08 0 0 1 46.848 46.912c0 26.496-21.824 45.248-46.848 45.248z" fill="#fff" p-id="2454"></path></svg>
        }
      </Button>
    </div>
  </div>
}

export default FrensPage;