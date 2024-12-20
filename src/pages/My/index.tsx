import { getFileUrl, getUserName, stringToColor } from '@/utils/common';
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { initUtils } from '@telegram-apps/sdk';
import { useEffect } from 'react';
import { getUserInfoReq } from '@/api/common';
import { setUserInfoAction } from '@/redux/slices/userSlice';
import moment from 'moment';
import VideoPlayer from '@/components/VideoPlayer';

function MyselfPage() {
  const userinfo = useSelector((state: any) => state.user.info);
  const navigate = useNavigate()
  const config = useSelector((state: any) => state.user.system);
  const utils = initUtils()
  const dispatch = useDispatch()
  const handleJoinTg = () => {
    utils.openTelegramLink(config.base.channel_url)
  }

  const handleRouter = (url?: string) => {
    if (url) {
      navigate(url)
    } else {
      utils.openTelegramLink(config.base.help_link)
    }
  }


  const handleCount = (str?: string) => {
    if (!str) {
      return 0
    }
    const _arr = str.split(',')
    const arr = _arr.filter(item => {
      return item
    })
    return arr.length
  }

  const list = [
    {
      icon: anchor,
      label: <FormattedMessage id='scdzb' />,
      value: handleCount(userinfo?.follow_anchor),
      rightIcon: right,
      link: '/follow',
    },
    {
      icon: chat,
      label: <FormattedMessage id='lgtdzb' />,
      value: handleCount(userinfo?.chat_anchor),
      rightIcon: right,
      link: '/chat',
    },
    {
      icon: language,
      label: <FormattedMessage id='language' />,
      value: <FormattedMessage id={userinfo?.lang || 'en'} />,
      rightIcon: right,
      link: '/language',
    },
    {
      icon: help,
      label: <FormattedMessage id='helpfk' />,
    },
  ]

  useEffect(() => {
    getUserInfoReq().then(res => {
      if (res.code == 0) {
        dispatch(setUserInfoAction(res.data))
      }
    })
  }, [])
  return <div className='my-page'>
    <div className='title'>
      {
        userinfo?.photoUrl ? <img src={getFileUrl(userinfo?.photoUrl)} className='g-avatar' /> : <div className='icon' style={{ background: stringToColor(userinfo?.username) }}>{getUserName(userinfo).substring(0, 2)}</div>
      }
      <div className='name'>
        <div className='username'>{getUserName(userinfo)}</div>
        <div>ID: {userinfo?.user_id}</div>
        <div><FormattedMessage id='join' />: {moment(userinfo?.createdAt).format('YYYY-MM-DD HH:mm')}</div>
      </div>
    </div>
    <div className='balance-wrapper'>
      <div className='balance'>
        <div className='bc' onClick={() => navigate('/frens-detail?myself=1')}>
          <div className='bc-left'>
            <span className='balance-count'>{userinfo?.score}&nbsp;</span>Coins
          </div>
          <div className='bc-right touch-btn'>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2346" width="18" height="18"><path d="M411.733333 885.333333H192c-6.4 0-10.666667-4.266667-10.666667-10.666666V149.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h576c6.4 0 10.666667 4.266667 10.666667 10.666666v219.733334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666H192C151.466667 74.666667 117.333333 108.8 117.333333 149.333333v725.333334c0 40.533333 34.133333 74.666667 74.666667 74.666666h219.733333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" fill="#dbdbdb" p-id="2347"></path><path d="M704 458.666667c-134.4 0-245.333333 110.933333-245.333333 245.333333S569.6 949.333333 704 949.333333 949.333333 838.4 949.333333 704 838.4 458.666667 704 458.666667z m0 426.666666c-100.266667 0-181.333333-81.066667-181.333333-181.333333s81.066667-181.333333 181.333333-181.333333 181.333333 81.066667 181.333333 181.333333-81.066667 181.333333-181.333333 181.333333z" fill="#dbdbdb" p-id="2348"></path><path d="M802.133333 716.8l-66.133333-29.866667V597.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v110.933334c0 12.8 8.533333 23.466667 19.2 29.866666l85.333333 38.4c4.266667 2.133333 8.533333 2.133333 12.8 2.133334 12.8 0 23.466667-6.4 29.866667-19.2 6.4-17.066667 0-34.133333-17.066667-42.666667zM693.333333 298.666667c0-17.066667-14.933333-32-32-32H298.666667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h362.666666c17.066667 0 32-14.933333 32-32zM298.666667 437.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h106.666666c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-106.666666z" fill="#dbdbdb" p-id="2349"></path></svg>
          </div>
        </div>
        <span className='yue-desc'><FormattedMessage id='yue' /></span>
      </div>
      <div className='btn-group'>
        <div className='btn touch-btn' onClick={() => handleRouter('/frens')}>
          <FormattedMessage id='freeCoin' />
        </div>
        <div className='btn recharge-btn touch-btn' onClick={() => handleRouter('/recharge')}>
          <img src='/assets/coin.png' />
          <FormattedMessage id='recharge' />
        </div>
      </div>
    </div>
    <div className='join-tg touch-btn' onClick={() => handleJoinTg()}>
      <div className='join-top'>
        <FormattedMessage id='join' />
        <svg viewBox="0 0 1466 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3463" width="20"><path d="M921.355609 7.942721L1455.961814 488.782816a30.548926 30.548926 0 0 1 0 45.212411l-534.606205 481.451074a30.548926 30.548926 0 0 1-50.711218-22.606206V603.646778a30.548926 30.548926 0 0 0-30.548926-30.548926H61.097852a61.097852 61.097852 0 1 1 0-122.195704h778.997613a30.548926 30.548926 0 0 0 30.548926-30.548926V30.548926a30.548926 30.548926 0 0 1 50.711218-22.606205z" fill="#e6e6e6" p-id="3464"></path></svg>
      </div>
      <div className='join-bot'>
        <FormattedMessage id='community' />
      </div>
    </div>
    <div className='menu'>
      {
        list.map((item: any, index: number) => {
          return <div key={index} className='menu-item touch-btn' onClick={() => handleRouter(item.link)}>
            <div className='left'>
              {item.icon}
              <div className='label'>{item.label}</div>
            </div>
            <div className='right'>
              <span>{item.value}</span>
              {item.rightIcon}
            </div>
          </div>
        })
      }
    </div>
  </div>
}
var anchor = <svg viewBox="0 0 1064 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23609"><path d="M235.52 296.96a266.24 266.24 0 0 1 532.48 0V348.16a51.2 51.2 0 1 1-102.4 0V296.96a163.84 163.84 0 0 0-327.68 0v61.44c0 40.1408 14.336 76.71808 38.21568 105.22624 13.27104 15.7696 23.22432 37.2736 23.22432 61.97248v69.50912a87.2448 87.2448 0 0 1-38.83008 72.58112c-34.4064 22.9376-74.5472 33.62816-104.81664 41.69728l-9.46176 2.53952a153.72288 153.72288 0 0 0-112.80384 137.99424H471.04a51.2 51.2 0 1 1 0 102.4H122.88A92.16 92.16 0 0 1 30.72 860.16a256.08192 256.08192 0 0 1 188.6208-246.9888c2.58048-0.73728 5.07904-1.4336 7.53664-2.048 29.81888-8.11008 51.8144-14.09024 70.08256-24.45312v-58.1632a265.37984 265.37984 0 0 1-61.44-170.10688v-61.44zM778.24 839.68a40.96 40.96 0 0 1 40.96 40.96v81.92a40.96 40.96 0 1 1-81.92 0v-81.92a40.96 40.96 0 0 1 40.96-40.96z" fill="#dbdbdb" p-id="23610"></path><path d="M573.44 634.88a40.96 40.96 0 0 1 40.96 40.96 163.84 163.84 0 0 0 327.68 0 40.96 40.96 0 1 1 81.92 0 245.76 245.76 0 0 1-491.52 0 40.96 40.96 0 0 1 40.96-40.96z" fill="#dbdbdb" p-id="23611"></path><path d="M645.12 583.68a133.12 133.12 0 0 1 266.24 0v81.92a133.12 133.12 0 0 1-266.24 0v-81.92zM778.24 532.48c-28.2624 0-51.2 22.9376-51.2 51.2v81.92a51.2 51.2 0 1 0 102.4 0v-81.92c0-28.2624-22.9376-51.2-51.2-51.2z" fill="#dbdbdb" p-id="23612"></path></svg>
var chat = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26274"><path d="M707.456 391.872C675.136 246.976 530.496 137.6 357.12 137.6 159.936 137.6 0 278.976 0 453.376c0 84.096 37.184 160.448 97.792 216.96 18.688 17.664 19.52 47.168 1.792 65.792l-28.672 30.144s271.36 2.944 286.272 2.944c69.12 0 133.632-17.408 188.288-47.488 101.376-55.68 168.832-155.072 168.832-268.416-0.064-20.992-2.368-41.536-6.848-61.44zM185.984 509.44c-31.04 0-56.064-25.024-56.064-56.064 0-30.976 25.024-56.064 56.064-56.064 30.976 0 56.064 25.088 56.064 56.064 0 31.04-25.088 56.064-56.064 56.064z m171.136 0c-30.976 0-56.064-25.024-56.064-56.064 0-30.976 25.088-56.064 56.064-56.064s56.064 25.088 56.064 56.064c0 31.04-25.088 56.064-56.064 56.064z m173.184-0.064c-0.704 0.064-1.344 0.064-2.048 0.064-30.976 0-56.064-25.024-56.064-56.064 0-30.976 25.088-56.064 56.064-56.064 28.48 0 51.968 21.184 55.552 48.64 0.32 2.496 0.512 4.928 0.512 7.488a55.776 55.776 0 0 1-54.016 55.936z" fill="#dbdbdb" p-id="26275" data-spm-anchor-id="a313x.search_index.0.i34.766b3a81FJsSKH" ></path><path d="M956.096 809.216l19.584 20.544h-159.296c-1.92 0-3.84 0.128-5.76 0.32-9.856 1.088-19.84 1.728-30.016 1.728-85.184 0-160.192-38.72-203.584-97.344 101.376-55.68 168.832-155.072 168.832-268.416 0-21.056-2.368-41.6-6.848-61.504 13.504-2.112 27.456-3.136 41.6-3.136 134.4 0 243.328 96.32 243.328 215.168 0 57.28-25.344 109.312-66.624 147.84-12.672 11.968-13.184 32.064-1.216 44.8z" fill="#dbdbdb" p-id="26276" data-spm-anchor-id="a313x.search_index.0.i36.766b3a81FJsSKH" ></path></svg>
var language = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30035"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448-200.6-448-448-448zM362.5 158.1c27.4-11.5 55.8-19.8 84.9-24.7C409.8 162 376.6 196.3 348.7 235.2c-21.8-9.2-43-20.4-63.2-33.4 23.8-17.5 49.6-32.1 77-43.7zM158.2 362.5c19.3-45.7 47-86.7 82.3-122l0.9-0.9C265.7 256.5 291.6 271 318.6 283c-34 61.8-53.7 130.1-57.8 201H129c3-42 12.8-82.7 29.2-121.5z m82.3 421c-35.3-35.3-63-76.3-82.3-122C141.8 622.7 132 582 129 540h131.8c4.1 70.8 23.8 139.2 57.8 200.9-27 12-52.8 26.6-77.2 43.5l-0.9-0.9z m122 82.3c-27.4-11.5-53.1-26.2-76.9-43.6 20.2-13 41.3-24.1 63.1-33.4 27.9 39 61.1 73.2 98.6 101.8-29.1-4.9-57.4-13.2-84.8-24.8zM484 848.3c-30.3-22.6-57.2-49-80-78.4 26-6.8 52.7-11.2 80-13v91.4z m0-308.3v160.8c-38.4 2.2-76.1 9-112.7 20.3-31.1-54.4-50.1-116.1-54.4-181.2H484v0.1z m0-56H316.9c4.3-65 23.3-126.7 54.5-181.1C407.9 314.2 445.6 321 484 323.2V484z m0-216.9c-27.3-1.8-54-6.1-79.9-13 22.8-29.4 49.7-55.8 79.9-78.4v91.4zM783.5 240.6c35.3 35.2 63 76.2 82.3 121.9C882.2 401.3 892 442 895 484H763.2c-4.1-70.9-23.8-139.2-57.8-200.9 27-12 52.8-26.5 77.2-43.4l0.9 0.9zM661.4 158.2c27.5 11.5 53.2 26.2 77 43.6-20.2 13-41.3 24.2-63.2 33.4-26.4-36.9-57.9-69.8-93.6-97.8-1.7-1.4-3.5-2.7-5.2-4 29.1 4.9 57.6 13.2 85 24.8zM540 176.2c29.8 22.5 56.4 48.9 79.1 78.1-25.7 6.7-52.1 11-79.1 12.8v-90.9z m0 147c38.1-2.2 75.5-8.9 111.8-20.1 31.4 54.6 50.8 116.4 55.2 180.9H540V323.2z m0 216.8h167.1c-4.3 65.1-23.3 126.7-54.4 181.2-36.6-11.3-74.3-18.1-112.7-20.3V540z m0 217c27 1.8 53.8 6.3 79.8 13.2-22.8 29.3-49.6 55.7-79.8 78.2V757z m121.6 108.8c-27.5 11.6-55.9 19.9-84.9 24.8 37.4-28.6 70.6-62.7 98.5-101.6 21.9 9.2 43.1 20.3 63.3 33.2-23.8 17.4-49.5 32-76.9 43.6z m204.2-204.3c-19.3 45.7-47 86.7-82.3 122l-0.9 0.9c-24.4-16.9-50.2-31.4-77.2-43.4 34-61.8 53.7-130.1 57.8-201H895c-3 42-12.8 82.7-29.2 121.5z" p-id="30036" fill="#dbdbdb"></path></svg>
var help = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31267"><path d="M512 958.326255c247.255337 0 447.696462-200.441125 447.696462-447.696462s-200.441125-447.696462-447.696462-447.696462-447.696462 200.441125-447.696462 447.696462S264.74364 958.326255 512 958.326255zM512 217.681788c35.32146 0 63.956637 28.635177 63.956637 63.956637 0 35.323507-28.635177 63.956637-63.956637 63.956637s-63.956637-28.633131-63.956637-63.956637C448.043363 246.316965 476.67854 217.681788 512 217.681788zM448.043363 510.629793c0-35.32146 28.635177-63.956637 63.956637-63.956637s63.956637 28.635177 63.956637 63.956637l0 223.848231c0 35.323507-28.635177 63.956637-63.956637 63.956637s-63.956637-28.633131-63.956637-63.956637L448.043363 510.629793z" fill="#dbdbdb" p-id="31268"></path></svg>
var right = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32334"><path d="M353.045333 86.826667L754.56 488.362667a32 32 0 0 1 2.090667 42.965333l-2.090667 2.282667L353.066667 935.168a8.533333 8.533333 0 0 1-6.037334 2.496h-66.368a8.533333 8.533333 0 0 1-6.037333-14.570667L686.72 511.018667 274.602667 98.901333a8.533333 8.533333 0 0 1 6.037333-14.570666h66.346667a8.533333 8.533333 0 0 1 6.058666 2.496z" fill="#dbdbdb" p-id="32335"></path></svg>

export default MyselfPage;