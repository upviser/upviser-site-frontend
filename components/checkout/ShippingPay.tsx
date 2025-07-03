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

    const shippingChange = (e: any) => {
        const ship = shipping?.find(ship => ship.serviceValue === e.target.value)
        setServiceTypeCode(ship?.serviceTypeCode)
        serviceTypeCodeRef.current = ship?.serviceTypeCode
        setSell({ ...sell, shippingMethod: e.target.className, shipping: e.target.value, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(e.target.value) })
        sellRef.current = { ...sell, shippingMethod: e.target.className, shipping: e.target.value, shippingState: 'No empaquetado', total: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(e.target.value) }
        initializationRef.current = { amount: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(e.target.value) }
      }

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
                    <div className='flex gap-2 justify-between p-2 border dark:border-neutral-700' style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} key={item.serviceDescription}>
                      <div className='flex gap-2'>
                        <input type='radio' name='shipping' className={item.serviceDescription} value={item.serviceValue} onChange={shippingChange} />
                        <p className='text-sm mt-auto mb-auto'>{item.serviceDescription}</p>
                      </div>
                      <p className='text-sm'>${NumberFormat(Number(item.serviceValue))}</p>
                    </div>
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
                      <div className='flex gap-2 p-2 border dark:border-neutral-700' style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                        <input type='radio' name='pay' value='MercadoPago' onChange={inputChange} />
                        <p className='text-sm'>Tarjeta de Credito o Debito</p>
                      </div>
                    )
                    : ''
                }
                {
                  payment.transbank.active && payment.transbank.commerceCode !== '' && payment.transbank.apiKey !== ''
                    ? (
                      <div className='flex gap-2 p-2 border dark:border-neutral-700' style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                        <input type='radio' name='pay' value='WebPay Plus' onChange={inputChange} />
                        <p className='text-sm'>WebPay Plus</p>
                      </div>
                    )
                    : ''
                }
                {
                  payment.mercadoPagoPro.active && payment.mercadoPagoPro.accessToken !== '' && payment.mercadoPagoPro.publicKey !== ''
                    ? (
                      <div className='flex gap-2 p-2 border dark:border-neutral-700' style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                        <input type='radio' name='pay' value='MercadoPagoPro' onChange={inputChange} />
                        <p className='text-sm'>MercadoPago</p>
                      </div>
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
