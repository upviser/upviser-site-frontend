"use client"
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { City, Region, IShipping, IStoreData } from '../../interfaces'
import { calcularPaquete, FreeShipping, NumberFormat, offer } from '../../utils'
import { H2, Select } from '../ui'
import CartContext from '@/context/cart/CartContext'

interface Props {
  setShippingCost: any
  style: any
  storeData?: IStoreData
}

export const ShippingCart: React.FC<Props> = ({ setShippingCost, style, storeData }) => {

  const [regions, setRegions] = useState<Region[]>()
  const [citys, setCitys] = useState<City[]>()
  const [shipping, setShipping] = useState<IShipping[]>()
  const [city, setCity] = useState('')
  const [chile, setChile] = useState({ active: false, coberturaKey: '', cotizadorKey: '' })

  const { cart } = useContext(CartContext)

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
    const region = regions?.find(region => region.regionName === e.target.value.toUpperCase())
    const request = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': chile.coberturaKey
      }
    })
    setCitys(request.data.coverageAreas)
  }
    
  const cityChange = async (e: any) => {
    const city = citys?.find(city => city.countyName === e.target.value)
    let dimentions
    if (cart?.length) {
      dimentions = calcularPaquete(cart)
    } else {
      dimentions = { weight: '1', height: '10', width: '10', length: '2' }
    }
    const request = await axios.post('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
      "originCountyCode": storeData?.locations![0].countyCoverageCode,
      "destinationCountyCode": city?.countyCode,
      "package": {
        "weight": dimentions.weight,
        "height": dimentions.height,
        "width": dimentions.width,
        "length": dimentions.length
      },
      "productType": 3,
      "contentType": 5,
      "declaredWorth": cart?.reduce((bef, curr) => curr.quantityOffers ? bef + offer(curr) : bef + curr.price * curr.quantity, 0),
      "deliveryTime": 0
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Ocp-Apim-Subscription-Key': chile.cotizadorKey
      }
    })
    setShipping(request.data.data.courierServiceOptions)
    setCity(e.target.value)
  }

  const inputChange = (e: any) => {
    setShippingCost(e.target.value)
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='font-medium text-xl sm:text-3xl'>Calcula los costos de envío</h2>
      <div className='flex flex-col gap-2'>
        <Select selectChange={regionChange} style={style}>
          <option>Seleccionar Región</option>
          {
            regions !== undefined
              ? regions.map(region => <option key={region.regionId}>{region.regionName.toLocaleLowerCase()}</option>)
              : ''
          }
        </Select>
        {
          citys !== undefined
          ? <Select selectChange={cityChange} style={style}>
            <option>Seleccionar Ciudad</option>
            {citys.map(city => <option key={city.countyCode}>{city.countyName}</option>)}
          </Select>
          : ''
        }
      </div>
      {
        shipping !== undefined
        ? (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <span>Envíos express:</span>
              {FreeShipping.map(cityFree => {
                if (cityFree === city) {
                  return <div className='flex justify-between p-2 border rounded' key={cityFree}>
                    <div className='flex gap-2'>
                      <input type='radio' name='shipping' className='envio express' value={0} onChange={inputChange} />
                      <span className='text-sm text-[#444444]'>Envío gratis en 24 a 48 horas</span>
                    </div>
                    <span className='text-sm text-[#444444]'>$0</span>
                  </div>
                }
                return null
              })}
            </div>
            <div className='flex flex-col gap-2'>
              <span className='mt-1'>Chilexpress:</span>
              {shipping.map(service => (
                <div key={service.serviceDescription} className='flex justify-between p-2 border rounded'>
                  <div className='flex gap-2'>
                    <input type='radio' name='shipping' className={service.serviceDescription} value={service.serviceValue} onChange={inputChange} />
                    <span className='text-sm text-[#444444]'>{service.serviceDescription}</span>
                  </div>
                  <span className='text-sm text-[#444444]'>${NumberFormat(Number(service.serviceValue))}</span>
                </div>
              ))}
            </div>
          </div>
        )
        : ''
      }
    </div>
  )
}
