import { FC } from 'react'
import './index.scss'

type CountryFlagType = {
  country: string
}


const CountryFlag: FC<CountryFlagType> = ({country}) => {
  const countryList: any = {
    ph: '🇵🇭',
    ng: '🇳🇬',
    vn: '🇻🇳',
    ca: '🇨🇦',
    br: '🇧🇷',
    co: '🇨🇴',
    us: '🇺🇸',
    gh: '🇬🇭',
    cn: '🇨🇳',
    ve: '🇻🇪',
    in: '🇮🇳',
    gb: '🇬🇧',
    dy: '🇸🇾',
    bd: '🇧🇩',
    jm: '🇯🇲',
  }
  return <div className='flag'>{countryList[country]}</div>
}

export default CountryFlag;