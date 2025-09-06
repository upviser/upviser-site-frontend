import CartPage from "@/components/cart/CartPage"
import { Metadata } from "next"

export const revalidate = 60

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}
  
async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

export const metadata: Metadata = {
  title: 'Carrito',
  twitter: {
    card: 'summary_large_image'
  }
}

export default async function Page () {

  const products = await fetchProducts()
  
  const design = await fetchDesign()

  const style = await fetchStyle()

  const storeData = await fetchStoreData()

  return (
    <CartPage design={design} products={products} style={style} storeData={storeData} />
  )
}