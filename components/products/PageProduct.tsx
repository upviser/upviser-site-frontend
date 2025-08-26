"use client"
import { Design, ICartProduct, ICategory, IProduct, ITypeVariation } from "@/interfaces"
import { useEffect, useState } from "react"
import { Information, NoReviewsProduct, ProductDetails, ProductInfo, ReviewsProduct } from "./"
import axios from "axios"
import Cookies from 'js-cookie'
import { H2 } from "../ui"

declare const fbq: Function

export default function PageProduct ({ product, design, products, categories, style, integrations }: { product: IProduct, design: Design, products: IProduct[], categories: ICategory[], style: any , integrations: any}) {

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    name: product.name,
    price: product.price,
    beforePrice: product.beforePrice,
    slug: product.slug,
    quantity: 1,
    stock: product.stock,
    category: product.category,
    quantityOffers: product.quantityOffers,
    dimentions: product.dimentions
  })
  const [liveData, setLiveData] = useState({ stock: '', price: '', beforePrice: '', variations: { formatVariation: '', nameVariation: '', nameVariations: [], variations: [] } })
  const [detailsPosition, setDetailsPosition] = useState('-bottom-44')
  const [productsFiltered, setProductsFiltered] = useState<IProduct[]>([])
  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })

  const viewContent = async () => {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/view-content`, { product: product, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
    if (typeof fbq === 'function') {
      fbq('track', 'ViewContent', {content_name: product.name, content_category: product.category.category, currency: "clp", value: product.price, content_ids: [product._id], contents: { id: product._id, category: product.category.category, item_price: product.price, title: product.name }, event_id: res.data._id})
    }
  }

  useEffect(() => {
    if (integrations?.apiPixelId && integrations.apiPixelId !== '') {
      const interval = setInterval(() => {
        if (typeof fbq === 'function') {
          viewContent()
          clearInterval(interval)
        }
      }, 100)
    
      return () => clearInterval(interval)
    } else {
      viewContent()
    }
  }, [])

  const updateData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/product-data/${product._id}`)
    setLiveData({ beforePrice: res.data.beforePrice, price: res.data.price, stock: res.data.stock, variations: res.data.variations })
    setTempCartProduct({ ...tempCartProduct, stock: res.data.stock, price: res.data.price, beforePrice: res.data.beforePrice })
  }

  useEffect(() => {
    updateData()
  }, [])
    
  const filterProducts = () => {
    let pruebaSet: Set<IProduct> = new Set()
    product.tags.forEach(tag => {
      const filteredProducts = products.filter(prod => prod.tags.includes(tag))
      filteredProducts.forEach(prod => pruebaSet.add(prod))
    })
    const uniqueProducts = Array.from(pruebaSet)
    const prueba = uniqueProducts.filter(prod => prod._id !== product._id)
    setProductsFiltered(prueba)
  }
    
  useEffect(() => {
    filterProducts()
  }, [products])

  let stars = 0
  let quantity = 0

  return (
    <>
      {
        product?.stock > 0
          ? (
            <div className={`${detailsPosition} flex transition-all duration-500 decoration-slate-200 fixed w-full z-30`}>
              <ProductDetails product={product} setTempCartProduct={setTempCartProduct} tempCartProduct={tempCartProduct} popup={popup} setPopup={setPopup} style={style} liveData={liveData} />
            </div>
          )
          : ''
      }
      <ProductInfo product={product} tempCartProduct={tempCartProduct} setTempCartProduct={setTempCartProduct} setPopup={setPopup} popup={popup} design={design} stars={stars} quantity={quantity} setDetailsPosition={setDetailsPosition} style={style} liveData={liveData} />
      {
        (product.informations?.length && (product.informations[0].title !== '' || product.informations[0].description !== '' || product.informations[0].image !== ''))
          ? (
            <Information product={product} />
          )
          : ''
      }
      {
        design.productPage && design.productPage[0].reviews
          ? (
            <div className='flex p-4'>
              <div className='w-[1280px] m-auto'>
                <H2 text="Evaluaciones de clientes" />
                <span className='text-[14px] md:text-[16px]'>Valoracion media</span>
                <div className='mt-2'>
                  {
                    product?.reviews?.length
                      ? <ReviewsProduct quantity={quantity} stars={stars} reviews={product.reviews} />
                      : <NoReviewsProduct />
                  }
                </div>
              </div>
            </div>
          )
          : ''
      }
    </>
  )
}