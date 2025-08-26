import React from 'react'
import { Button, Button2, H2, Input } from '../ui'
import Image from 'next/image'
import { NumberFormat, offer } from '@/utils'
import { Design, ICartProduct, ISell } from '@/interfaces'

export const Resume = ({ cart, sell, style, design }: { cart: ICartProduct[] | undefined, sell: ISell, style: any, design: Design }) => {
  return (
    <div className='w-5/12 h-fit p-6 hidden sticky top-28 bg-gray-50 xl:block' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', backgroundColor: design.checkoutPage.detailsColor }}>
      <div className='mb-2 flex flex-col gap-2 pb-2 border-b'>
        <h2 className='font-medium text-xl sm:text-3xl'>Carrito</h2>
        {
          cart?.length !== 0
            ? cart?.map(product => (
              <div className='flex gap-2 justify-between mb-2' key={product._id}>
                <div className='flex gap-2'>
                  <Image className='w-20 h-auto border p-1' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} src={product.image!} alt={product.name} width={80} height={80} />
                  <div className='mt-auto mb-auto'>
                    <span className='block font-medium'>{product.name.toLocaleUpperCase()}</span>
                    <span className='block'>Cantidad: {product.quantity}</span>
                    {
                      product.variation
                        ? <span className='block'>{product.variation.variation}{product.variation.subVariation ? ` / ${product.variation.subVariation}` : ''}</span>
                        : ''
                    }
                  </div>
                </div>
                <div className='flex gap-2 mt-auto mb-auto'>
                  <span className='font-medium'>${NumberFormat(product.quantityOffers?.length ? offer(product) : product.price * product.quantity)}</span>
                  {
                    product.beforePrice
                      ? <span className='text-sm line-through'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                      : ''
                  }
                </div>
              </div>
            ))
            : ''
        }
      </div>
      <div className='mb-2 flex flex-col gap-2 pb-3 border-b'>
        <h2 className='font-medium text-xl sm:text-3xl'>Cupon de descuento</h2>
        <div className='flex gap-2'>
          <Input inputChange={undefined} value={undefined} type={'text'} placeholder={'Cupon'} text='text-sm' style={style} />
          <Button style={style}>Agregar</Button>
        </div>
      </div>
      <div className='mb-2 pb-2 border-b'>
        <div className='flex gap-2 justify-between mb-1'>
          <span className='text-[14px]'>Subtotal</span>
          <span className='text-[14px]'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
        </div>
        <div className='flex gap-2 justify-between'>
          <span className='text-[14px]'>Envío</span>
          <span className='text-[14px]'>${NumberFormat(Number(sell.shipping))}</span>
        </div>
      </div>
      <div className='flex gap-2 justify-between'>
        <span className='font-medium'>Total</span>
        <span className='font-medium'>${NumberFormat(sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping))}</span>
      </div>
    </div>
  )
}
