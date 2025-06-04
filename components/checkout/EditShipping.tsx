import React from 'react'
import { Button, H3, Input } from '../ui'
import { Shipping } from '../products'
import { ISell } from '@/interfaces'

interface Props {
    shippingMouse: boolean
    setShippingOpacity: any
    setShippingView: any
    shippingView: string
    shippingOpacity: string
    setShippingMouse: any
    sell: ISell
    inputChange: any
    setSell: any
    setShipping: any
    chilexpress: any
    style: any
    sellRef: any
}

export const EditShipping: React.FC<Props> = ({ shippingMouse, setShippingOpacity, setShippingView, shippingView, shippingOpacity, setShippingMouse, sell, inputChange, setSell, setShipping, chilexpress, style, sellRef }) => {
  return (
    <div onClick={() => {
        if (!shippingMouse) {
          setShippingOpacity('opacity-0')
          setTimeout(() => {
            setShippingView('hidden')
          }, 200)
        }
      }} className={`${shippingView} ${shippingOpacity} transition-opacity duration-200 w-full h-full fixed z-50 top-0 px-4 bg-black/30`}>
        <div onMouseEnter={() => setShippingMouse(true)} onMouseLeave={() => setShippingMouse(false)} className={`${shippingOpacity === 'opacity-1' ? 'scale-1' : 'scale-90'} transition-transform duration-200 m-auto p-6 bg-white flex flex-col gap-4 rounded-xl max-w-[500px] w-full`}>
          <H3 text='Editar dirección de envío' />
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Dirección</p>
            <Input placeholder='Dirección' name='address' inputChange={inputChange} value={sell.address} style={style} />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Deptartamento</p>
            <Input placeholder='Departamento (Opcional)' name='details' inputChange={inputChange} value={sell.details} style={style} />
          </div>
          <Shipping setShipping={setShipping} sell={sell} setSell={setSell} sellRef={sellRef} chilexpress={chilexpress} style={style} />
          <Button action={(e: any) => {
            e.preventDefault()
            setShippingOpacity('opacity-0')
            setTimeout(() => {
              setShippingView('hidden')
            }, 200)
          }} style={style} config='w-full'>Guardar datos</Button>
        </div>
      </div>
  )
}
