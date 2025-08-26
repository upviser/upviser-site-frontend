import Link from 'next/link'
import React, { useContext } from 'react'
import { ICartProduct, ICategory } from '../../interfaces'
import { NumberFormat, offer } from '../../utils'
import CartContext from '../../context/cart/CartContext'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Button, H3, P } from '../ui'

interface Props {
  setCartView: any
  setCartPc?: any
  setCartPosition: any
  cartRef: any
  categories?: ICategory[]
  style: any
}

export const NavbarCart: React.FC<Props> = ({ setCartView, setCartPc, setCartPosition, cartRef, categories, style }) => {

  const {cart, setCart} = useContext(CartContext)

  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string, cart: ICartProduct[] }

  return (
    <div ref={cartRef} onMouseEnter={() => setCartPc(false)} onMouseLeave={() => setCartPc(true)} onMouseMove={() => setCartPc(true)} className={`ml-auto flex flex-col gap-3 p-4 shadow-md bg-white z-40 w-[360px]`} style={{ height: 'calc(100vh - 49px)' }}>
      <H3 config='border-b text-center pb-2 font-medium' text='Carrito' />
      {
        cart?.length
          ? <>
            <div className='overflow-y-auto'>
            {
              cart.map((product: ICartProduct) => (
                <div key={product.slug} className='flex gap-1 justify-between mb-2'>
                  <div className='flex gap-2'>
                    <Link href={`/tienda/${product.category.slug}/${product.slug}`} onClick={() => {
                      setCartPosition('-mr-96')
                      setTimeout(() => {
                        setCartView('hidden')
                      }, 500)
                    }}>
                      <Image src={product.image!} alt={product.name} width={96} height={96} className='w-24 h-24 mt-auto mb-auto' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} />
                    </Link>
                    <div className='mt-auto mb-auto'>
                      <Link href={`/tienda/${product.category.slug}/${product.slug}`} onClick={() => {
                        setCartPosition('-mr-96')
                        setTimeout(() => {
                          setCartView('hidden')
                        }, 500)
                      }}><p className='text-sm lg:text-[16px] text-[#1B1B1B] font-medium dark:text-neutral-100'>{product.name}</p></Link>
                      <div className='flex gap-1 mb-1'>
                        {
                          product.quantityOffers && product.quantity > 1
                            ? <span className='text-sm lg:text-[16px]'>${NumberFormat(offer(product))}</span>
                            : <span className='text-sm lg:text-[16px]'>${NumberFormat(product.price * product.quantity)}</span>
                        }
                        {
                          product.beforePrice
                            ? <span className='text-sm line-through text-[#444444] dark:text-neutral-400'>${NumberFormat(product.beforePrice * product.quantity)}</span>
                            : ''
                        }
                      </div>
                      <div className='flex border w-fit' style={{ border: `1px solid ${style?.primary}`, borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
                        {
                          product.quantity > 1
                            ? <button className='pt-1 pb-1 pl-3 pr-2 text-sm' style={{ color: style?.primary }} onClick={async () => {
                              const index = cart.findIndex((item: ICartProduct) => item === product)
                              const productEdit: ICartProduct = cart[index]
                              const updateProduct: ICartProduct = { ...productEdit, quantity: productEdit.quantity - 1 }
                              cart[index] = updateProduct
                              const updateCart = JSON.stringify(cart)
                              localStorage.setItem('cart', updateCart)
                              setCart(JSON.parse(localStorage.getItem('cart')!))
                              if (status === 'authenticated') {
                                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                              }
                            }}>-</button>
                            : <button className='pt-1 pb-1 pl-3 pr-2 cursor-not-allowed text-sm' style={{ color: `${style?.primary}99` }}>-</button>
                        }
                        <span className='m-auto w-4 text-center text-sm' style={{ color: style?.primary }}>{product.quantity}</span>
                        {
                          product.quantity < product.stock!
                            ? <button className='pt-1 pb-1 pl-2 pr-3 text-sm' style={{ color: style?.primary }} onClick={async () => {
                              const index = cart.findIndex((item: ICartProduct) => item === product)
                              const productEdit: ICartProduct = cart[index]
                              const updateProduct: ICartProduct = { ...productEdit, quantity: productEdit.quantity + 1 }
                              cart[index] = updateProduct
                              const updateCart = JSON.stringify(cart)
                              localStorage.setItem('cart', updateCart)
                              setCart(JSON.parse(localStorage.getItem('cart')!))
                              if (status === 'authenticated') {
                                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                              }
                            }}>+</button>
                            : <button className='pt-1 pb-1 pl-2 pr-3 cursor-not-allowed text-sm' style={{ color: `${style?.primary}99` }}>+</button>
                        }
                      </div>
                    </div>
                  </div>
                  <button onClick={async () => {
                    const cartProduct: ICartProduct[] = JSON.parse(localStorage.getItem('cart')!)
                    const productSelect = cartProduct.filter((item: ICartProduct) => item.name === product.name)
                    if (productSelect.length >= 2) {
                      const products = cartProduct.filter(item => item.variation?.variation !== product.variation?.variation || item.variation?.subVariation !== product.variation?.subVariation || item.variation?.subVariation2 !== product.variation?.subVariation2)
                      localStorage.setItem('cart', JSON.stringify(products))
                      setCart(products)
                      if (status === 'authenticated') {
                        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                      }
                    } else {
                      const products = cartProduct.filter(item => item.name !== product.name)
                      localStorage.setItem('cart', JSON.stringify(products))
                      setCart(products)
                      if (status === 'authenticated') {
                        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                      }
                    }
                  }}>
                    <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                      <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              ))
            }
            </div>
            <div className='mt-4'>
              <Link href='/finalizar-compra'><Button action={() => {
                setCartPosition('-mr-96')
                setTimeout(() => {
                  setCartView('hidden')
                }, 500)
              }} config='w-full' style={style}>Finalizar compra</Button></Link>
              <Link href='/carrito' onClick={() => {
                setCartPosition('-mr-96')
                setTimeout(() => {
                  setCartView('hidden')
                }, 500)
              }}><button className='w-full mt-4 underline text-[#444444] dark:text-neutral-400'>Ir al carrito</button></Link>
            </div>
          </>
          : <>
            <p>No tienes productos añadidos al carrito</p>
            {
              categories?.map(category => (
                <Link key={category._id} onClick={() => {
                  setCartPosition('-mr-96')
                  setTimeout(() => {
                    setCartView('hidden')
                  }, 500)
                }} className='border p-1.5 text-center transition-colors duration-200 text-sm lg:text-[16px]' href={`/tienda/${category.slug}`} style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>{category.category}</Link>
              ))
            }
            <Link href='/tienda'><Button action={() => {
              setCartPosition('-mr-96')
              setTimeout(() => {
                setCartView('hidden')
              }, 500)
            }} style={style} config='w-full'>Ir a la tienda</Button></Link>
          </>
      }
    </div>
  )
}
