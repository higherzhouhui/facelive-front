import './index.scss';
import { useEffect, useState } from 'react';
import EventBus from '@/utils/eventBus';
import { useLocation, useNavigate } from 'react-router-dom';
import { initBackButton } from '@telegram-apps/sdk';

export default function () {
    const myLocation = useLocation()
    const [isShowFooter, setShowFooter] = useState(true)
    const [backButton] = initBackButton()
    const navigate = useNavigate()
    const [isIos, setIsIos] = useState(false)

    const handleClickTab = (item: any) => {
        navigate(item.to)
    }
    const [menu, setMenu] = useState([
        {
            title: 'Home',
            icon: HomeIcon,
            to: '/'
        },
        {
            title: 'My',
            icon: MyIcon,
            to: '/my',
        },
    ])
    useEffect(() => {
        const flag = /iPad|iPhone|iPod/.test(navigator.userAgent)
        setIsIos(flag)
    }, [])

    useEffect(() => {
        let flag = true
        if (myLocation.pathname) {
            flag = menu.map((item) => { return item.to }).includes(myLocation.pathname)
            setShowFooter(flag)
        } else {
            setShowFooter(true)
        }
        if (flag) {
            backButton.hide()
        } else {
            backButton.show();
        }
    }, [myLocation.pathname])
    return <footer className="footer" style={{ display: isShowFooter ? 'block' : 'none', paddingBottom: isIos ? '1.8rem' : '1.2rem' }}>
        <div className='list'>
            {
                menu.map((item => {
                    return <div className={`menu ${myLocation.pathname == item.to ? 'active' : ''}`} key={item.title} onClick={() => handleClickTab(item)}>
                        <div>{item.icon}</div>
                    </div>
                }))
            }
        </div>
    </footer>
}
var HomeIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2325"><path d="M511.868892 1023.999069A512.008492 512.008492 0 0 1 312.627803 40.489527a512.000737 512.000737 0 0 1 398.482177 943.289056A508.665833 508.665833 0 0 1 511.868892 1023.999069zM314.349544 364.773981a55.149995 55.149995 0 0 0-21.45196 5.219512A37.653386 37.653386 0 0 0 271.445624 406.53783v211.192451a37.64563 37.64563 0 0 0 21.45196 36.536581 55.157751 55.157751 0 0 0 21.45196 5.219512h256.213647a55.173262 55.173262 0 0 0 21.459716-5.219512 37.64563 37.64563 0 0 0 21.444204-36.536581V407.763213a41.019312 41.019312 0 0 0-11.113759-30.246798A50.000284 50.000284 0 0 0 570.563191 364.773981zM741.434334 385.450382a7.344543 7.344543 0 0 0-5.475446 2.125032l-84.605723 65.74413a10.857825 10.857825 0 0 0-3.792483 7.600478v104.987412a9.128329 9.128329 0 0 0 3.792483 7.600477l84.582456 65.736375a9.593664 9.593664 0 0 0 6.305294 2.520566 9.306707 9.306707 0 0 0 5.025622-1.287428A8.631971 8.631971 0 0 0 752.292159 631.643808v-236.545473a9.306707 9.306707 0 0 0-6.251005-8.833616 14.572752 14.572752 0 0 0-4.653353-0.845359z"  p-id="2326"></path></svg>
var MyIcon = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8199"><path d="M514 65.5c-246.5 0-446.3 199.8-446.3 446.3S267.5 958.1 514 958.1s446.3-199.8 446.3-446.3S760.5 65.5 514 65.5z m0 182.4c70.6 0 127.8 57.2 127.8 127.8S584.6 503.5 514 503.5s-127.8-57.2-127.8-127.8S443.5 247.9 514 247.9zM257.8 767.8c0-121.1 84-222.6 196.9-249.3 17.7 9.3 37.9 14.6 59.3 14.6s41.6-5.3 59.3-14.6c112.9 26.8 196.9 128.2 196.9 249.3H257.8z"  p-id="8200"></path></svg>