import {
  bindViewportCSSVars,
  initBackButton,
  initInitData,
  initMiniApp,
  initSwipeBehavior,
  initViewport,
  retrieveLaunchParams,
  postEvent,
} from '@telegram-apps/sdk';

import { AppRoot } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useRef, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { routes } from '@/navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import { getSystemReq, loginReq, changeLangReq } from '@/api/common';
import { setSystemAction, setUserInfoAction } from '@/redux/slices/userSlice';
import EventBus from '@/utils/eventBus';
import Loading from './Loading';
import { Toast } from 'antd-mobile';
import Footer from './Footer';
import { IntlProvider } from 'react-intl';
import en from '@/locale/en.json'
import zh from '@/locale/zh.json'
const messages: any = {
  en,
  zh,
};


export const App: FC = () => {
  
  const [backButton] = initBackButton()
  const [viewport] = initViewport();
  const [miniApp] = initMiniApp()
  const launchParams = retrieveLaunchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [rotate, setRotate] = useState(0)
  const eventBus = EventBus.getInstance()
  const [loading, setLoading] = useState(true)
  const userInfo = useSelector((state: any) => state.user.info);
  const timer = useRef<any>(null)
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
        const data = res.data
        if (data.lang) {
          dispatch(setUserInfoAction(res.data))
        } else {
          const lang = data.languageCode == 'zh-hans' ? 'zh' : 'en'
          await changeLangReq({ lang: lang })
          dispatch(setUserInfoAction(res.data))
        }
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
    const onLoading = (flag: boolean) => {
      setLoading(flag)
    }
    // const onShiftLanguage = (lang: any) => {
    //   localStorage.setItem('lang', lang)
    //   setLocale(lang)
    // }
    eventBus.addListener('loading', onLoading)
    // eventBus.addListener('shiftLanguage', onShiftLanguage)
  }, [])

  useEffect(() => {
    backButton.on('click', () => {
      navigate(-1)
    })
    setTimeout(() => {
      postEvent('web_app_open_link', {url: 'https://www.baidu.com'})
    }, 5000);
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });

    disSwipe()
    // const tp = initThemeParams();
    // bindThemeParamsCSSVars(tp);
    expandViewPort()
    Toast.config({
      position: 'top',
      duration: 3000
    })

    // const locale = localStorage.getItem('locale') || 'zh'
    // setLocale(locale)
  }, [])

  useEffect(() => {
    const minus = () => {
      let index = 220
      timer.current = setInterval(() => {
        index -= Math.random() * 5
        setRotate(index)
        if (index < 130) {
          clearInterval(timer.current)
          add()
        }
      }, 100);
    }

    const add = () => {
      let index = 130
      timer.current = setInterval(() => {
        index += Math.random() * 5
        setRotate(index)
        if (index > 220) {
          clearInterval(timer.current)
          minus()
        }
      }, 50);
    }
    add()
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'}
    >
      <IntlProvider locale={userInfo.lang || 'en'} messages={messages[userInfo.lang || 'en']}>
        <div className='layout'>
          <div className='content' style={{ background: `linear-gradient(${rotate}deg, rgba(111, 66, 44, 0.93) 5%, rgb(0, 0, 0) 30%, rgb(0, 0, 0) 100%)` }}>
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
      </IntlProvider>
    </AppRoot>
  );
};


