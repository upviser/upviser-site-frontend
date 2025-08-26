import React from 'react'
import { H2 } from '../ui'
import { NumberFormat, offer } from '@/utils'
import { ISell, IShipping } from '@/interfaces'

interface Props {
    shipping: IShipping[] | undefined
    sell: ISell
    inputChange: any
    setSell: any
    payment?: any
    style?: any
    sellRef: any
    initializationRef: any
    setServiceTypeCode?: any
    serviceTypeCodeRef?: any
}

export const ShippingPay: React.FC<Props> = ({ shipping, sell, inputChange, setSell, payment, style, sellRef, initializationRef, setServiceTypeCode, serviceTypeCodeRef }) => {
  return (
    <>
      {
        shipping !== undefined
          ? (
            <div className='flex flex-col gap-4'>
              <h2 className='font-semibold text-xl sm:text-3xl'>Envío</h2>
              <div className='flex flex-col gap-2'>
                {
                  shipping.map(item => (
                    <button className='flex gap-2 justify-between p-2 border' name='shipping' value={item.serviceDescription} onClick={(e: any) => {
                      e.preventDefault()
                      setServiceTypeCode(item.serviceTypeCode)
                      serviceTypeCodeRef.current = item.serviceTypeCode
                      setSell({ ...sell, shippingMethod: item.serviceDescription, shipping: item.serviceValue, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(item.serviceValue) })
                      sellRef.current = { ...sell, shippingMethod: item.serviceDescription, shipping: item.serviceValue, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(item.serviceValue) }
                      initializationRef.current = { amount: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(item.serviceValue) }
                    }} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} key={item.serviceTypeCode}>
                      <div className='flex gap-2'>
                        <input type='radio' onChange={() => {
                          setServiceTypeCode(item.serviceTypeCode)
                          serviceTypeCodeRef.current = item.serviceTypeCode
                          setSell({ ...sell, shippingMethod: item.serviceDescription, shipping: item.serviceValue, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(item.serviceValue) })
                          sellRef.current = { ...sell, shippingMethod: item.serviceDescription, shipping: item.serviceValue, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(item.serviceValue) }
                          initializationRef.current = { amount: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(item.serviceValue) }
                        }} checked={sell.shippingMethod === item.serviceDescription} />
                        <p className='text-sm mt-auto mb-auto'>{item.serviceDescription}</p>
                      </div>
                      <p className='text-sm'>${NumberFormat(Number(item.serviceValue))}</p>
                    </button>
                  ))
                }
              </div>
            </div>
          )
          : ''
      }
      {
        sell.shippingMethod
          ? (
            <div className='flex flex-col gap-4'>
              <H2 text='Pago' />
              <div className='flex flex-col gap-2'>
                {
                  payment.mercadoPago.active && payment.mercadoPago.accessToken !== '' && payment.mercadoPago.publicKey !== ''
                    ? (
                      <button className='flex gap-2 p-2 border' name='pay' value='MercadoPago' onClick={inputChange} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                        <input type='radio' name='pay' value='MercadoPago' onChange={inputChange} checked={sell.pay === 'MercadoPago'} />
                        <button name='pay' value='MercadoPago' onClick={inputChange} className='text-sm'>Tarjeta de Credito o Debito</button>
                      </button>
                    )
                    : ''
                }
                {
                  payment.transbank.active && payment.transbank.commerceCode !== '' && payment.transbank.apiKey !== ''
                    ? (
                      <button className='flex gap-2 p-2 border' name='pay' value='WebPay Plus' onClick={inputChange} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                        <input type='radio' name='pay' value='WebPay Plus' onChange={inputChange} checked={sell.pay === 'WebPay Plus'} />
                        <button name='pay' value='WebPay Plus' onClick={inputChange} className='text-sm'>WebPay Plus</button>
                      </button>
                    )
                    : ''
                }
                {
                  payment.mercadoPagoPro.active && payment.mercadoPagoPro.accessToken !== '' && payment.mercadoPagoPro.publicKey !== ''
                    ? (
                      <button className='flex gap-2 p-2 border' name='pay' value='MercadoPagoPro' onClick={inputChange} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                        <input type='radio' name='pay' value='MercadoPagoPro' onChange={inputChange} checked={sell.pay === 'MercadoPagoPro'} />
                        <button name='pay' value='MercadoPagoPro' onClick={inputChange} className='text-sm'>MercadoPago</button>
                      </button>
                    )
                    : ''
                }
              </div>
            </div>
          )
          : ''
      }
    </>
  )
}
