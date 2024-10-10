import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame';
import './index.scss'
import { Popup, Toast } from 'antd-mobile';
import { initUtils } from '@telegram-apps/sdk';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { beginGameReq, endGameReq } from '@/api/game';
import { setUserInfoAction } from '@/redux/slices/userSlice';
import EventBus from '@/utils/eventBus';

function GamePage() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const userInfo = useSelector((state: any) => state.user.info);
  const systemInfo = useSelector((state: any) => state.user.system)
  const [currentScene, setCurrentScene] = useState('Preloader')
  const [score, setScore] = useState(0)
  const link = `https://t.me/HamstersTon_bot/Hamster?startapp=${btoa(userInfo.user_id)}`;
  const [showPopUp, setShowPopUp] = useState(false)
  const utils = initUtils()
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const eventBus = EventBus.getInstance()
  const [isShowInvite, setShowInvite] = useState(false)
  const [overType, setOverType] = useState('fail')
  // Event emitted from the PhaserGame component
  const currentActiveScene = async (scene: Phaser.Scene) => {
    setCurrentScene(scene.scene.key);
    if (scene.scene.key == 'GameOver') {
      eventBus.emit('showCongrates', { time: 2000, visible: true })
      const _score = (localStorage.getItem('currentScore') || 0) as any
      const type = localStorage.getItem('victory') || 'fail'
      setOverType(type)
      if (parseFloat(_score) && !isNaN(parseFloat(_score))) {
        eventBus.emit('showCongrates', { time: 1000, visible: true })
        setScore(_score as any)
        endGameReq({ coin: parseFloat(_score), overType: type }).then(res => {
          if (res.code == 0) {
            dispatch(setUserInfoAction(res.data))
          } else {
            Toast.show({
              content: res.msg,
              position: 'center'
            })
          }
        }).catch(error => {
          console.error(error)
        })
      }
    }
    if (scene.scene.key == 'MainGame') {
      const res = await beginGameReq()
      if (res.code != 0) {
        Toast.show({
          content: res.msg,
          position: 'top',
          duration: 3000
        })
        navigate(-1)
      } else {
        dispatch(setUserInfoAction(res.data))
      }
    }
  }

  const restartGame = () => {
    if (userInfo.ticket == 0) {
      setShowInvite(true)
      return
    }
    setCurrentScene('MainGame')
    // phaserRef?.current?.game?.scene?.start('Preloader')
  }

  const shareResult = () => {
    setShowPopUp(true)
  }

  const handleCopyLink = () => {
    const textToCopy = link; // 替换为你想要复制的内容  
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    Toast.show({ content: 'copied', position: 'top' })
  }

  const handleSendLink = () => {
    const text = `I scored ${score} points in Cat Game!\nI dare you to challenge me!\nFarm coin with me and secure your token allocation through Avoid.Germs.\nUse my link to get ${systemInfo?.base?.share} coin!`
    utils.shareURL(link, text)
  }

  const getGameConfig = () => {
    let config = {
      game: {},
      user: {},
      skin: {},
    }
    const _gameList = systemInfo?.game.filter((item: any) => {
      return item.level == userInfo.current_game_level
    })
    if (_gameList.length) {
      config.game = _gameList[0]
    }
    const _levelList = systemInfo?.level.filter((item: any) => {
      return item.level == userInfo.current_level
    })
    if (_levelList.length) {
      config.user = _levelList[0]
    }
    const _skinList = systemInfo?.skin.filter((item: any) => {
      return item.skin == userInfo.skin
    })
    if (_skinList.length) {
      config.skin = _skinList[0]
    }
    return config
  }

  const initGameInfo = () => {
    if (phaserRef.current) {
      const scene = phaserRef.current.scene;
      if (scene) {
        if (currentScene == 'MainGame') {
          let mainScene = scene as any
          const config = getGameConfig()
          mainScene.initConfig(config)
        }
      }
    }
  }

  useEffect(() => {
    initGameInfo()
  }, [phaserRef.current?.scene])


  return (
    <div className='game-wrapper'>
      {
        currentScene == 'GameOver' ? <div className='game-over'>
          <div className='game-over-top'>
            <img src='/assets/game/reward.png' alt='gif' className='congrats-img' />
            {
              overType == 'victory' ? <div className='victory'>Level.{userInfo?.current_game_level - 1}<span>➤</span>Level.{userInfo?.current_game_level}</div>
              : <div className='victory'>Level.{userInfo?.current_game_level}</div>
            }
            <div className='congrats'>Congrats!</div>
            <div className='congrats'>bountiful harvest</div>
            <div className='score-wrapper'>
              <span>+</span>
              <span>{score} </span>
              <img src="/assets/common/coin.png" alt="tomato" />
            </div>
          </div>
          <div className='game-over-bots'>
            <div className='game-over-btn' onClick={() => shareResult()}>
              Share Your Results +{systemInfo?.base?.share}
              <img src='/assets/common/coin.png' alt='coin' className='coin'/>
            </div>
            <div className='game-over-btn play-btn' onClick={() => restartGame()}>
              {
                overType == 'victory' ? <div className='game-over-bot-middle'>👉&nbsp;Next Level</div>
                : <div className='game-over-bot-middle'>Play ({userInfo.ticket} Attempts Left)&nbsp;👈</div>
              }
            </div>
          </div>
        </div> : <PhaserGame ref={phaserRef} currentActiveScene={currentActiveScene} />
      }

      <Popup
        visible={showPopUp}
        onMaskClick={() => {
          setShowPopUp(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}>
        <div className='popup-result'>
          <div className='popup-title'>
            Share Results
            <svg onClick={() => setShowPopUp(false)} className="close-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="16" height="16"><path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z" fill="#272636" p-id="5778"></path></svg>
          </div>
          <div className='popup-content'>
            <div className='popup-content-jb'>🏆</div>
            <div className='score-wrapper'>
              <span>+</span>
              <span>{score} </span>
              Coin
            </div>
            <div>I scored {score} Coin in the Game!</div>
            <div>I dare you to challenge me!</div>
            <div className='popup-content-btn' onClick={() => handleCopyLink()}>Copy link</div>
            <div className='popup-content-btn btn-send' onClick={() => handleSendLink()}>Send</div>
          </div>
        </div>
      </Popup>
      <Popup
        visible={isShowInvite}
        onMaskClick={() => {
          setShowInvite(false)
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
        className='popup-invite'
      >
        <div className='popup-frens'>
          <div className='title'>
            Invite a Fren
            <svg onClick={() => setShowInvite(false)} className="close-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5777" width="18" height="18"><path d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z" fill="#272636" p-id="5778"></path></svg>
          </div>
          <div className='content'>
            <div className='content-desc'>
              <div>Get {systemInfo?.invite_add} coin and {systemInfo?.ticket} ticket（Invite a Friend）</div>
              <div>Get {systemInfo?.huiYuan_add} coin and {systemInfo?.huiYuan_ticket} tickets（Invite a Telegram Premium）</div>
            </div>
            <div className='popup-content-btn' onClick={() => handleCopyLink()}>Copy link</div>
            <div className='popup-content-btn btn-send' onClick={() => handleSendLink()}>Send</div>
          </div>
        </div>
      </Popup>
    </div>
  )
}

export default GamePage
