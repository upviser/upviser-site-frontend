"use client"
import CartContext from '@/context/cart/CartContext'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect, useContext } from 'react'
import { ProductList, ShippingCart } from '../../components/products'
import { Design, IProduct, IStoreData } from '../../interfaces'
import { NumberFormat, offer } from '../../utils'
import Image from 'next/image'
import { Button, H1, LinkButton } from '../ui'
import { Quantity } from '.'

const CartPage = ({ design, products, style, storeData }: { design: Design, products: IProduct[], style: any, storeData?: IStoreData }) => {

  const {cart} = useContext(CartContext)

  const [shippingCost, setShippingCost] = useState(0)
  const [productsFiltered, setProductsFiltered] = useState<IProduct[]>([])

  const filterProducts = () => {
    if (products.length) {
      setProductsFiltered(products)
    }
  }

  useEffect(() => {
    filterProducts()
  }, [products])

  return (
    <>
      <Head>
        <title>Carrito</title>
      </Head>
      <div className='p-4 flex' style={{ backgroundColor: design.cartPage.bgColor, color: design.cartPage.textColor }}>
        <div className='m-auto w-[1280px] flex flex-col gap-4'>
          <h1 className='text-2xl sm:text-4xl font-medium'>Carrito</h1>
          <div className='flex gap-4 xl:gap-8 flex-col xl:flex-row'>
            <div className='w-full xl:w-7/12'>
              {
                cart?.length
                  ? cart?.map((product) => (
                    <div className='flex gap-4 mb-2 justify-between' key={product._id}>
                      <div className='flex gap-2'>
                        <Link href={`/tienda/${product.category.slug}/${product.slug}`}>
                          <Image className='w-28 h-auto 450:w-32' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} src={product.image!} alt={product.name} width={128} height={128} />
                        </Link>
                        <div className='mt-auto mb-auto'>
                          <Link href={`/productos/${product.slug}`}>
                            <p>{product.name}</p>
                          </Link>
                          <div className='flex gap-2'>
                            {
                              product.quantityOffers && product.quantity > 1
                                ? <span className='font-medium'>${NumberFormat(offer(product))}</span>
                                : <span className='font-medium'>${NumberFormat(product.price * product.quantity)}</span>
                            }
                            {
                              product.beforePrice
                                ? <span className='text-sm line-through'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                                : ''
                            }
                          </div>
                          {
                            product.variation
                              ? <span>{product.variation.variation}{product.variation.subVariation ? ` / ${product.variation.subVariation}` : ''}{product.variation.subVariation2 ? ` / ${product.variation.subVariation2}` : ''}</span>
                              : ''
                          }
                        </div>
                      </div>
                      <Quantity product={product} style={style} />
                    </div>
                  ))
                  : (
                    <div>
                      <p className='mb-4'>No tienes productos agregados al carrito</p>
                      <Link href='/tienda'><Button style={style}>Ir a la tienda</Button></Link>
                    </div>
                  )
              }
            </div>
            {
              cart?.length
                ? (
                  <div className='w-full xl:w-5/12'>
                    <div className='p-6 450:p-6' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', backgroundColor: design.cartPage.detailsColor }}>
                      <div className='mb-2 pb-2 border-b'>
                        <div className='mb-4 border-b pb-4'>
                          <ShippingCart setShippingCost={setShippingCost} style={style} storeData={storeData} />
                        </div>
                        <div className='flex gap-2 justify-between mb-1'>
                          <span className='text-[14px]'>Subtotal</span>
                          {
                            cart?.length
                              ? <span className='text-[14px]'>${NumberFormat(cart.reduce((bef, curr) => curr.quantityOffers ? bef + offer(curr) : bef + curr.price * curr.quantity, 0))}</span>
                              : ''
                          }
                        </div>
                        <div className='flex gap-2 justify-between'>
                          <span className='text-[14px]'>Envío</span>
                          <span className='text-[14px]'>${NumberFormat(shippingCost)}</span>
                        </div>
                      </div>
                      <div className='flex gap-2 justify-between'>
                        <span className='font-medium'>Total</span>
                        {
                          cart?.length
                            ? <span className='font-medium'>${NumberFormat(cart.reduce((bef, curr) => curr.quantityOffers ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(shippingCost))}</span>
                            : ''
                        }
                      </div>
                      <div className='mt-3 ml-auto w-full flex'>
                        <LinkButton config='w-full text-[16px]' url={'/finalizar-compra'} style={style}>Finalizar compra</LinkButton>
                      </div>
                    </div>
                  </div>
                )
                : ''
            }
          </div>
        </div>
      </div>
      {
        productsFiltered.length
            ? <ProductList products={ productsFiltered } title='Productos recomendados' style={style} />
            : ''
      }
    </>
  )
}

export default CartPage