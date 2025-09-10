"use client"
import { Button, H1, Input, Textarea } from "@/components/ui"
import { ISell } from "@/interfaces"
import axios from "axios"
import { useEffect, useState } from "react"
import Image from 'next/image'

export default function Page () {
  
  const [loading, setLoading] = useState(true)
  const [sell, setSell] = useState<ISell>()
  const [style, setStyle] = useState<any>()
  const [products, setProducts] = useState<any[]>()
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const getSell = async () => {
    setLoading(true)
    const currentUrl = window.location.href
    const url = new URL(currentUrl)
    const params = new URLSearchParams(url.search)
    const sell = params.get('sell')
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell}`)
    if (res.data.cart.length) {
        setSell(res.data)
        let productsCart: any[] = []
        res.data.cart.map((product: any) => productsCart.push({ _id: product._id, calification: '', title: '', review: '', name: `${res.data.firstName} ${res.data.lastName}`, email: res.data.email }))
        setProducts(productsCart)
    }
    setLoading(false)
  }

  useEffect(() => {
    getSell()
  }, [])

  const getStyle = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/style`)
    setStyle(res.data)
  }

  useEffect(() => {
    getStyle()
  }, [])

  return (
    <>
      <div className='flex px-4 py-4 md:py-8 w-full'>
        <div className='m-auto w-full max-w-[1280px] flex gap-6 flex-col'>
          <H1 text="Calificar productos" />
          {
            sell?.cart.length
              ? (
                <>
                  {
                    sell.cart.map(product => (
                      <div className="flex flex-col gap-4 p-2 border rounded-xl">
                        <p className="text-lg font-medium">{product.name}</p>
                        <Image src={product.image!} alt={`Imagen producto ${product.name}`} width={100} height={100} />
                        <div className="flex flex-col gap-2">
                          <p>Calificación</p>
                          <div className='flex gap-2 flex-wrap'>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '0.5' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '0.5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '0.5' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '0.5'
                              setProducts(oldProducts)
                            }}>0.5</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '1' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '1' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '1' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '1'
                              setProducts(oldProducts)
                            }}>1</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '1.5' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '1.5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '1.5' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '1.5'
                              setProducts(oldProducts)
                            }}>1.5</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '2' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '2' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '2' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '2'
                              setProducts(oldProducts)
                            }}>2</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '2.5' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '2.5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '2.5' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '2.5'
                              setProducts(oldProducts)
                            }}>2.5</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '3' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '0.5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '3' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '3'
                              setProducts(oldProducts)
                            }}>3</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '3.5' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '3.5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '3.5' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '3.5'
                              setProducts(oldProducts)
                            }}>3.5</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '4' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '4' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '4' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '4'
                              setProducts(oldProducts)
                            }}>4</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '4.5' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '4.5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '4.5' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '4.5'
                              setProducts(oldProducts)
                            }}>4.5</button>
                            <button className={`${products?.find(prod => prod._id === product._id).calification === '5' ? 'text-white' : ''} py-1.5 w-10 border rounded-lg`} style={{ border: products?.find(prod => prod._id === product._id).calification === '5' ? `1px solid ${style.primary}` : '', backgroundColor: products?.find(prod => prod._id === product._id).calification === '5' ? style.primary : '' }} onClick={(e: any) => {
                              e.preventDefault()
                              const oldProducts = [...products!]
                              const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                              oldProducts[indexProduct].calification = '5'
                              setProducts(oldProducts)
                            }}>5</button>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p>Titulo</p>
                          <Input inputChange={(e: any) => {
                            const oldProducts = [...products!]
                            const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                            oldProducts[indexProduct].title = e.target.value
                            setProducts(oldProducts)
                          }} value={products?.find(prod => prod._id === product._id).title} placeholder={"Titulo"} style={style} />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p>Reseña</p>
                          <Textarea change={(e: any) => {
                            const oldProducts = [...products!]
                            const indexProduct = oldProducts.findIndex(prod => prod._id === product._id)
                            oldProducts[indexProduct].review = e.target.value
                            setProducts(oldProducts)
                          }} value={products?.find(prod => prod._id === product._id).review} placeholder={"Reseña"} style={style} />
                        </div>
                      </div>
                    ))
                  }
                  <Button action={async (e: any) => {
                    e.preventDefault()
                    if (!loadingSubmit) {
                      setLoadingSubmit(true)
                      products?.map(async (product) => await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/review/${product._id}`, product))
                      setLoadingSubmit(false)
                    }
                  }} loading={loadingSubmit} style={style}>Enviar reseñas</Button>
                </>
              )
              : ''
          }
        </div>
      </div>
    </>
  )
}