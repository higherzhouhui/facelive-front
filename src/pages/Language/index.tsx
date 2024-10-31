import { FormattedMessage } from 'react-intl'
import './index.scss'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfoAction } from '@/redux/slices/userSlice'
import { changeLangReq } from '@/api/common'

function LanguagePage() {
  const [list, setList] = useState([])
  const info = useSelector((state: any) => state.user.system);
  const userInfo = useSelector((state: any) => state.user.info);
  const dispatch = useDispatch()
  const initData = async () => {
    const _list = info?.systemLanguage
    setList(_list)
  }

  const handleSwitchLang = (code: string) => {
    dispatch(setUserInfoAction({lang: code}))
    changeLangReq({lang: code})
  }

  useEffect(() => {
    initData()
  }, [])
  return <div className='language-page'>
    <div className='title'><FormattedMessage id='language' /></div>
    <div className='list'>
      {
        list.map((item: any, index: number) => {
          return <div className='list-item' key={index}>
            <div className='left'>
              <div className='language'><FormattedMessage id={item.code} /></div>
              <div className='label'>{item.label}</div>
            </div>
            <div className='right' onClick={() => handleSwitchLang(item.code)}>
              {
                item.code == userInfo.lang ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10729" width="20" height="20"><path d="M540.5696 102.4c-225.83296 0-409.6 183.74656-409.6 409.6s183.76704 409.6 409.6 409.6c225.87392 0 409.6-183.74656 409.6-409.6S766.44352 102.4 540.5696 102.4zM721.16224 468.48l-175.37024 175.39072c-12.20608 12.1856-28.20096 18.28864-44.19584 18.28864-15.95392 0-31.96928-6.10304-44.15488-18.28864l-97.44384-97.44384c-24.39168-24.39168-24.39168-63.93856 0-88.33024 24.39168-24.41216 63.91808-24.41216 88.35072 0l53.248 53.248 131.23584-131.21536c24.35072-24.3712 63.95904-24.3712 88.33024 0C745.55392 404.52096 745.55392 444.08832 721.16224 468.48z" p-id="10730" data-spm-anchor-id="a313x.search_index.0.i15.1cca3a81hQTv4O" fill="#d4237a"></path></svg> : null
              }
            </div>
          </div>
        })
      }
    </div>
  </div>
}


export default LanguagePage