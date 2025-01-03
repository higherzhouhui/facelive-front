import './index.scss'
import Macy from 'macy'
import { initUtils, useHapticFeedback } from '@telegram-apps/sdk-react';
import { getAnchorList } from '@/api/common';
import { useEffect, useRef, useState } from 'react';
import { getFileUrl, objectsEqual } from '@/utils/common';
import CountryFlag from '@/components/Flag';
import { FormattedMessage } from 'react-intl';
import { DotLoading, Empty, InfiniteScroll, Popup, PullToRefresh, Skeleton } from 'antd-mobile';
import EventBus from '@/utils/eventBus';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BackTop from '@/components/BackTop';

export default function Home() {
  const hapticFeedback = useHapticFeedback()
  const [list, setList] = useState<any>([])
  const [recommendList, setRecommendList] = useState<any>([])
  // const [rotate, setRotate] = useState(0)
  // const timer = useRef<any>(null)
  const [hasMore, setHasMore] = useState(false)
  const [masonry, setMasonry] = useState<any>(null);
  const [page, setPage] = useState(1)
  const eventBus = EventBus.getInstance()
  const config = useSelector((state: any) => state.user.system);
  const userInfo = useSelector((state: any) => state.user.info);
  const utils = initUtils()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [countryList, setCountryList] = useState([])
  const [styleList, setStyleList] = useState([])
  const [groupList, setGroupList] = useState([])
  const [languageList, setLanguageList] = useState([])
  const [oldFilter, setOldFilter] = useState<any>({})
  const [filter, setFilter] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [addNum, setAddNum] = useState(0)

  //触底后立即触发该方法
  async function loadMore(cPage?: number, cFilter?: any) {
    let where = {
      page: cPage || page
    }
    const _filter = cFilter || filter
    if (_filter) {
      where = {
        ...where,
        ..._filter
      }
    }
    setLoading(true)
    // eventBus.emit('loading', true)
    const append: any = await getAnchorList(where)
    if (where.page == 1) {
      setList(append.data)
    } else {
      setList((val: any) => [...val, ...append.data])
    }
    if (append.data.length == 0) {
      setLoading(false)
    }
    setAddNum(append.data.length)
    setHasMore(append.data.length > 0)
    setPage(where.page + 1)
  }

  const handleJoinTg = () => {
    utils.openTelegramLink(config.base.channel_url)
  }


  const handleFilter = () => {
    let list: any[] = []
    if (filter.country) {
      const _c = filter.country.split(',')
      _c.map((item: any) => {
        if (item) {
          list.push({
            type: 'country',
            label: item
          })
        }
      })
    }
    if (filter.language) {
      const _c = filter.language.split(',')
      _c.map((item: any) => {
        if (item) {
          list.push({
            type: 'language',
            label: item
          })
        }
      })
    }
    if (filter.group) {
      const _c = filter.group.split(',')
      _c.map((item: any) => {
        if (item) {
          list.push({
            type: 'group',
            label: item
          })
        }
      })
    }
    if (filter.style) {
      const _c = filter.style.split(',')
      _c.map((item: any) => {
        if (item) {
          list.push({
            type: 'style',
            label: item
          })
        }
      })
    }
    return list
  }

  const handleRemoveFilter = (index: number) => {
    const list = handleFilter()
    const item = list[index]
    const _filter = JSON.parse(JSON.stringify(filter))
    _filter[item.type] = _filter[item.type].replace(`${item.label},`, '')

    if (item.type == 'country') {
      const _list = JSON.parse(JSON.stringify(countryList))
      _list.map((cList: any, cIndex: number) => {
        if (cList.label == item.label) {
          _list[cIndex].selected = false
        }
      })
      setCountryList(_list)
    }

    if (item.type == 'style') {
      const _list = JSON.parse(JSON.stringify(styleList))
      _list.map((cList: any, cIndex: number) => {
        if (cList.label == item.label) {
          _list[cIndex].selected = false
        }
      })
      setStyleList(_list)
    }

    if (item.type == 'language') {
      const _list = JSON.parse(JSON.stringify(languageList))
      _list.map((cList: any, cIndex: number) => {
        if (cList.label == item.label) {
          _list[cIndex].selected = false
        }
      })
      setLanguageList(_list)
    }

    if (item.type == 'group') {
      const _list = JSON.parse(JSON.stringify(groupList))
      _list.map((cList: any, cIndex: number) => {
        if (cList.label == item.label) {
          _list[cIndex].selected = false
        }
      })
      setGroupList(_list)
    }

    if (_filter[item.type] == '') {
      delete _filter[item.type]
      if (item.type == 'country') {
        const _list = JSON.parse(JSON.stringify(config.country))
        setCountryList(_list)
      }
      if (item.type == 'style') {
        const _list = JSON.parse(JSON.stringify(config.style))
        setStyleList(_list)
      }
      if (item.type == 'group') {
        const _list = JSON.parse(JSON.stringify(config.group))
        setGroupList(_list)
      }
      if (item.type == 'language') {
        const _list = JSON.parse(JSON.stringify(config.language))
        setLanguageList(_list)
      }
    }
    setFilter(_filter)
    loadMore(1, _filter)
  }

  const initData = async () => {
    const res = await getAnchorList({ isCommend: true })
    setRecommendList(res.data)
  }

  const handleToDetail = (id: number) => {
    localStorage.setItem('anchorId', `${id}`)
    navigate(`/anchor`)
    hapticFeedback.notificationOccurred('success')
  }

  const getMacy = () => {
    if (masonry) {
      //当数据更新时，会重新计算并排版
      masonry?.recalculate()
      let count = 0
      masonry.runOnImageLoad(function () {
        count++;
        if (count >= addNum) {
          setTimeout(() => {
            // eventBus.emit('loading', false)
            setLoading(false)
          }, 500);
        }
      }, true);
    } else {
      //@ts-ignore
      let masonry = new Macy({
        container: '.image-list', // 图像列表容器
        trueOrder: false,
        useOwnImageLoader: false,
        debug: true,
        mobileFirst: true,
        waitForImages: true,
        margin: { x: 6, y: 6 },    // 设计列与列的间距
        columns: 2,    // 设置列数
      })
      setMasonry(masonry)
      let count = 0
      masonry.runOnImageLoad(function () {
        count++;
        if (count >= addNum) {
          masonry.recalculate(true);
          setLoading(false)
        }
      }, true);
    }
  }

  const handleSelectCountry = (index: number) => {
    const _originList = config.country
    let list = []
    const _filter = JSON.parse(JSON.stringify(filter))
    if (_filter.country) {
      delete _filter.country
    }
    if (index == 0) {
      list = _originList
    } else {
      list = JSON.parse(JSON.stringify(countryList))
      list[0].selected = false
      list[index].selected = !list[index].selected
      let country = ''
      list.map((item: any) => {
        if (item.selected) {
          country += item.code + ','
        }
      })
      if (country) {
        _filter.country = country
      } else {
        list = _originList
      }
    }
    setFilter(_filter)
    setCountryList(list)
  }
  const handleSelectLanguage = (index: number) => {
    const _originList = config.language
    let list = []
    const _filter = JSON.parse(JSON.stringify(filter))
    if (_filter.style) {
      delete _filter.style
    }
    if (index == 0) {
      list = _originList
    } else {
      list = JSON.parse(JSON.stringify(languageList))
      list[0].selected = false
      list[index].selected = !list[index].selected
      let language = ''
      list.map((item: any) => {
        if (item.selected) {
          language += item.code + ','
        }
      })
      if (language) {
        _filter.language = language
      }
    }
    setFilter(_filter)
    setLanguageList(list)
  }
  const handleSelectStyle = (index: number) => {
    const _originList = config.style
    let list = []
    const _filter = JSON.parse(JSON.stringify(filter))
    if (_filter.style) {
      delete _filter.style
    }
    if (index == 0) {
      list = _originList
    } else {
      list = JSON.parse(JSON.stringify(styleList))
      list[0].selected = false
      list[index].selected = !list[index].selected
      let style = ''
      list.map((item: any) => {
        if (item.selected) {
          style += item.code + ','
        }
      })
      if (style) {
        _filter.style = style
      }
    }
    setFilter(_filter)
    setStyleList(list)
  }
  const handleSelectGroup = (index: number) => {
    const _originList = config.group
    let list = []
    const _filter = JSON.parse(JSON.stringify(filter))
    if (_filter.group) {
      delete _filter.group
    }
    if (index == 0) {
      list = _originList
    } else {
      list = JSON.parse(JSON.stringify(groupList))
      list[0].selected = false
      list[index].selected = !list[index].selected
      let group = ''
      list.map((item: any) => {
        if (item.selected) {
          group += item.code + ','
        }
      })
      if (group) {
        _filter.group = group
      }
    }
    setFilter(_filter)
    setGroupList(list)
  }

  const getTitle = (type: string, key: string) => {
    let str = key
    try {
      const list = config[type]
      const oneList = list.filter((item: any) => {
        return item.code == key 
      })
      if (oneList.length) {
        str = userInfo?.lang == 'zh' ? oneList[0].zh : oneList[0].en
      }
    } catch (error) {

    }
    return str
  }

  useEffect(() => {
    loadMore(1)
    initData()
  }, [])


  useEffect(() => {
    if (list.length) {
      getMacy()
    }
  }, [list])

  useEffect(() => {
    if (visible) {
      setOldFilter(filter)
    } else {
      const isEqual = objectsEqual(oldFilter, filter)
      if (!isEqual) {
        loadMore(1, filter)
      }
    }
  }, [visible])

  useEffect(() => {
    if (config) {
      setCountryList(config.country)
      setLanguageList(config.language)
      setStyleList(config.style)
      setGroupList(config.group)
    }
  }, [config])
  return (
    <div className='home-page'>
      <PullToRefresh onRefresh={() => loadMore(1)}>
        <div className='top-content'>
          <div className='recommend-list'>
            {
              recommendList.map((item: any) => {
                return <div className='item' key={item.id} onClick={() => handleToDetail(item.id)}>
                  <div className='image-wrapper'>
                    <img src={getFileUrl(item.avatar)} alt='anchor' />
                  </div>
                  <div className='name'>
                    <div className='name-text'>{item.name}</div>
                    <CountryFlag country={item.country} />
                  </div>
                </div>
              })
            }
          </div>
          <div className='join-wrapper'>
            <div className='join-tg touch-btn' onClick={() => handleJoinTg()}>
              <div className='join-top'>
                <FormattedMessage id='join' />
                <svg viewBox="0 0 1466 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3463" width="20"><path d="M921.355609 7.942721L1455.961814 488.782816a30.548926 30.548926 0 0 1 0 45.212411l-534.606205 481.451074a30.548926 30.548926 0 0 1-50.711218-22.606206V603.646778a30.548926 30.548926 0 0 0-30.548926-30.548926H61.097852a61.097852 61.097852 0 1 1 0-122.195704h778.997613a30.548926 30.548926 0 0 0 30.548926-30.548926V30.548926a30.548926 30.548926 0 0 1 50.711218-22.606205z" fill="#e6e6e6" p-id="3464"></path></svg>
              </div>
              <div className='join-bot'>
                <FormattedMessage id='community' />
              </div>
            </div>
          </div>
        </div>
        <div className='main-content'>
          <div className='filter' id='home-filter'>
            <svg onClick={() => setVisible(true)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4613" width="22" height="22"><path d="M522.184 1024a39.123 39.123 0 0 1-19.4-5.173l-215.34-149.38a40.093 40.093 0 0 1-17.137-32.334V366.986L10.023 41.712l8.407-21.664A35.567 35.567 0 0 1 50.763 0.002h751.105l20.37 38.476-13.257 19.077-249.29 309.43v617.892A39.123 39.123 0 0 1 520.568 1024zM333.357 823.856L495.024 937.67V344.352L721.358 64.668H111.227l222.13 279.684zM74.69 16.815z" fill="#fff" p-id="4614"></path><path d="M722.975 452.669h258.667q32.333 0 32.333 32.333 0 32.334-32.333 32.334H722.975q-32.334 0-32.334-32.334 0-32.333 32.334-32.333zM722.975 630.503h258.667q32.333 0 32.333 32.333t-32.333 32.333H722.975q-32.334 0-32.334-32.333t32.334-32.333zM722.975 808.336h258.667q32.333 0 32.333 32.334 0 32.333-32.333 32.333H722.975q-32.334 0-32.334-32.333 0-32.334 32.334-32.334z" fill="#fff" p-id="4615"></path></svg>
            <div className={`${handleFilter().length ? '' : 'all-hover'} filter-title-item`}><FormattedMessage id='all' /></div>
            {
              handleFilter().map((item: any, index: number) => {
                return <div className='filter-title-item' key={index} onClick={() => handleRemoveFilter(index)}>
                  {
                    item.type == 'country' ? <CountryFlag country={item.label} /> : null
                  }
                  {getTitle(item.type, item.label)}
                  {/* <FormattedMessage id={item.label || 'label'} /> */}
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" width="14" height="14"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1468"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1469"></path></svg>
                </div>
              })
            }
          </div>
          <div className='image-content'>
            <div className='skeleton-wrapper'>
              {
                loading ? [...Array(8).fill('')].map((item: any, index: number) => {
                  return <Skeleton className='skeleton' animated key={index} />
                }) : null
              }
            </div>
            <div className='image-list'>
              {
                list.map((item: any, index: number) => {
                  return <div className='anchor-wrapper' key={index} onClick={() => handleToDetail(item.id)}>
                    <img src={getFileUrl(item.home_cover)} alt='anchor' className='anchor-cover' />
                    <div className='status'>
                    </div>
                    <div className='name'>
                      <div className='name-text'>{item.name}</div>
                      <CountryFlag country={item.country} />
                    </div>
                  </div>
                })
              }
            </div>
          </div>
        </div>
        <InfiniteScroll loadMore={() => loadMore()} hasMore={hasMore}>
          {
            loading ? <DotLoading style={{fontSize: 38}}/> : null
          }
        </InfiniteScroll>
        <BackTop />
        <Popup
          visible={visible}
          onMaskClick={() => {
            setVisible(false)
          }}
          onClose={() => {
            setVisible(false)
          }}
          bodyStyle={{ height: '80vh', background: '#18140E', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}
        >
          <div className='filter-popup'>
            <div className='title'>
              <svg onClick={() => setVisible(false)} viewBox="0 0 1024 1024" className='touch-btn' version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5596" width="24" height="24"><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m136.533333 531.342223c11.377778 11.377778 11.377778 29.582222 0 39.822222-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444L512 559.786667l-96.711111 96.711111c-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444c-11.377778-11.377778-11.377778-29.582222 0-39.822222l96.711111-96.711112-104.675556-104.675555c-11.377778-11.377778-11.377778-29.582222 0-39.822222 11.377778-11.377778 29.582222-11.377778 39.822223 0l104.675555 104.675555 104.675556-104.675555c11.377778-11.377778 29.582222-11.377778 39.822222 0 11.377778 11.377778 11.377778 29.582222 0 39.822222l-104.675556 104.675555 97.848889 96.711112z" p-id="5597" fill="#dbdbdb"></path></svg>            </div>
            <div className='filter-item'>
              <div className='label'>
                <FormattedMessage id='country' />
              </div>
              <div className='select-container'>
                {
                  countryList.map((item: any, index: number) => {
                    return <div key={index} className={`select-item touch-btn ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectCountry(index)}>
                      <div className='select-item-name'>
                        <CountryFlag country={item.flag} />
                        {
                          userInfo?.lang == 'zh' ? item?.zh : userInfo?.lang =='ru' ? item?.ru :  item?.en
                        }
                      </div>
                      <div className='close-icon'>
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" width="14" height="14"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1468"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1469"></path></svg>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
            <div className='filter-item'>
              <div className='label'>
                <FormattedMessage id='language' />
              </div>
              <div className='select-container'>
                {
                  languageList.map((item: any, index: number) => {
                    return <div key={index} className={`select-item touch-btn ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectLanguage(index)}>
                      <div className='select-item-name'>
                        {
                          userInfo?.lang == 'zh' ? item?.zh : userInfo?.lang =='ru' ? item?.ru :  item?.en
                        }
                      </div>
                      <div className='close-icon'>
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" width="14" height="14"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1468"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1469"></path></svg>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
            <div className='filter-item'>
              <div className='label'>
                <FormattedMessage id='style' />
              </div>
              <div className='select-container'>
                {
                  styleList.map((item: any, index: number) => {
                    return <div key={index} className={`select-item touch-btn ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectStyle(index)}>
                      <div className='select-item-name'>
                        {
                          userInfo?.lang == 'zh' ? item?.zh : userInfo?.lang =='ru' ? item?.ru :  item?.en
                        }
                      </div>
                      <div className='close-icon'>
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" width="14" height="14"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1468"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1469"></path></svg>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
            <div className='filter-item'>
              <div className='label'>
                <FormattedMessage id='group' />
              </div>
              <div className='select-container'>
                {
                  groupList.map((item: any, index: number) => {
                    return <div key={index} className={`select-item touch-btn ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectGroup(index)}>
                      <div className='select-item-name'>
                        {
                          userInfo?.lang == 'zh' ? item?.zh : userInfo?.lang =='ru' ? item?.ru :  item?.en
                        }
                      </div>
                      <div className='close-icon'>
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" width="14" height="14"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1468"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1469"></path></svg>
                      </div>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </Popup>
      </PullToRefresh>
    </div>
  )

}



