import './index.scss'
import Macy from 'macy'
import { initUtils, useHapticFeedback } from '@telegram-apps/sdk-react';
import { getAnchorList } from '@/api/common';
import { useEffect, useState } from 'react';
import { getFileUrl, objectsEqual } from '@/utils/common';
import CountryFlag from '@/components/Flag';
import { FormattedMessage } from 'react-intl';
import { Empty, InfiniteScroll, Popup, PullToRefresh, Skeleton } from 'antd-mobile';
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
  const utils = initUtils()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [countryList, setCountryList] = useState([])
  const [groupList, setGroupList] = useState([])
  const [styleList, setStyleList] = useState([])
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
    eventBus.emit('loading', true)
    const append: any = await getAnchorList(where)
    if (where.page == 1) {
      setList(append.data)
    } else {
      setList((val: any) => [...val, ...append.data])
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
    sessionStorage.setItem('anchorId', `${id}`)
    navigate(`/anchor`)
    hapticFeedback.notificationOccurred('success')
  }

  const getMacy = () => {
    if (masonry) {
      //当数据更新时，会重新计算并排版
      masonry?.recalculate()
      let count = 0
      masonry.runOnImageLoad(function () {
        count ++;
        if (count >= addNum) {
          setTimeout(() => {
            eventBus.emit('loading', false)
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
        margin: { x: 2, y: 2 },    // 设计列与列的间距
        columns: 2,    // 设置列数
      })
      setMasonry(masonry)
      let count = 0
      masonry.runOnImageLoad(function () {
        count ++;
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

  useEffect(() => {
    loadMore(1)
    initData()
  }, [])


  useEffect(() => {
    if (list.length) {
      getMacy()
    } else {
      eventBus.emit('loading', false)
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

  // useEffect(() => {
  //   initData()
  //   const rotate = [45, 135, 225, 320]
  //   let index = 0
  //   timer.current = setInterval(() => {
  //     index += 1
  //     index = index % 4
  //     setRotate(rotate[index])
  //   }, 800);
  //   return () => clearInterval(timer.current)
  // }, [])

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
            <div className='left'>
              <FormattedMessage id='joinSQ' />
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2557" width="24" height="24"><path d="M708.48 533.44C783.2 500.18 835.5 425.35 835.5 338.43c0-117.7-95.76-213.47-213.47-213.47s-213.47 95.76-213.47 213.47c0 87.04 52.44 161.97 127.33 195.16C399.79 571.4 299.5 696.1 299.5 844.08c0 8.39 6.79 15.18 15.18 15.18s15.18-6.79 15.18-15.18c0-161.1 131.07-292.17 292.17-292.17 65.65 0 127.77 21.36 179.64 61.76 6.61 5.13 16.14 3.94 21.3-2.65 5.14-6.61 3.96-16.14-2.65-21.3-33.81-26.34-71.65-45.13-111.84-56.28zM438.93 338.43c0-100.97 82.14-183.11 183.11-183.11s183.11 82.14 183.11 183.11-82.14 183.11-183.11 183.11-183.11-82.14-183.11-183.11z" fill="#1afa29" p-id="2558"></path><path d="M428.48 586.88c9-6.77 18.35-13.09 28.04-18.91-16.94-10.37-34.9-18.67-53.64-24.67 25.92-13.38 48.11-33.57 64.02-58.71-7.48-7.93-14.38-16.39-20.59-25.38-23.22 44.02-68.9 72.23-119.02 72.23-74.39 0-134.92-60.53-134.92-134.94 0-74.39 60.53-134.92 134.92-134.92 31.82 0 62.1 11.16 86.28 31.38 2.33-10.68 5.56-21 9.42-31.01-27.8-19.84-60.99-30.72-95.7-30.72-91.14 0-165.28 74.14-165.28 165.28 0 63.89 36.5 119.33 89.69 146.83-99.8 32.04-172.27 125.72-172.27 236.09 0 8.39 6.79 15.18 15.18 15.18s15.18-6.79 15.18-15.18c0-120.01 97.57-217.65 217.5-217.65 35.61 0.01 70.14 8.71 101.19 25.1z" fill="#1afa29" p-id="2559"></path><path d="M929.39 762.43h-91.07v-91.07c0-8.39-6.79-15.18-15.18-15.18s-15.18 6.79-15.18 15.18v91.07H716.9c-8.39 0-15.18 6.79-15.18 15.18s6.79 15.18 15.18 15.18h91.07v91.07c0 8.39 6.79 15.18 15.18 15.18s15.18-6.79 15.18-15.18v-91.07h91.07c8.39 0 15.18-6.79 15.18-15.18-0.01-8.39-6.8-15.18-15.19-15.18z" fill="#1afa29" p-id="2560"></path></svg>
            </div>
            <div className='right'>
              <img src='/assets/people.png' alt='people' />
            </div>
          </div>
        </div>
      </div>
      <div className='main-content'>
        <div className='filter'>
          <svg onClick={() => setVisible(true)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4613" width="24" height="24"><path d="M522.184 1024a39.123 39.123 0 0 1-19.4-5.173l-215.34-149.38a40.093 40.093 0 0 1-17.137-32.334V366.986L10.023 41.712l8.407-21.664A35.567 35.567 0 0 1 50.763 0.002h751.105l20.37 38.476-13.257 19.077-249.29 309.43v617.892A39.123 39.123 0 0 1 520.568 1024zM333.357 823.856L495.024 937.67V344.352L721.358 64.668H111.227l222.13 279.684zM74.69 16.815z" fill="#fff" p-id="4614"></path><path d="M722.975 452.669h258.667q32.333 0 32.333 32.333 0 32.334-32.333 32.334H722.975q-32.334 0-32.334-32.334 0-32.333 32.334-32.333zM722.975 630.503h258.667q32.333 0 32.333 32.333t-32.333 32.333H722.975q-32.334 0-32.334-32.333t32.334-32.333zM722.975 808.336h258.667q32.333 0 32.333 32.334 0 32.333-32.333 32.333H722.975q-32.334 0-32.334-32.333 0-32.334 32.334-32.334z" fill="#fff" p-id="4615"></path></svg>
          <div className={`${handleFilter().length ? '' : 'all-hover'} filter-title-item`}><FormattedMessage id='all' /></div>
          {
            handleFilter().map((item: any, index: number) => {
              return <div className='filter-title-item' key={index} onClick={() => handleRemoveFilter(index)}>
                {
                  item.type == 'country' ? <CountryFlag country={item.label} /> : null
                }
                <FormattedMessage id={item.label || 'label'} />
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1467" width="14" height="14"><path d="M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1468"></path><path d="M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill="#e6e6e6" p-id="1469"></path></svg>
              </div>
            })
          }
        </div>
        <div className='image-content'>
          <div className='skeleton-wrapper'>
          {
            loading ? [...Array(6).fill('')].map((item: any, index: number) => {
              return <Skeleton className='skeleton' animated key={index} />
            }) : null
          }
          </div>
          <div className='image-list'>
            {
              list.map((item: any, index: number) => {
                return <div className='anchor-wrapper' key={index} onClick={() => handleToDetail(item.id)}>
                  <img src={getFileUrl(item.cover)} alt='anchor' className='anchor-cover' />
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
          list.length ? <div>-------- <FormattedMessage id='endDesc'/> --------</div> : <Empty description={<FormattedMessage id='nodata' />} />
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
        bodyStyle={{ height: '60vh', background: '#18140E', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}
      >
        <div className='filter-popup'>
          <div className='title'>
            <svg onClick={() => setVisible(false)} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5596" width="24" height="24"><path d="M512 85.333333C276.48 85.333333 85.333333 276.48 85.333333 512S276.48 938.666667 512 938.666667 938.666667 747.52 938.666667 512 747.52 85.333333 512 85.333333z m136.533333 531.342223c11.377778 11.377778 11.377778 29.582222 0 39.822222-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444L512 559.786667l-96.711111 96.711111c-5.688889 5.688889-12.515556 7.964444-20.48 7.964444s-14.791111-2.275556-20.48-7.964444c-11.377778-11.377778-11.377778-29.582222 0-39.822222l96.711111-96.711112-104.675556-104.675555c-11.377778-11.377778-11.377778-29.582222 0-39.822222 11.377778-11.377778 29.582222-11.377778 39.822223 0l104.675555 104.675555 104.675556-104.675555c11.377778-11.377778 29.582222-11.377778 39.822222 0 11.377778 11.377778 11.377778 29.582222 0 39.822222l-104.675556 104.675555 97.848889 96.711112z" p-id="5597" fill="#dbdbdb"></path></svg>            </div>
          <div className='filter-item'>
            <div className='label'>
              <FormattedMessage id='country' />
            </div>
            <div className='select-container'>
              {
                countryList.map((item: any, index: number) => {
                  return <div key={index} className={`select-item touch-btn ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectCountry(index)}>
                    <div className='select-item-name'>
                      <CountryFlag country={item.label} />
                      <FormattedMessage id={item.label || 'label'} />
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
                  return <div key={index} className={`select-item ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectLanguage(index)}>
                    <div className='select-item-name'>
                      <FormattedMessage id={item.label || 'label'} />
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
                  return <div key={index} className={`select-item ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectStyle(index)}>
                    <div className='select-item-name'>
                      <FormattedMessage id={item.label || 'label'} />
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
                  return <div key={index} className={`select-item ${item.selected ? 'select-item-active' : ''}`} onClick={() => handleSelectGroup(index)}>
                    <div className='select-item-name'>
                      <FormattedMessage id={item.label || 'label'} />
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



