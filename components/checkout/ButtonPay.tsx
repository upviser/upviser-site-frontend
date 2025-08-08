"use client"
import { ICartProduct, IPayment, IProduct, ISell, IStoreData, IVariation } from '@/interfaces'
import { calcularPaquete, offer } from '@/utils'
import axios from 'axios'
import Link from 'next/link'
import router from 'next/router'
import React, { useMemo, useRef, useState } from 'react'
import { Button, Spinner2 } from '../ui'
import Cookies from 'js-cookie'
import { CardPayment, initMercadoPago, StatusScreen } from '@mercadopago/sdk-react'
import { io } from 'socket.io-client'
import { usePathname } from 'next/navigation'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

declare const fbq: Function

export const ButtonPay = ({ sell, clientId, saveData, token, link, url, style, payment, sellRef, initializationRef, saveDataRef, setPaymentCompleted, setPaymentFailed, dest, storeData, serviceTypeCode, serviceTypeCodeRef, destRef }: { sell: ISell, clientId: string, saveData: any, token: string, link: string, url: string, style: any, payment: IPayment, sellRef: any, initializationRef: any, saveDataRef: any, setPaymentCompleted: any, setPaymentFailed: any, dest?: any, storeData?: IStoreData, serviceTypeCode?: number, serviceTypeCodeRef?: any, destRef?: any }) => {

    const [submitLoading, setSubmitLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [loadingPayment, setLoadingPayment] = useState(false)

    initMercadoPago(payment?.mercadoPago.publicKey!)

    const paymentIdRef = useRef(null)

    const pathname = usePathname()

    const transbankSubmit = async (e: any) => {
        e.preventDefault()
        if (!submitLoading) {
          setSubmitLoading(true)
          if (sellRef.current.email !== '' && sellRef.current.firstName !== '' && sellRef.current.lastName !== '' && sellRef.current.phone !== '' && sellRef.current.address !== '' && sellRef.current.number !== '' && sellRef.current.region !== '' && sellRef.current.city !== '') {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
            const dimentions = calcularPaquete(sell.cart)
            const shippingData = {
              "header": {
                  "customerCardNumber": res.data.cardNumber ? res.data.cardNumber : "18578680",
                  "countyOfOriginCoverageCode": storeData?.locations?.length ? storeData?.locations[0].countyCoverageCode : '',
                  "labelType": 2
              },
              "details": [{
                  "addresses": [{
                      "countyCoverageCode": dest.countyCoverageCode,
                      "streetName": dest.streetName,
                      "streetNumber": sell.number,
                      "supplement": sell.details,
                      "addressType": "DEST",
                      "deliveryOnCommercialOffice": false
                  }, {
                      "addressId": 0,
                      "countyCoverageCode": storeData?.locations?.length ? storeData?.locations[0].countyCoverageCode : '',
                      "streetName": storeData?.locations?.length ? storeData?.locations[0].streetName : '',
                      "streetNumber": storeData?.locations?.length ? storeData?.locations[0].streetNumber : '',
                      "supplement": storeData?.locations?.length ? storeData?.locations[0].details : '',
                      "addressType": "DEV",
                      "deliveryOnCommercialOffice": false
                  }],
                  "contacts": [{
                      "name": storeData?.nameContact,
                      "phoneNumber": storeData?.phone,
                      "mail": storeData?.email,
                      "contactType": "R"
                  }, {
                      "name": `${sell.firstName} ${sell.lastName}`,
                      "phoneNumber": sell.phone,
                      "mail": sell.email,
                      "contactType": "D"
                  }],
                  "packages": [{
                      "weight": dimentions.weight,
                      "height": dimentions.height,
                      "width": dimentions.width,
                      "length": dimentions.length,
                      "serviceDeliveryCode": serviceTypeCode,
                      "productCode": "3",
                      "deliveryReference": "TEST-EOC-17",
                      "groupReference": "GRUPO",
                      "declaredValue": sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0),
                      "declaredContent": "5"
                  }]
              }]
            }
            localStorage.setItem('shippingData', JSON.stringify(shippingData))
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, sell)
            if (clientId !== '') {
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, sell)
            }
            localStorage.setItem('sell', JSON.stringify(data))
            sell.cart.map(async (product: ICartProduct) => {
              const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}`)
              let prod: IProduct = res.data
              if (product.variation?.variation) {
                if (product.variation.subVariation) {
                  if (product.variation.subVariation2) {
                    const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation && variation.subVariation2 === product.variation.subVariation2)
                    prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                  } else {
                    const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation)
                    prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                  }
                } else {
                  const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation)
                  prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                  await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                }
              } else {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity })
              }
            })
            if (saveData) {
              Cookies.set('firstName', sell.firstName)
              Cookies.set('lastName', sell.lastName)
              Cookies.set('email', sell.email)
              if (sell.phone) {
                Cookies.set('phone', sell.phone.toString())
              }
              Cookies.set('address', sell.address)
              Cookies.set('number', sell.number)
              if (sell.details) {
                Cookies.set('details', sell.details)
              }
              Cookies.set('city', sell.city)
              Cookies.set('region', sell.region)
            }
            if (typeof fbq === 'function') {
              fbq('track', 'AddPaymentInfo', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
            }
            const form = document.getElementById('formTransbank') as HTMLFormElement
            if (form) {
              form.submit()
            }
          } else {
            setError('Debes completar todos los datos')
          }
        }
      }
    
      const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (!submitLoading) {
          setSubmitLoading(true)
          const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, sell)
          if (clientId !== '') {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, sell)
          }
          localStorage.setItem('sell', JSON.stringify(data))
          sell.cart.map(async (product) => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}`)
            let prod: IProduct = res.data
            if (product.variation?.variation) {
              if (product.variation.subVariation) {
                if (product.variation.subVariation2) {
                  const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation && variation.subVariation2 === product.variation.subVariation2)
                  prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                  await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                } else {
                  const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation)
                  prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                  await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                }
              } else {
                const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation)
                prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
              }
            } else {
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity })
            }
          })
          if (saveData) {
            Cookies.set('firstName', sell.firstName)
            Cookies.set('lastName', sell.lastName)
            Cookies.set('email', sell.email)
            if (sell.phone) {
              Cookies.set('phone', sell.phone.toString())
            }
            Cookies.set('address', sell.address)
            Cookies.set('number', sell.number)
            if (sell.details) {
              Cookies.set('details', sell.details)
            }
            Cookies.set('city', sell.city)
            Cookies.set('region', sell.region)
          }
          if (typeof fbq === 'function') {
            fbq('track', 'Purchase', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
          }
          router.push('/gracias-por-comprar')
        }
      }
    
      const mercadoSubmit = async (e: any) => {
        e.preventDefault()
        if (!submitLoading) {
          setSubmitLoading(true)
          if (sellRef.current.email !== '' && sellRef.current.firstName !== '' && sellRef.current.lastName !== '' && sellRef.current.phone !== '' && sellRef.current.address !== '' && sellRef.current.number !== '' && sellRef.current.region !== '' && sellRef.current.city !== '') {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
            const dimentions = calcularPaquete(sell.cart)
            const shippingData = {
              "header": {
                  "customerCardNumber": res.data.cardNumber ? res.data.cardNumber : "18578680",
                  "countyOfOriginCoverageCode": storeData?.locations?.length ? storeData?.locations[0].countyCoverageCode : '',
                  "labelType": 2
              },
              "details": [{
                  "addresses": [{
                      "countyCoverageCode": dest.countyCoverageCode,
                      "streetName": dest.streetName,
                      "streetNumber": sell.number,
                      "supplement": sell.details,
                      "addressType": "DEST",
                      "deliveryOnCommercialOffice": false
                  }, {
                      "addressId": 0,
                      "countyCoverageCode": storeData?.locations?.length ? storeData?.locations[0].countyCoverageCode : '',
                      "streetName": storeData?.locations?.length ? storeData?.locations[0].streetName : '',
                      "streetNumber": storeData?.locations?.length ? storeData?.locations[0].streetNumber : '',
                      "supplement": storeData?.locations?.length ? storeData?.locations[0].details : '',
                      "addressType": "DEV",
                      "deliveryOnCommercialOffice": false
                  }],
                  "contacts": [{
                      "name": storeData?.nameContact,
                      "phoneNumber": storeData?.phone,
                      "mail": storeData?.email,
                      "contactType": "R"
                  }, {
                      "name": `${sell.firstName} ${sell.lastName}`,
                      "phoneNumber": sell.phone,
                      "mail": sell.email,
                      "contactType": "D"
                  }],
                  "packages": [{
                      "weight": dimentions.weight,
                      "height": dimentions.height,
                      "width": dimentions.width,
                      "length": dimentions.length,
                      "serviceDeliveryCode": serviceTypeCode,
                      "productCode": "3",
                      "deliveryReference": "TEST-EOC-17",
                      "groupReference": "GRUPO",
                      "declaredValue": sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0),
                      "declaredContent": "5"
                  }]
              }]
            }
            localStorage.setItem('shippingData', JSON.stringify(shippingData))
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, sell)
            if (clientId !== '') {
              await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/clients/${clientId}`, sell)
            }
            localStorage.setItem('sell', JSON.stringify(data))
            sell.cart.map(async (product) => {
              const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}`)
              let prod: IProduct = res.data
              if (product.variation?.variation) {
                if (product.variation.subVariation) {
                  if (product.variation.subVariation2) {
                    const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation && variation.subVariation2 === product.variation.subVariation2)
                    prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                  } else {
                    const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation)
                    prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                    await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                  }
                } else {
                  const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation)
                  prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                  await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                }
              } else {
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity })
              }
            })
            if (saveData) {
              Cookies.set('firstName', sell.firstName)
              Cookies.set('lastName', sell.lastName)
              Cookies.set('email', sell.email)
              if (sell.phone) {
                Cookies.set('phone', sell.phone.toString())
              }
              Cookies.set('address', sell.address)
              Cookies.set('number', sell.number)
              if (sell.details) {
                Cookies.set('details', sell.details)
              }
              Cookies.set('city', sell.city)
              Cookies.set('region', sell.region)
            }
            if (typeof fbq === 'function') {
              fbq('track', 'AddPaymentInfo', {contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping)})
            }
            window.location.href = link
          } else {
            setError('Debes completar todos los datos')
          }
        }
      }

  const onSubmit = async (formData: any) => {
      // callback llamado al hacer clic en el botón enviar datos
      if (!loading) {
        setLoading(true)
        setError('')
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (sellRef.current.email !== '' && sellRef.current.firstName !== '' && sellRef.current.lastName !== '' && sellRef.current.phone !== '' && sellRef.current.address !== '' && sellRef.current.number !== '' && sellRef.current.region !== '' && sellRef.current.city !== '') {
          if (emailRegex.test(sellRef.current.email)) {
            return new Promise<void>((resolve, reject) => {
              fetch(`${process.env.NEXT_PUBLIC_API_URL}/process_payment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              })
                .then((response) => response.json())
                .then(async (response) => {
                  console.log(response)
                  paymentIdRef.current = response.id
                  let currentSell = sellRef.current
                  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
                  const dimentions = calcularPaquete(sell.cart)
                  const shippingData = {
                    "header": {
                        "customerCardNumber": res.data.cardNumber ? res.data.cardNumber : "18578680",
                        "countyOfOriginCoverageCode": storeData?.locations?.length ? storeData?.locations[0].countyCoverageCode : '',
                        "labelType": 2
                    },
                    "details": [{
                        "addresses": [{
                            "countyCoverageCode": destRef.countyCoverageCode,
                            "streetName": destRef.streetName,
                            "streetNumber": sellRef.current.number,
                            "supplement": sellRef.current.details,
                            "addressType": "DEST",
                            "deliveryOnCommercialOffice": false
                        }, {
                            "addressId": 0,
                            "countyCoverageCode": storeData?.locations?.length ? storeData?.locations[0].countyCoverageCode : '',
                            "streetName": storeData?.locations?.length ? storeData?.locations[0].streetName : '',
                            "streetNumber": storeData?.locations?.length ? storeData?.locations[0].streetNumber : '',
                            "supplement": storeData?.locations?.length ? storeData?.locations[0].details : '',
                            "addressType": "DEV",
                            "deliveryOnCommercialOffice": false
                        }],
                        "contacts": [{
                            "name": storeData?.nameContact,
                            "phoneNumber": storeData?.phone,
                            "mail": storeData?.email,
                            "contactType": "R"
                        }, {
                            "name": `${sellRef.current.firstName} ${sellRef.current.lastName}`,
                            "phoneNumber": sellRef.current.phone,
                            "mail": sellRef.current.email,
                            "contactType": "D"
                        }],
                        "packages": [{
                            "weight": dimentions.weight,
                            "height": dimentions.height,
                            "width": dimentions.width,
                            "length": dimentions.length,
                            "serviceDeliveryCode": serviceTypeCodeRef.current,
                            "productCode": "3",
                            "deliveryReference": "TEST-EOC-17",
                            "groupReference": "GRUPO",
                            "declaredValue": sellRef.current.cart.reduce((bef: any, curr: any) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0),
                            "declaredContent": "5"
                        }]
                    }]
                  }
                  const request = await axios.post('http://testservices.wschilexpress.com/transport-orders/api/v1.0/transport-orders', shippingData, {
                    headers: {
                      'Content-Type': 'application/json',
                      'Cache-Control': 'no-cache',
                      'Ocp-Apim-Subscription-Key': res.data.enviosKey
                    }
                  })
                  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sells`, { ...sellRef.current, state: 'Pago realizado', shippingLabel: request.data.data.detail[0].label.labelData })
                  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...currentSell, tags: sellRef.current.subscription ? ['Clientes', 'Suscriptores'] : ['Clientes'] })
                  sellRef.current.cart.map(async (product: any) => {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}`)
                    let prod: IProduct = res.data
                    if (product.variation?.variation) {
                      if (product.variation.subVariation) {
                        if (product.variation.subVariation2) {
                          const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation && variation.subVariation2 === product.variation.subVariation2)
                          prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                        } else {
                          const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation && variation.subVariation === product.variation.subVariation)
                          prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                        }
                      } else {
                        const variationIndex = prod.variations!.variations.findIndex((variation: IVariation) => variation.variation === product.variation?.variation)
                        prod.variations!.variations[variationIndex].stock = prod.variations!.variations[variationIndex].stock - product.quantity!
                        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity, variations: prod.variations })
                      }
                    } else {
                      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`, { stock: prod.stock - product.quantity })
                    }
                  })
                  const newEventId = new Date().getTime().toString()
                  if (typeof fbq === 'function') {
                    fbq('track', 'Purchase', {first_name: currentSell.current.firstName, last_name: currentSell.current.lastName, email: currentSell.current.email, phone: currentSell.current.phone && currentSell.current.phone !== '' ? `56${currentSell.current.phone}` : undefined, contents: sell.cart, currency: "CLP", value: sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping), fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}`}, { eventID: newEventId })
                  }
                  socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: 'Venta de productos de la tienda', url: '/pagos', view: false })
                  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: 'Venta de productos de la tienda', url: '/pagos', view: false })
                  setLoading(false)
                  setPaymentCompleted(true)
                  if (saveDataRef.current) {
                    Cookies.set('firstName', sell.firstName)
                    Cookies.set('lastName', sell.lastName)
                    Cookies.set('email', sell.email)
                    if (sell.phone) {
                      Cookies.set('phone', sell.phone.toString())
                    }
                    Cookies.set('address', sell.address)
                    Cookies.set('number', sell.number)
                    if (sell.details) {
                      Cookies.set('details', sell.details)
                    }
                    Cookies.set('city', sell.city)
                    Cookies.set('region', sell.region)
                  }
                  resolve();
                })
                .catch(async (error) => {
                  console.log(error)
                  setPaymentFailed(true)
                  reject();
                });
            })
          } else {
            setError('Has ingresado un correo invalido')
          }
        } else {
          setError('Debes llenar todos los datos')
        }
      }
    };
     
    const onError = async (error: any) => {
      // callback llamado para todos los casos de error de Brick
      console.log(error);
    };
     
    const onReady = async () => {
      setLoadingPayment(false)
    };
  
    const cardPaymentMemo = useMemo(() => {
      if (typeof initializationRef.current.amount === 'number' && initializationRef.current.amount > 0) {
        return (
          <CardPayment
            initialization={initializationRef.current}
            onSubmit={onSubmit}
            onReady={onReady}
            onError={onError}
            customization={{
              visual: {
                style: {
                  theme: 'flat',
                  customVariables: {
                    baseColor: style.primary
                  }
                }
              }
            }}
          />
        );
      }
      return null; // No renderizar CardPayment si la condición no se cumple
    }, [initializationRef.current]);

  return (
    <>
      {
        sell.pay === 'MercadoPago'
          ? (
            <>
              {cardPaymentMemo}
            </>
          )
          : ''
      }
      {
        error !== ''
          ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
          : ''
      }
      <div className='flex gap-2 justify-between mt-auto mb-auto'>
        <div className='mt-auto mb-auto'><Link href='/carrito'><span className='flex gap-2 text-sm'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" className="mt-auto mb-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>Regresar al carrito</span></Link></div>
        {
          sell.pay === ''
            ? <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 cursor-not-allowed' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '', color: style?.button, backgroundColor: `${style?.primary}99` }}>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
            : sell.pay === 'WebPay Plus'
              ? (
                <form action={url} method="POST" id='formTransbank' style={{ paddingBottom: !submitLoading ? '7px' : '' }}>
                  <input type="hidden" name="token_ws" value={token} />
                  <Button action={transbankSubmit} style={style} loading={submitLoading} width='112'>Pagar</Button>
                </form>
              )
              : sell.pay === 'MercadoPagoPro'
                ? link !== ''
                  ? <Button action={mercadoSubmit} style={style} loading={submitLoading} width='112'>Pagar</Button>
                  : <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 cursor-not-allowed' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '', color: style?.button, backgroundColor: `${style?.primary}99` }}>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
                : sell.pay === 'MercadoPago'
                  ? ''
                  : <button onClick={(e: any) => e.preventDefault()} className='w-28 h-10 cursor-not-allowed' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '', color: style?.button, backgroundColor: `${style?.primary}99` }}>{submitLoading ? <Spinner2 /> : 'Pagar'}</button>
        }
      </div>
    </>
  )
}
