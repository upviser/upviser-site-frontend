"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonAddToCart, ButtonNone, Input, ItemCounter } from '../ui'
import { IProduct } from '@/interfaces'
import axios from 'axios'

interface Props {
    product: IProduct
    tempCartProduct: any
    setPopup: any
    popup: any
    setDetailsPosition: any
    setTempCartProduct: any
    style: any
}

export const AddToCart: React.FC<Props> = ({ product, tempCartProduct, setPopup, popup, setDetailsPosition, setTempCartProduct, style }) => {

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

    const addButtonRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
      if (addButtonRef.current) {
        const buttonRect = addButtonRef.current.getBoundingClientRect()
        if (buttonRect.top > 0 && buttonRect.bottom < window.innerHeight) {
          setDetailsPosition('-bottom-44')
        } else {
          setDetailsPosition('-bottom-1')
        }
      }
    }
          
    useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
          
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }, [])

    const onUpdateQuantity = ( quantity: number ) => {
        setTempCartProduct( (currentProduct: IProduct) => ({
          ...currentProduct,
          quantity
        }))
      }

  return (
    <>
      {
        product?.stock === 0
          ? (
            <div className='flex flex-col gap-2'>
              <p className='text-sm'>Deja tu correo para avisarte cuando tengamos este producto nuevamente en stock</p>
              <div className='flex gap-2'>
                <Input inputChange={(e: any) => setEmail(e.target.value)} value={email} placeholder={'Email'} style={style} />
                <Button style={style} action={async (e: any) => {
                  e.preventDefault()
                  if (!loading) {
                    setLoading(true)
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/email-product/${email}`, { product: product.name })
                    setLoading(false)
                  }
                }} loading={loading}>Envíar</Button>
              </div>
            </div>
          )
          : (
            <div ref={addButtonRef} className='flex flex-col gap-4 pb-4 border-b w-full'>
              <ItemCounter
                currentValue={ tempCartProduct.quantity }
                updatedQuantity={ onUpdateQuantity }
                maxValue={ tempCartProduct.stock ? tempCartProduct.stock : product.stock }
                style={style}
              />
              {
                product?.variations?.variations.length && product.variations.variations[0].variation !== '' && tempCartProduct.variation?.variation
                  ? product.variations.variations[0].subVariation !== '' && tempCartProduct.variation?.subVariation
                    ? product.variations.variations[0].subVariation2 !== '' && tempCartProduct.variation?.subVariation2
                      ? (
                        <div className="w-full h-fit" onClick={() => {
                          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                          setTimeout(() => {
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                          }, 10)
                        }}>
                          <ButtonAddToCart tempCartProduct={tempCartProduct} style={style} />
                        </div>
                      )
                      : product.variations.variations[0].subVariation2
                        ? <ButtonNone style={style}>Añadir al carrito</ButtonNone>
                        : (
                          <div className="w-full h-fit" onClick={() => {
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                            setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                            }, 10)
                          }}>
                            <ButtonAddToCart tempCartProduct={tempCartProduct} style={style} />
                          </div>
                        )
                    : product.variations.variations[0].subVariation
                      ? <ButtonNone style={style}>Añadir al carrito</ButtonNone>
                      : (
                        <div className="w-full h-fit" onClick={() => {
                          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                          setTimeout(() => {
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                          }, 10)
                        }}>
                          <ButtonAddToCart tempCartProduct={tempCartProduct} style={style} />
                        </div>
                      )
                  : <ButtonNone style={style}>Añadir al carrito</ButtonNone>
              }
            </div>
        )
      }
    </>
  )
}
