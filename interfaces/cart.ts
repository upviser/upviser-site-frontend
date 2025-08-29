import { IQuantityOffer, IVariation } from "."

export interface ICartProduct {
  _id?: string
  name: string
  image?: string
  price: number
  beforePrice?: number
  variation?: IVariation
  slug: string
  quantity: number
  stock?: number
  category: { category: string, slug: string }
  quantityOffers?: IQuantityOffer[]
  sku?: string
  dimentions: { weight: string, height: string, width: string, length: string  }
  idProduct?: string
}