"use client"
import React, { useEffect, useState } from 'react'
import { IProduct } from '../../interfaces'
import browser from 'browser-detect'
import { SafariRecomendedProducts, OtherRecomendedProducts } from './'
import { useRouter } from 'next/navigation'

interface Props {
  products: IProduct[]
  title: string
  productSelect?: IProduct
  style: any
}

export const RecomendedProducts: React.FC<Props> = ({ products, title, productSelect, style }) => {
  
  const [browserName, setBrowserName] = useState('')

  const router = useRouter()

  useEffect(() => {
    setBrowserName(browser().name!)
  }, [router])

  return (
    <div>
      {
        browserName === 'safari'
          ? <SafariRecomendedProducts products={products} title={title} style={style} />
          : <OtherRecomendedProducts products={products} title={title} style={style} />
      }
    </div>
  )
}