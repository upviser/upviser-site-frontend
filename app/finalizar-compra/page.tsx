import { CheckoutPage } from "@/components/checkout"
import { IStoreData } from "@/interfaces"

export const revalidate = 3600

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchChilexpress () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`)
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
  return res.json()
}

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

export default async function Page () {

  const storeData: IStoreData = await fetchStoreData()

  const chilexpress = await fetchChilexpress()

  const style = await fetchStyle()

  const payment = await fetchPayment()

  const design = await fetchDesign()

  return (
    <CheckoutPage storeData={storeData} chilexpress={chilexpress} style={style} payment={payment} design={design} />
  )
}