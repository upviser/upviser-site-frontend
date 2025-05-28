"use client"
import React from 'react'
import Image from 'next/image'
import { ICartProduct, IProduct, ITypeVariation, IVariation } from '@/interfaces'

export const ProductVariations = ({ variations, tempCartProduct, setTempCartProduct, style }: { variations: ITypeVariation, tempCartProduct: ICartProduct, setTempCartProduct: any, style: any }) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-2'>
        <span className='text-sm font-medium'>{variations.nameVariation}:</span>
        <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.variation}</span>
      </div>
      {
        variations.nameVariations.length
          ? (
            <div className='flex gap-2'>
              {
                variations.nameVariations.map(variation => {
                  let find: IVariation | undefined
                  if (tempCartProduct.variation?.subVariation && tempCartProduct.variation?.subVariation) {
                    if (tempCartProduct.variation?.subVariation2 && tempCartProduct.variation?.subVariation2) {
                      find = variations.variations.find(vari => vari.variation === variation.variation && vari.subVariation === tempCartProduct.variation?.subVariation && vari.subVariation2 === tempCartProduct.variation?.subVariation2)
                    } else {
                      find = variations.variations.find(vari => vari.variation === variation.variation && vari.subVariation === tempCartProduct.variation?.subVariation)
                    }
                  } else {
                    find = variations.variations.find(vari => vari.variation === variation.variation)
                  }
                  return (
                    <div key={variation?.variation}>
                      {
                        variations.formatVariation === 'Imagen'
                          ? (
                            <Image src={find!.image!} alt='Imagen variación' width={80} height={80} onClick={() => {
                              setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, variation: variation?.variation}, image: find!.image!, stock: find?.stock})
                            }} className={`w-20 h-20 border transition-colors duration-150 p-1 cursor-pointer`} style={{ border: tempCartProduct.variation?.variation && tempCartProduct.variation.variation === variation?.variation ? `1px solid ${style?.primary}` : '', borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} />
                          )
                          : variations.formatVariation === 'Color'
                            ? (
                              <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, variation: variation?.variation}, image: find!.image!, stock: find?.stock})
                              }} className={`w-10 h-10 rounded-full border p-1 cursor-pointer transition-colors duration-150`} style={{ border: tempCartProduct.variation?.variation && tempCartProduct.variation.variation === variation?.variation ? `1px solid ${style?.primary}` : '' }}>
                                <div className={`m-auto border w-full h-full rounded-full`} style={{ backgroundColor: `${variation.colorVariation}` }} />
                              </div>
                            )
                            : variations.formatVariation === 'Texto'
                              ? <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, variation: variation?.variation}, image: find!.image!, stock: find?.stock})
                              }} className={`py-1.5 px-4 rounded-full border transition-colors duration-150 cursor-pointer`} style={{ border: tempCartProduct.variation?.variation && tempCartProduct.variation.variation === variation?.variation ? `1px solid ${style?.primary}` : '' }}>{variation.variation}</div>
                              : ''
                      }
                      
                    </div>
                  )
                })
              }  
            </div>
          )
          : ''
      }
      {
        variations?.nameSubVariation
          ? (
            <div className='flex gap-2'>
              <span className='text-sm font-medium'>{variations.nameSubVariation}:</span>
              <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.subVariation}</span>
            </div>
          )
          : ''
      }
      {
        variations.nameSubVariations?.length
          ? (
            <div className='flex gap-2'>
              {
                variations.nameSubVariations?.map(variation => {
                  let find: IVariation | undefined
                  if (tempCartProduct.variation?.variation && tempCartProduct.variation?.variation) {
                    if (tempCartProduct.variation?.subVariation2 && tempCartProduct.variation?.subVariation2) {
                      find = variations.variations.find(vari => vari.subVariation === variation.subVariation && vari.variation === tempCartProduct.variation?.variation && vari.subVariation2 === tempCartProduct.variation.subVariation2)
                    } else {
                      find = variations.variations.find(vari => vari.subVariation === variation.subVariation && vari.variation === tempCartProduct.variation?.variation)
                    }
                  } else {
                    find = variations.variations.find(vari => vari.subVariation === variation.subVariation)
                  }
                  return (
                    <div key={variation?.subVariation}>
                      {
                        variations.formatSubVariation === 'Imagen'
                          ? (
                            <Image src={find!.image!} alt='Imagen variación' width={80} height={80} onClick={() => {
                              setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.subVariation}, image: find!.image!, stock: find?.stock})
                            }} className={`w-20 h-20 transition-colors duration-150 border p-1 cursor-pointer`} style={{ border: tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.subVariation ? `1px solid ${style?.primary}` : '', borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} />
                          )
                          : variations.formatSubVariation === 'Color'
                            ? (
                              <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.subVariation}, image: find!.image!, stock: find?.stock})
                              }} className={`w-10 h-10 rounded-full border p-1 cursor-pointer transition-colors duration-150`} style={{ border: tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.subVariation ? `1px solid ${style?.primary}` : '' }}>
                                <div className={`m-auto w-full h-full rounded-full`} style={{ backgroundColor: `${variation.colorSubVariation}` }} />
                              </div>
                            )
                            : variations.formatSubVariation === 'Texto'
                              ? <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation: variation?.subVariation}, image: find!.image!, stock: find?.stock})
                              }} className={`py-1.5 px-4 rounded-full border transition-colors duration-150 cursor-pointer`} style={{ border: tempCartProduct.variation?.subVariation && tempCartProduct.variation.subVariation === variation?.subVariation ? `1px solid ${style?.primary}` : '' }}>{variation.subVariation}</div>
                              : ''
                      }
                      
                    </div>
                  )
                })
              }  
            </div>
          )
          : ''
      }
      {
        variations?.nameSubVariation2
          ? (
            <div className='flex gap-2'>
              <span className='text-sm font-medium'>{variations.nameSubVariation2}:</span>
              <span className='text-sm dark:text-neutral-400'>{tempCartProduct.variation?.subVariation2}</span>
            </div>
          )
          : ''
      }
      {
        variations.nameSubVariations2?.length
          ? (
            <div className='flex gap-2'>
              {
                variations.nameSubVariations2?.map(variation => {
                  let find: IVariation | undefined
                  if (tempCartProduct.variation?.variation && tempCartProduct.variation?.variation) {
                    if (tempCartProduct.variation?.subVariation && tempCartProduct.variation?.subVariation) {
                      find = variations.variations.find(vari => vari.subVariation2 === variation.subVariation2 && vari.variation === tempCartProduct.variation?.variation && vari.subVariation === tempCartProduct.variation.subVariation)
                    } else {
                      find = variations.variations.find(vari => vari.subVariation2 === variation.subVariation2 && vari.variation === tempCartProduct.variation?.variation)
                    }
                  } else {
                    find = variations.variations.find(vari => vari.subVariation2 === variation.subVariation2)
                  }
                  return (
                    <div key={variation?.subVariation2}>
                      {
                        variations.formatSubVariation2 === 'Imagen'
                          ? (
                            <Image src={find!.image!} alt='Imagen variación' width={80} height={80} onClick={() => {
                              setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation2: variation?.subVariation2}, image: find!.image!, stock: find?.stock})
                            }} className={`w-20 h-20 transition-colors duration-150 border p-1 cursor-pointer`} style={{ border: tempCartProduct.variation?.subVariation2 && tempCartProduct.variation.subVariation2 === variation?.subVariation2 ? `1px solid ${style?.primary}` : '', borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} />
                          )
                          : variations.formatSubVariation2 === 'Color'
                            ? (
                              <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation2: variation?.subVariation2}, image: find!.image!, stock: find?.stock})
                              }} className={`w-10 h-10 rounded-full border p-1 cursor-pointer transition-colors duration-150`} style={{ border: tempCartProduct.variation?.subVariation2 && tempCartProduct.variation.subVariation2 === variation?.subVariation2 ? `1px solid ${style?.primary}` : '' }}>
                                <div className={`m-auto w-full h-full rounded-full`} style={{ backgroundColor: `${variation.subVariation2}` }} />
                              </div>
                            )
                            : variations.formatSubVariation2 === 'Texto'
                              ? <div onClick={() => {
                                setTempCartProduct({...tempCartProduct, variation: {...tempCartProduct.variation, subVariation2: variation?.subVariation2}, image: find!.image!, stock: find?.stock})
                              }} className={`py-1.5 px-4 rounded-full border transition-colors duration-150 cursor-pointer`} style={{ border: tempCartProduct.variation?.subVariation2 && tempCartProduct.variation.subVariation2 === variation?.subVariation2 ? `1px solid ${style?.primary}` : '' }}>{variation.subVariation2}</div>
                              : ''
                      }
                      
                    </div>
                  )
                })
              }  
            </div>
          )
          : ''
      }
    </div>
  )
}
