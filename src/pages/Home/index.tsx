import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import { useTonConnectUI, useTonAddress, useTonWallet, TonConnectButton } from '@tonconnect/ui-react';


export default function Home() {
  const hapticFeedback = useHapticFeedback()
  const dispatch = useDispatch()
  const userInfo = useSelector((state: any) => state.user.info);
  const navigate = useNavigate()
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet()
  const handleRoute = (link: string) => {
    navigate(link)
  }

  const handleConnect = () => {
    hapticFeedback.notificationOccurred('success')
    if (!tonConnectUI.connected) {
      tonConnectUI.modal.open()
    }
  }

  return (
    <div className='home-page'>
      
    </div>
  )

}



