"use client"
import React, { useEffect, useState } from 'react'
import browser from 'browser-detect'
import { OtherProductSlider, SafariProductSlider } from './'

interface Props {
  images: string[]
  style: any
}

export const ProductSlider: React.FC<Props> = ({ images, style }) => {

  const [browserName, setBrowserName] = useState('')

  useEffect(() => {
    setBrowserName(browser().name!)
  }, [])

  return (
    <div>
      {
        browserName === 'safari'
          ? <SafariProductSlider images={images} style={style} />
          : <OtherProductSlider images={images} style={style} />
      }
    </div>
  )
}