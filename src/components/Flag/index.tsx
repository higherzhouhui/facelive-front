import { FC, useEffect, useState } from 'react'
import './index.scss'
import { useSelector } from 'react-redux'

type CountryFlagType = {
  country: string
}


const CountryFlag: FC<CountryFlagType> = ({country}) => {
  const config = useSelector((state: any) => state.user.system);
  const getFlag = (country: string) => {
    let flag = country
    if (country && config) {
      const countryList = config.country
      countryList.map((item: any) => {
        if (item.label == country) {
          flag = item.flag
        } else if (item.code == country) {
          flag = item.flag
        }
      })
    }
    return flag
  }
  useEffect(() => {

  }, [])

  return <div className='flag'>{getFlag(country)}</div>
}

export default CountryFlag;