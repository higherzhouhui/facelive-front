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
import { type FC, useEffect, useRef, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { routes } from '@/navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import { getSystemReq, loginReq } from '@/api/common';
import { setLangAction, setSystemAction, setUserInfoAction } from '@/redux/slices/userSlice';
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
  const myLocation = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [rotate, setRotate] = useState(0)
  const eventBus = EventBus.getInstance()
  const [loading, setLoading] = useState(true)
  const storeLang = useSelector((state: any) => state.user.lang);
  const [locale, setLocale] = useState<any>('en')
  const timer = useRef<any>(null)
  const login = async () => {
    setLoading(true)
    
    try {
      const initData = initInitData() as any;
      let resArray: any;
      if (initData && initData.user && initData.user.id) {
        const user = initData.initData.user
        const data = { ...initData.initData, ...user }
        const storageLang = localStorage.getItem('lang')
        if (!storageLang) {
          const lang = data.languageCode == 'zh-hans' ? 'zh' : 'en'
          dispatch(setLangAction(lang))
          localStorage.setItem('lang', lang)
        } else {
          dispatch(setLangAction(storageLang))
        }
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
    if (myLocation.pathname !== '/') {
      backButton.show()
    } else {
      backButton.hide()
    }
  }, [myLocation.pathname])

  useEffect(() => {
    const rotate = [-90 ,-45, 0, 45, 90]
    let index = 0
    timer.current = setInterval(() => {
      index += 1
      index = index % 5
      setRotate(rotate[index])
    }, 800);
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return (
    <AppRoot
      appearance={miniApp.isDark ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(launchParams.platform) ? 'ios' : 'base'}
    >
      <IntlProvider locale={storeLang} messages={messages[storeLang]}>
        <div className='layout'>
          <div className='content' style={{ background: `linear-gradient(${rotate}deg, rgba(111, 66, 44, 0.05) 0%, rgba(111, 66, 44, 0.1) 30%, rgba(111, 66, 44, 0.93) 100%)` }}>
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


