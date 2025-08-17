import React from "react"
import { AllNavbar } from "."

export const revalidate = 3600

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchFunnels () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/funnels`)
  return res.json()
}

async function fetchPolitics () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/politics`)
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`)
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`)
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`)
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}

async function fetchIntegrations () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`)
  return res.json()
}

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  
  const designData = fetchDesign()
  
  const storeDataData = fetchStoreData()

  const funnelsData = fetchFunnels()

  const politicsData = fetchPolitics()

  const callsData = fetchCalls()

  const formsData = fetchForms()

  const paymentData = fetchPayment()

  const servicesData = fetchServices()

  const styleData = fetchStyle()

  const categoriesData = fetchCategories()

  const productsData = fetchProducts()

  const integrationsData = fetchIntegrations()

  const [design, storeData, funnels, politics, calls, forms, payment, services, style, categories, products, integrations] = await Promise.all([designData, storeDataData, funnelsData, politicsData, callsData, formsData, paymentData, servicesData, styleData, categoriesData, productsData, integrationsData])
  
  return (
    <AllNavbar design={design} storeData={storeData} funnels={funnels} politics={politics} calls={calls} forms={forms} payment={payment} services={services} style={style} categories={categories} products={products} integrations={integrations}>
      { children }
    </AllNavbar>
  )
}