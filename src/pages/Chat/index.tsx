import { FormattedMessage } from 'react-intl'
import './index.scss'
import { chatAnchorListReq } from '@/api/common'
import { useEffect, useState } from 'react'
import { getFileUrl } from '@/utils/common'
import CountryFlag from '@/components/Flag'
import { Empty, Modal } from 'antd-mobile'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EventBus from '@/utils/eventBus'
import BackTop from '@/components/BackTop'

function FollowPage() {
  const [list, setList] = useState([])
  const [visible, setVisible] = useState(false)
  const userinfo = useSelector((state: any) => state.user.info);
  const navigate = useNavigate()
  const eventBus = EventBus.getInstance()
  const [loading, setLoading] = useState(true)
  const initData = async () => {
    eventBus.emit('loading', true)
    setLoading(true)
    const res = await chatAnchorListReq()
    eventBus.emit('loading', false)
    setLoading(false)
    setList(res.data)
  }

  const handleRoute = (index: number) => {
    if (index == 0) {
      navigate('/recharge')
    } else {
      navigate('/frens')
    }
  }

  const handleToChat = (item: any) => {
    if (userinfo.score < item.coin) {
      setVisible(true)
    } else {
      localStorage.setItem('chat', '1')
      navigate(`/anchor?id=${item.id}`)
    }
  }
  useEffect(() => {
    initData()
  }, [])
  return <div className='follow-page'>
    <div className='title'>
      <FormattedMessage id='yzblt' /><span className='count'>({list.length})</span>
      {
        !loading && !list.length ? <Empty description={<FormattedMessage id='nochat' />} /> : <div className='list'>
        {
          list.map((item: any, index) => {
            return <div className='list-item' key={index}>
              <div className='left'>
                <img src={getFileUrl(item.avatar)} />
                <div className='name'>
                  {item.name}
                  <CountryFlag country={item.country} />
                </div>
              </div>
              <div className='list-right' onClick={() => handleToChat(item)}>
                <div className='online' />
                <div className='divider' />
                {HomeIcon}
              </div>
            </div>
          })
        }
      </div>
      }
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
    <BackTop />
  </div>
}

var HomeIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2325"><path d="M511.868892 1023.999069A512.008492 512.008492 0 0 1 312.627803 40.489527a512.000737 512.000737 0 0 1 398.482177 943.289056A508.665833 508.665833 0 0 1 511.868892 1023.999069zM314.349544 364.773981a55.149995 55.149995 0 0 0-21.45196 5.219512A37.653386 37.653386 0 0 0 271.445624 406.53783v211.192451a37.64563 37.64563 0 0 0 21.45196 36.536581 55.157751 55.157751 0 0 0 21.45196 5.219512h256.213647a55.173262 55.173262 0 0 0 21.459716-5.219512 37.64563 37.64563 0 0 0 21.444204-36.536581V407.763213a41.019312 41.019312 0 0 0-11.113759-30.246798A50.000284 50.000284 0 0 0 570.563191 364.773981zM741.434334 385.450382a7.344543 7.344543 0 0 0-5.475446 2.125032l-84.605723 65.74413a10.857825 10.857825 0 0 0-3.792483 7.600478v104.987412a9.128329 9.128329 0 0 0 3.792483 7.600477l84.582456 65.736375a9.593664 9.593664 0 0 0 6.305294 2.520566 9.306707 9.306707 0 0 0 5.025622-1.287428A8.631971 8.631971 0 0 0 752.292159 631.643808v-236.545473a9.306707 9.306707 0 0 0-6.251005-8.833616 14.572752 14.572752 0 0 0-4.653353-0.845359z"  p-id="2326"></path></svg>



export default FollowPage