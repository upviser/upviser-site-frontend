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

async function fetchIntegrations () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`)
  return res.json()
}

export default async function Page () {

  const storeDataData = fetchStoreData()

  const chilexpressData = fetchChilexpress()

  const styleData = fetchStyle()

  const paymentData = fetchPayment()

  const designData = fetchDesign()

  const integrationsData = fetchIntegrations()

  const [storeData, chilexpress, style, payment, design, integrations] = await Promise.all([storeDataData, chilexpressData, styleData, paymentData, designData, integrationsData])

  return (
    <CheckoutPage storeData={storeData} chilexpress={chilexpress} style={style} payment={payment} design={design} integrations={integrations} />
  )
}