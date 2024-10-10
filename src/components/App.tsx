import {
  bindViewportCSSVars,
  initBackButton,
  initInitData,
  initMiniApp,
  initSwipeBehavior,
  initViewport,
  retrieveLaunchParams
} from '@telegram-apps/sdk';

import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { routes } from '@/navigation/routes';
import { useDispatch } from 'react-redux';
import { getSystemReq, loginReq } from '@/api/common';
import { setSystemAction, setUserInfoAction } from '@/redux/slices/userSlice';
import Congrates from './Congrates';
import EventBus from '@/utils/eventBus';
import Loading from './Loading';
import { Toast } from 'antd-mobile';
import moment from 'moment';
import Footer from './Footer';

export const App: FC = () => {
  const [backButton] = initBackButton()
  const [swipeBehavior] = initSwipeBehavior();
  const [viewport] = initViewport();
  const [miniApp] = initMiniApp()
  const launchParams = retrieveLaunchParams()
  const myLocation = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isShowCongrates, setShowCongrates] = useState(false)
  const [showTime, setShowTime] = useState(1500)
  const eventBus = EventBus.getInstance()
  const [loading, setLoading] = useState(true)

  const login = async () => {
    setLoading(true)
    try {
      const initData = initInitData() as any;
      let resArray: any;
      if (initData && initData.user && initData.user.id) {
        const user = initData.initData.user
        const data = { ...initData.initData, ...user }
        resArray = await Promise.all([loginReq(data), getSystemReq()])
      }
      const [res, sys] = resArray
      if (sys.code == 0) {
        dispatch(setSystemAction(sys.data))
      }
      if (res.code == 0) {
        localStorage.setItem('authorization', res.data.token)
        dispatch(setUserInfoAction(res.data))
      } else {
        Toast.show({
          content: res.msg,
          position: 'center',
          duration: 5000,
        })
      }
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }
  const disSwipe = () => {
    try {
      let version: any = launchParams.version
      version = parseFloat(version)
      console.log('current Version:', version)
      if (version > 7.7) {
        const [swipeBehavior] = initSwipeBehavior();
        console.log('disableVerticalSwipe')
        swipeBehavior.disableVerticalSwipe();
      }
    } catch (error) {
      console.error(error)
    }
  }

  const expandViewPort = async () => {
    const vp = await viewport;
    if (!vp.isExpanded) {
      vp.expand(); // will expand the Mini App, if it's not
    }
    bindViewportCSSVars(vp);
  }

  useEffect(() => {
    login()
    const onMessage = ({ visible, time }: { visible: boolean, time?: number }) => {
      setShowCongrates(visible)
      setShowTime(time || 1500)
    }
    const onLoading = (flag: boolean) => {
      setLoading(flag)
    }
    eventBus.addListener('showCongrates', onMessage)
    eventBus.addListener('loading', onLoading)
  }, [])

  useEffect(() => {
    backButton.on('click', () => {
      navigate(-1)
    })
    disSwipe()
    // const tp = initThemeParams();
    // bindThemeParamsCSSVars(tp);
    expandViewPort()
    Toast.config({
      position: 'top',
      duration: 3000
    })
  }, [])

  useEffect(() => {
    if (myLocation.pathname !== '/') {
      backButton.show()
    } else {
      backButton.hide()
    }
  }, [myLocation.pathname])

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'}
    >
      <div className='layout'>
        <div className='content'>
          <Routes>
            {routes.map((route) => <Route key={route.path} {...route} />)}
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </div>
        <Footer />
        {
          loading ? <Loading /> : null
        }
      </div>
    </AppRoot>
  );
};


