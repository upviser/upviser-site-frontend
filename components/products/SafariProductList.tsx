"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from  "./css/SafariProductList.module.css"
import { Keyboard, Mousewheel, Navigation, Pagination } from "swiper/modules"
import { IProduct } from '../../interfaces'
import ProductCard from './ProductCard'
import { H2 } from '../ui'

interface Props {
  products: IProduct[]
  title: string
  style: any
}

export const SafariProductList: React.FC<Props> = ({ products, title, style }) => {
  return (
    <div className='flex w-full p-4'>
      <div className='m-auto w-full max-w-[1280px] relative items-center'>
        <h2 className='mb-4 font-medium text-xl sm:text-3xl'>{title}</h2>
        <Swiper
          className={styles.mySwiper}
          slidesPerView={window.innerWidth > 1100 ? 4 : window.innerWidth > 850 ? 3 : 2}
          cssMode={true}
          pagination={{
            clickable: true
          }}
          mousewheel={true}
          keyboard={true}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        >
          {
            products.map(product => (
              <SwiperSlide className='m-auto' key={product._id}>
                <ProductCard product={product} style={style} />
                <div className='h-8' />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </div>
  )
}
