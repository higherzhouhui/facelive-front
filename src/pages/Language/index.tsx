import { FormattedMessage } from 'react-intl'
import './index.scss'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initInitData } from '@telegram-apps/sdk'
import { setLangAction, setUserInfoAction } from '@/redux/slices/userSlice'
import { changeLangReq } from '@/api/common'

function LanguagePage() {
  const [list, setList] = useState([])
  const info = useSelector((state: any) => state.user.system);
  const userInfo = useSelector((state: any) => state.user.info);
  const dispatch = useDispatch()
  const initData = async () => {
    const initData = initInitData() as any;
    const _list = info?.systemLanguage
    setList(_list)
  }

  const handleSwitchLang = (code: string) => {
    dispatch(setUserInfoAction({lang: code}))
    changeLangReq({lang: code})
    // eventBus.emit('shiftLanguage', code)
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

var HomeIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2325"><path d="M511.868892 1023.999069A512.008492 512.008492 0 0 1 312.627803 40.489527a512.000737 512.000737 0 0 1 398.482177 943.289056A508.665833 508.665833 0 0 1 511.868892 1023.999069zM314.349544 364.773981a55.149995 55.149995 0 0 0-21.45196 5.219512A37.653386 37.653386 0 0 0 271.445624 406.53783v211.192451a37.64563 37.64563 0 0 0 21.45196 36.536581 55.157751 55.157751 0 0 0 21.45196 5.219512h256.213647a55.173262 55.173262 0 0 0 21.459716-5.219512 37.64563 37.64563 0 0 0 21.444204-36.536581V407.763213a41.019312 41.019312 0 0 0-11.113759-30.246798A50.000284 50.000284 0 0 0 570.563191 364.773981zM741.434334 385.450382a7.344543 7.344543 0 0 0-5.475446 2.125032l-84.605723 65.74413a10.857825 10.857825 0 0 0-3.792483 7.600478v104.987412a9.128329 9.128329 0 0 0 3.792483 7.600477l84.582456 65.736375a9.593664 9.593664 0 0 0 6.305294 2.520566 9.306707 9.306707 0 0 0 5.025622-1.287428A8.631971 8.631971 0 0 0 752.292159 631.643808v-236.545473a9.306707 9.306707 0 0 0-6.251005-8.833616 14.572752 14.572752 0 0 0-4.653353-0.845359z" p-id="2326"></path></svg>



export default LanguagePage