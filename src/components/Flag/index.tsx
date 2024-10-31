import { FC } from 'react'
import './index.scss'

type CountryFlagType = {
  country: string
}


const CountryFlag: FC<CountryFlagType> = ({country}) => {
  return <div className='flag'>{country}</div>
}

export default CountryFlag;