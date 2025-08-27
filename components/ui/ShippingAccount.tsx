"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { City, ICartProduct, ISell, Region } from '../../interfaces'
import { Select } from '../ui'
import { calcularPaquete, offer } from '@/utils'

interface Props {
  account: any
  setAccount: any
  style: any
}

export const ShippingAccount: React.FC<Props> = ({ account, setAccount, style }) => {

  const [regions, setRegions] = useState<Region[]>()
  const [citys, setCitys] = useState<City[]>()
  const [chile, setChile] = useState({ active: false, coberturaKey: '', cotizadorKey: '' })

    const requestRegions = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
        const request = await axios.get('https://testservices.wschilexpress.com/georeference/api/v1.0/regions', {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': res.data.coberturaKey
          }
        })
        setRegions(request.data.regions) 
        setChile(res.data)
    }

      useEffect(() => {
        requestRegions()
      }, [])
    
      const regionChange = async (e: any) => {
        const region = regions?.find(region => region.regionName === e.target.value)
        const request = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': chile.coberturaKey
          }
        })
        setAccount({ ...account, region: e.target.value })
        setCitys(request.data.coverageAreas)
      }
    
      const cityChange = async (e: any) => {
        setAccount({ ...account, city: e.target.value })
      }

  return (
    <div className='flex gap-2 w-full flex-col sm:flex-row'>
      <div className='flex flex-col gap-2 w-full sm:w-1/2'>
        <p className='text-sm'>Región</p>
        <Select selectChange={regionChange} style={style} value={account?.region}>
          <option>Seleccionar Región</option>
          {
          regions !== undefined
            ? regions.map(region => <option key={region.regionId}>{region.regionName}</option>)
            : ''
          }
        </Select>
      </div>
      <div className='flex flex-col gap-2 w-full sm:w-1/2'>
        <p className='text-sm'>Ciudad</p>
        <Select selectChange={cityChange} style={style} value={account?.city}>
          <option>Seleccionar Ciudad</option>
          {
            citys !== undefined
              ? citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)
              : ''
          }
        </Select>
      </div>
    </div>
  )
}