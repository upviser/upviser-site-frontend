import CartContext from '@/context/cart/CartContext'
import { ICartProduct, IProduct } from '@/interfaces'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import React, { useContext } from 'react'

export const Quantity = ({ product, style }: { product: ICartProduct, style: any }) => {

  const { cart, setCart } = useContext(CartContext)

  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string, cart: [] }

  return (
    <>
      {
        cart?.length
          ? (
            <div className='flex gap-4'>
              <div className='flex border w-fit h-fit mt-auto mb-auto' style={{ border: `1px solid ${style?.primary}`, borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
                {
                  product.quantity > 1
                    ? <button className='pt-1 pb-1 pl-3 pr-2 text-sm' style={{ color: style?.primary }} onClick={async () => {
                      const index = cart?.findIndex((item: ICartProduct) => item === product)
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
                    : <button className='pt-1 pb-1 pl-2 pr-3 cursor-not-allowed' style={{ color: `${style?.primary}99` }}>+</button>
                }
              </div>
              <button onClick={async () => {
                const cartProduct: ICartProduct[] = JSON.parse(localStorage.getItem('cart')!)
                const productSelect = cartProduct.filter((item: ICartProduct) => item.name === product.name)
                if (productSelect.length >= 2) {
                  let products
                  products = cartProduct.filter(item => item.variation?.variation !== product.variation?.variation || item.variation?.subVariation !== product.variation?.subVariation || item.variation?.subVariation2 !== product.variation?.subVariation2)
                  if (!products.find(prod => prod._id === product._id)) {
                    products = products.filter(prod => prod.idProduct !== product._id)
                  }
                  localStorage.setItem('cart', JSON.stringify(products))
                  setCart(products)
                  if (status === 'authenticated') {
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/account/${user._id}`, { cart: JSON.parse(localStorage.getItem('cart')!) })
                  }
                } else {
                  let products
                  products = cartProduct.filter(item => item.name !== product.name)
                  if (!products.find(prod => prod._id === product._id)) {
                    products = products.filter(prod => prod.idProduct !== product._id)
                  }
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
          )
          : ''
      }
    </> 
  )
}
