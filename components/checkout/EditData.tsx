import React from 'react'
import { Button, H3, Input } from '../ui'
import { ISell } from '@/interfaces'

interface Props {
    contactMouse: boolean
    setContactOpacity: any
    setContactView: any
    contactView: string
    contactOpacity: string
    setContactMouse: any
    inputChange: any
    sell: ISell
    style?: any
}

export const EditData: React.FC<Props> = ({ contactMouse, setContactOpacity, setContactView, contactView, contactOpacity, setContactMouse, inputChange, sell, style }) => {
  return (
    <div onClick={() => {
        if (!contactMouse) {
          setContactOpacity('opacity-0')
          setTimeout(() => {
            setContactView('hidden')
          }, 200)
        }
      }} className={`${contactView} ${contactOpacity} transition-opacity px-4 duration-200 w-full h-full fixed top-0 z-50 bg-black/30`}>
        <div onMouseEnter={() => setContactMouse(true)} onMouseLeave={() => setContactMouse(false)} className={`${contactOpacity === 'opacity-1' ? 'scale-1' : 'scale-90'} transition-transform duration-200 m-auto p-6 bg-white flex flex-col gap-4 rounded-xl max-w-[500px] w-full`}>
          <H3 text='Editar datos de contacto' />
          <div className='flex gap-2'>
            <div className='flex flex-col w-1/2 gap-2'>
              <p className='text-sm'>Nombre</p>
              <Input placeholder='Nombre' name='firstName' inputChange={inputChange} value={sell.firstName} style={style} />
            </div>
            <div className='flex flex-col w-1/2 gap-2'>
              <p className='text-sm'>Apellido</p>
              <Input placeholder='Apellido' name='lastName' inputChange={inputChange} value={sell.lastName} style={style} />
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>Teléfono</p>
            <div className='flex gap-2'>
              <span className='mt-auto mb-auto text-sm'>+56</span>
              <Input placeholder='Teléfono' name='phone' inputChange={inputChange} value={sell.phone} style={style} />
            </div>
          </div>
          <Button action={(e: any) => {
            e.preventDefault()
            setContactOpacity('opacity-0')
            setTimeout(() => {
              setContactView('hidden')
            }, 200)
          }} style={style} config='w-full'>Guardar datos</Button>
        </div>
      </div>
  )
}
