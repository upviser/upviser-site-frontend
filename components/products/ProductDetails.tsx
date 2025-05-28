import React from 'react'
import { ICartProduct, IProduct, ITypeVariation } from '../../interfaces'
import { NumberFormat } from '../../utils'
import { ButtonAddToCart, ButtonNone, Select } from '../ui'
import Image from 'next/image'

interface Props {
  product: IProduct,
  tempCartProduct: ICartProduct,
  setTempCartProduct: any
  popup: any
  setPopup: any
  style: any
  liveData: { stock: string, price: string, beforePrice: string, variations: ITypeVariation }
}

export const ProductDetails: React.FC<Props> = ({ product, tempCartProduct, setTempCartProduct, popup, setPopup, style, liveData }) => {

  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( (currentProduct: any) => ({
      ...currentProduct,
      quantity
    }))
  }

  const selectVariation = (e: any) => {
    const tempProduct = { ...tempCartProduct }
    let vari: string = ''
    let subVari: string = ''
    let subVari2: string = ''
    if (e.target.value.includes(' / ')) {
      const variation = e.target.value.split(' / ')
      vari = variation[0]
      subVari = variation[1]
      if (variation[2]) {
        subVari2 = variation[2]
      }
    } else {
      vari = e.target.value
    }
    if (subVari !== '') {
      const variationSelect = product.variations?.variations.filter(variation => variation.variation === vari)
      const variation = variationSelect?.find(variation => variation.subVariation === subVari)
      if (subVari2 !== '') {
        const varia = variationSelect?.find(variation => variation.subVariation2 === subVari2 && variation.subVariation === subVari && variation.variation === vari)
        tempProduct.variation = varia
        tempProduct.image = varia!.image!
      } else {
        tempProduct.variation = variation
        tempProduct.image = variation!.image!
      }
    } else {
      const variationSelect = product.variations?.variations.find(variation => variation.variation === vari)
      tempProduct.variation = variationSelect
      tempProduct.image = variationSelect!.image!
    }
    setTempCartProduct(tempProduct)
  }

  return (
      <div className='m-auto p-4 block bg-white gap-2 w-full border-t justify-around dark:bg-neutral-900 dark:border dark:border-neutral-800 sm:flex'>
        <div className='flex mb-2 justify-around gap-2 sm:mb-0'>
          <Image className='w-20 h-20 mt-auto mb-auto' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} src={ tempCartProduct.image && tempCartProduct.image !== '' ? tempCartProduct.image : product?.images[0]} alt={product.name} width={80} height={80} />
          <div className='mt-auto mb-auto'>
            <p>{product.name}</p>
            <div className='flex gap-1'>
              <span className='font-medium'>${liveData.price && liveData.price !== '' ? NumberFormat(Number(liveData.price)) :  NumberFormat(product.price)}</span>
              {
                product.beforePrice || (liveData.beforePrice && liveData.beforePrice !== '')
                  ? <span className='line-through text-sm'>${liveData.beforePrice && liveData.beforePrice !== '' ? NumberFormat(Number(liveData.beforePrice)) :  NumberFormat(product.beforePrice!)}</span>
                  : ''
              }
            </div>
            {
              liveData.variations.variations.length
                ? product.variations?.variations.length
                  ? product.variations.variations[0].variation !== ''
                    ? <Select style={style} selectChange={selectVariation} value={tempCartProduct.variation?.variation ? tempCartProduct.variation.subVariation ? tempCartProduct.variation.subVariation2 ? `${tempCartProduct.variation?.variation} / ${tempCartProduct.variation.subVariation} / ${tempCartProduct.variation.subVariation2}` : `${tempCartProduct.variation?.variation} / ${tempCartProduct.variation.subVariation}` : tempCartProduct.variation?.variation : 'Seleccionar variación'}>
                        <option>Seleccionar variación</option>
                        {
                          product.variations.variations.map(variation => (
                            <option key={variation.variation}>{variation.variation}{variation.subVariation && variation.subVariation !== '' ? ` / ${variation.subVariation}` : ''}{variation.subVariation2 && variation.subVariation2 !== '' ? ` / ${variation.subVariation2}` : ''}</option>
                          ))
                        }
                      </Select>
                    : ''
                  : ''
                : liveData.variations.variations[0]?.variation && liveData.variations.variations[0].variation !== ''
                    ? <Select style={style} selectChange={selectVariation} value={tempCartProduct.variation?.variation ? tempCartProduct.variation.subVariation ? tempCartProduct.variation.subVariation2 ? `${tempCartProduct.variation?.variation} / ${tempCartProduct.variation.subVariation} / ${tempCartProduct.variation.subVariation2}` : `${tempCartProduct.variation?.variation} / ${tempCartProduct.variation.subVariation}` : tempCartProduct.variation?.variation : 'Seleccionar variación'}>
                        <option>Seleccionar variación</option>
                        {
                          liveData.variations.variations.map(variation => (
                            <option key={variation.variation}>{variation.variation}{variation.subVariation && variation.subVariation !== '' ? ` / ${variation.subVariation}` : ''}{variation.subVariation2 && variation.subVariation2 !== '' ? ` / ${variation.subVariation2}` : ''}</option>
                          ))
                        }
                      </Select>
                    : ''
              }
          </div>
        </div>
        {
          product.stock === 0
            ? ''
            : (
              <div className='flex w-full max-w-[500px]'>
                <div className='flex m-auto justify-around gap-2 w-full h-fit'>
                  {
                    !liveData.variations.variations.length
                      ? product?.variations?.variations.length && product.variations.variations[0].variation !== '' && tempCartProduct.variation?.variation
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
                      : liveData.variations.variations[0].subVariation !== '' && tempCartProduct.variation?.subVariation
                          ? liveData.variations.variations[0].subVariation2 !== '' && tempCartProduct.variation?.subVariation2
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
                            : liveData.variations.variations[0].subVariation2
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
                          : liveData.variations.variations[0].subVariation
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
                    }
                </div>
              </div>
            )
        }
      </div>
  )
}
