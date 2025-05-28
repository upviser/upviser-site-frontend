"use client"
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import styles from "./css/SafariProductSlider.module.css"
import { Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules"
import Image from 'next/image'

interface Props {
  images: string[]
  style: any
}

export const SafariProductSlider: React.FC<Props> = ({ images, style }) => {
  return (
    <>
      <Swiper
        className={styles.mySwiper}
        cssMode={true}
        pagination={{
            clickable: true
        }}
        mousewheel={true}
        keyboard={true}
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
      >
        {
          images.map(image => {
            return (
              <SwiperSlide key={ image }>
                <Image src={image} alt='Imagen producto' width={650} height={650} className={`m-auto w-full h-auto max-w-2xl`} style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderBlock}px` : '' }} />
              </SwiperSlide>
            )
          })
        }
      </Swiper>
    </>
  )
}