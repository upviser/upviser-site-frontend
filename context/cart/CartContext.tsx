import { createContext } from 'react'
import { ICartProduct } from '../../interfaces'

interface ContextProps {
  cart: ICartProduct[] | undefined
  setCart: any
  cartView: any
  setCartView: any
  cartPosition: any
  setCartPosition: any
  cartPc: any
  setCartPc: any
}

const CartContext = createContext({} as ContextProps)

export default CartContext