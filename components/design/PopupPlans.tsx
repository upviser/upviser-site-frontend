"use client"
import { IClient, IDesign, IForm, IPayment, IPlan, IService } from '@/interfaces';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, H3, Input, Select, Spinner } from '../ui';
import { usePathname } from 'next/navigation';
import { CardNumber, CardPayment, createCardToken, ExpirationDate, initMercadoPago, SecurityCode, StatusScreen } from '@mercadopago/sdk-react';
import axios from 'axios';
import Cookies from 'js-cookie'
import { io } from 'socket.io-client'
import { NumberFormat } from '@/utils';

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
    transports: ['websocket']
  })

interface Props {
    popup: any
    setPopup: any
    plan?: IPlan
    services: IService[]
    payment: IPayment
    content: IDesign
    step?: string
    style?: any
    typePrice?: string
    forms?: IForm[]
}

declare global {
    interface Window {
      MercadoPago: any;
      cardPaymentBrickController: any;
    }
}

declare const fbq: Function

const MemoCardNumber = React.memo(CardNumber);
const MemoExpirationDate = React.memo(ExpirationDate);
const MemoSecurityCode = React.memo(SecurityCode);

export const PopupPlans: React.FC<Props> = ({ popup, setPopup, plan, services, payment, content, step, style, typePrice, forms }) => {

  const [client, setClient] = useState<IClient>({ email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [service, setService] = useState(services.find(service => service._id === content.service?.service))
  const [initialization, setInitialization] = useState({ amount: Number(service?.typePrice === '2 pagos' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 / 2 : Number(plan?.price) / 2 : service?.typePrice === 'Pago unico' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : typePrice === 'Mensual' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice) })
  const [loadingPayment, setLoadingPayment] = useState(true)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [formCompleted, setFormCompleted] = useState(false)
  const [idService, setIdService] = useState('')
  const [pay, setPay] = useState('')
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [transbankLoading, setTransbankLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [link, setLink] = useState('')
  const [loadingSuscribe, setLoadingSuscribe] = useState(false)
  const [cardholderName, setCardholderName] = useState('')
  const [identificationType, setIdentificationType] = useState('')
  const [identificationNumber, setIdentificationNumber] = useState('')

  const clientRef = useRef(client)
  const initializationRef = useRef({ amount: Number(service?.typePrice === '2 pagos' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 / 2 : Number(plan?.price) / 2 : service?.typePrice === 'Pago unico' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : typePrice === 'Mensual' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice) })
  const paymentIdRef = useRef(null)
  const popupRef = useRef<any>(null)

  const pathname = usePathname()

  initMercadoPago(payment?.mercadoPago.publicKey!)

  useEffect(() => {
    setInitialization({ amount: Number(service?.typePrice === '2 pagos' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 / 2 : Number(plan?.price) / 2 : service?.typePrice === 'Pago unico' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : typePrice === 'Mensual' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice) })
    initializationRef.current = { amount: Number(service?.typePrice === '2 pagos' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 / 2 : Number(plan?.price) / 2 : service?.typePrice === 'Pago unico' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : typePrice === 'Mensual' ? service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : service?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice) }
  }, [plan])

  const viewCheckout = async () => {
    if (content.info.video === 'Realizar pago') {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      if (!res.data.message) {
        const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? plan?.price : typePrice === 'Anual' ? plan?.anualPrice : plan?.price }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? plan?.price : typePrice === 'Anual' ? plan?.anualPrice : plan?.price }], funnels: [{ funnel: respo.data._id, step: stepFind._id }] }
        const newEventId = new Date().getTime().toString()
        if (pathname !== '/') {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, funnel: respo.data._id, step: stepFind?._id, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
          fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
        } else {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice, eventId: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
          fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
        }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? plan?.price : typePrice === 'Anual' ? plan?.anualPrice : plan?.price }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? plan?.price : typePrice === 'Anual' ? plan?.anualPrice : plan?.price }] }
        const newEventId = new Date().getTime().toString()
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, { page: pathname, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice, event_id: newEventId, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp') })
        fbq('track', 'InitiateCheckout', { content_name: service?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: service?._id, item_price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.price) / 100 * 119 : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? Number(plan?.anualPrice) / 100 * 119 : plan?.anualPrice, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      }
    } else {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      if (!res.data.message) {
        const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.price) / 100 * 119).toString() : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.anualPrice) / 100 * 119).toString() : plan?.anualPrice }], funnels: [{ funnel: respo.data._id, step: stepFind?._id }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.price) / 100 * 119).toString() : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.anualPrice) / 100 * 119).toString() : plan?.anualPrice }], funnels: [{ funnel: respo.data._id, step: stepFind?._id }] }
      } else {
        setClient({ ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.price) / 100 * 119).toString() : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.anualPrice) / 100 * 119).toString() : plan?.anualPrice }] })
        clientRef.current = { ...client, tags: services?.find(servi => servi._id === content.service?.service)?.tags?.length ? [...(services.find(servi => servi._id === content.service?.service)?.tags || []), 'clientes'] : ['clientes'], services: [{ service: content.service?.service, plan: plan?._id, step: service?.steps.find(step => `/${step.slug}` === pathname) ? service?.steps.find(step => `/${step.slug}` === pathname)?._id : '', price: typePrice === 'Mensual' ? services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.price) / 100 * 119).toString() : plan?.price : services.find(service => service._id && content.service?.service)?.typePay === 'Hay que agregarle el IVA al precio' ? (Number(plan?.anualPrice) / 100 * 119).toString() : plan?.anualPrice }] }
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof fbq === 'function' && plan?._id) {
        viewCheckout()
        clearInterval(interval)
      }
    }, 100)
  
    return () => clearInterval(interval)
  }, [plan])
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node) && popup.view === 'flex') {
          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
          setTimeout(() => {
            setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
          }, 200)
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [popup, setPopup])

    const onSubmit = async (formData: any) => {
        // callback llamado al hacer clic en el botón enviar datos
        if (!loading) {
          setLoading(true)
          setError('')
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
            if (emailRegex.test(clientRef.current.email)) {
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
                    let currentClient = clientRef.current
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                    if (res.data.email) {
                      currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago realizado' : 'Pago realizado'
                    } else {
                      currentClient.services![0].payStatus = 'Pago realizado'
                    }
                    const service = services?.find(service => service._id === content.service?.service)
                    currentClient.services![0].step = service?.steps[service?.steps.find(step => step._id === currentClient.services![0].step) ? service?.steps.findIndex(step => step._id === currentClient.services![0].step) + 1 : 0]._id
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                    const price = Number(initializationRef.current.amount)
                    const newEventId = new Date().getTime().toString()
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: price, state: 'Pago realizado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined })
                    fbq('track', 'Purchase', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                    socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
                    setLoading(false)
                    setPaymentCompleted(true)
                    resolve();
                  })
                  .catch(async (error) => {
                    let currentClient = clientRef.current
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                    if (res.data.email) {
                      currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago no realizado' : 'Pago no realizado'
                    } else {
                      currentClient.services![0].payStatus = 'Pago no realizado'
                    }
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
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
        // Verificar que initialization.amount sea un número y mayor que 0
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
      }, [initializationRef.current.amount]);

    const mercadoSubmit = async (e: any) => {
      e.preventDefault()
      if (!submitLoading) {
        setSubmitLoading(true)
        setError('')
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
          if (emailRegex.test(clientRef.current.email)) {
            let currentClient = clientRef.current
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
            let client
            if (res.data.email) {
              currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago iniciado' : 'Pago iniciado'
              client = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
              localStorage.setItem('service', JSON.stringify(currentClient.services![0]))
            } else {
              currentClient.services![0].payStatus = 'Pago iniciado'
              client = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...currentClient, services: [{ ...currentClient.services![0], payStatus: 'Pago iniciado' }] })
              localStorage.setItem('service', JSON.stringify({ ...currentClient.services![0], payStatus: 'Pago iniciado' }))
            }
            const service = services?.find(service => service._id === content.service?.service)
            const price = Number(initializationRef.current.amount)
            const newEventId = new Date().getTime().toString()
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: service?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: plan?._id, price: price, state: currentClient.services![0].payStatus, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'WebPay Plus' })
            fbq('track', 'AddPaymentInfo', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
            localStorage.setItem('pay', JSON.stringify(response.data))
            localStorage.setItem('service2', JSON.stringify(service))
            window.location.href = link
          } else {
            setError('Debes ingresar un correo valido')
          }
        } else {
          setError('Debes llenar todos los datos')
        }
      }
    }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!loadingSuscribe) {
      setLoadingSuscribe(true)
      setError('')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
        if (emailRegex.test(clientRef.current.email)) {
          const cardToken = await createCardToken({
            cardholderName: cardholderName,
            identificationType: identificationType,
            identificationNumber: identificationNumber
          })
          console.log(cardToken)
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/suscribe`, { cardToken: cardToken?.id, price: initializationRef.current.amount, frequency: typePrice === 'Mensual' ? 'months' : 'years', email: client.email })
          console.log(res.data)
          if (res.data.status === 'Processed') {
            let currentClient = clientRef.current
            currentClient.services![0].payStatus = 'Pago realizado'
            const service = services?.find(service => service._id === content.service?.service)
            currentClient.services![0].step = service?.steps[service?.steps.find(step => step._id === currentClient.services![0].step) ? service?.steps.findIndex(step => step._id === currentClient.services![0].step) + 1 : 0]._id
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
            const price = Number(initializationRef.current.amount)
            const newEventId = new Date().getTime().toString()
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: content.service?.plan, price: price, state: 'Pago realizado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined })
            fbq('track', 'Purchase', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
            socket.emit('newNotification', { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nuevo pago recibido:', description: services?.find(servi => servi._id === content.service?.service)?.name, url: '/pagos', view: false })
            setLoading(false)
            setPaymentCompleted(true)
          } else {
            let currentClient = clientRef.current
            currentClient.services![0].payStatus = 'Pago no realizado'
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
          }
        } else {
          setError('Debes ingresar un correo valido')
        }
      } else {
        setError('Debes llenar todos los datos')
      }
    }
  }

  return (
    <div className={`${popup.view} ${popup.opacity} transition-opacity duration-200 w-full h-full top-0 fixed bg-black/30 flex z-50 px-4`}>
      <div ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} max-w-[600px] transition-transform duration-200 w-full rounded-2xl max-h-[600px] overflow-y-auto bg-white m-auto flex flex-col`} style={{ boxShadow: '0px 3px 20px 3px #11111120' }}>
        {
          ((service?.typePrice === 'Suscripción' || service?.typePrice === 'Pago variable con suscripción') && (payment?.suscription.active && payment.suscription.accessToken !== '' && payment.suscription.publicKey !== '')) || ((payment?.transbank.active && payment.transbank.commerceCode !== '' && payment.transbank.apiKey !== '') || (payment?.mercadoPago.active && payment.mercadoPago.accessToken !== '' && payment.mercadoPago.publicKey !== '') || (payment?.mercadoPagoPro.active && payment.mercadoPagoPro.accessToken !== '' && payment.mercadoPagoPro.publicKey !== ''))
            ? (
              <>
                <div className='flex flex-col gap-4 sticky top-0 bg-white border-b z-50 p-6 md:p-8'>
                  <p className='text-center text-2xl font-medium'>{plan?.name}</p>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-center text-lg'>Neto: ${NumberFormat(initialization.amount / 119 * 100)}</p>
                      <p className='text-center text-lg'>IVA: ${NumberFormat(initialization.amount / 119 * 19)}</p>
                    </div>
                    <div className='flex gap-4 w-fit m-auto'>
                      <p className='text-center text-3xl font-semibold'>${NumberFormat(initialization.amount)}</p>
                      <p className='my-auto'>/ {typePrice === 'Mensual' ? 'Mes' : 'Anual'}</p>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  {
                    paymentCompleted
                      ? (
                        <div className='flex flex-col gap-6 py-20'>
                          <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                          <p className='text-center mx-auto text-3xl font-medium'>Pago realizado con exito</p>
                          <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
                        </div>
                      )
                      : formCompleted
                        ? (
                          <div className='flex flex-col gap-6 py-20'>
                            <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                            <p className='text-center mx-auto text-3xl font-medium'>Servicio solicitado con exito</p>
                            <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
                          </div>
                        )
                        : (
                          <>
                            <div className='flex flex-col gap-4 p-6 md:p-8'>
                              <p className='text-lg font-medium'>Datos de contacto</p>
                              <div className='flex flex-col gap-2'>
                                <p>Email</p>
                                <Input style={style} placeholder='Email' inputChange={(e: any) => {
                                  setClient({ ...client, email: e.target.value })
                                  clientRef.current = { ...client, email: e.target.value }
                                }} value={client.email} />
                              </div>
                              <div className='flex gap-4'>
                                <div className='flex flex-col gap-2 w-1/2'>
                                  <p>Nombre</p>
                                  <Input style={style} placeholder='Nombre' inputChange={(e: any) => {
                                    setClient({ ...client, firstName: e.target.value })
                                    clientRef.current = { ...client, firstName: e.target.value }
                                  }} value={client.firstName} />
                                </div>
                                <div className='flex flex-col gap-2 w-1/2'>
                                  <p>Apellido</p>
                                  <Input style={style} placeholder='Apellido' inputChange={(e: any) => {
                                    setClient({ ...client, lastName: e.target.value })
                                    clientRef.current = { ...client, lastName: e.target.value }
                                  }} value={client.lastName} />
                                </div>
                              </div>
                              <div className='flex flex-col gap-2'>
                                <p>Teléfono</p>
                                <div className='flex gap-2'>
                                  <p className='my-auto'>+56</p>
                                  <Input style={style} placeholder='Teléfono' inputChange={(e: any) => {
                                    setClient({ ...client, phone: e.target.value })
                                    clientRef.current = { ...client, phone: e.target.value }
                                  }} value={client.phone} />
                                </div>
                              </div>
                              {
                                content.info.form?.map((label, index) => (
                                  <div key={index} className="flex flex-col gap-2">
                                    <p>{label.text !== '' ? label.text : label.name}</p>
                                    {
                                      label.type === 'Texto'
                                        ? (
                                          <Input
                                            style={style}
                                            placeholder={label.name}
                                            value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]}
                                            inputChange={(e: any) => {
                                              if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                                setClient({ ...client, [label.data]: e.target.value })
                                                clientRef.current = { ...client, [label.data]: e.target.value }
                                              } else if (Array.isArray(client.data)) {
                                                const oldData = [...client.data];
                                                const existingData = oldData.find(dat => dat.name === label.data);
                                                if (existingData) {
                                                  existingData.value = e.target.value;
                                                } else {
                                                  oldData.push({ name: label.data, value: e.target.value });
                                                }
                                                setClient({ ...client, data: oldData });
                                                clientRef.current = { ...client, data: oldData };
                                              } else {
                                                setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                                clientRef.current = { ...client, data: [{ name: label.data, value: e.target.value }] };
                                              }
                                              console.log(clientRef.current)
                                            }}
                                          />
                                        )
                                        : ''
                                    }
                                    {
                                      label.type === 'Selector'
                                        ? (
                                          <Select selectChange={(e: any) => {
                                            if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                              setClient({ ...client, [label.data]: e.target.value })
                                              clientRef.current = { ...client, [label.data]: e.target.value }
                                            } else if (Array.isArray(client.data)) {
                                              const oldData = [...client.data];
                                              const existingData = oldData.find(dat => dat.name === label.name);
                                              if (existingData) {
                                                existingData.value = e.target.value;
                                              } else {
                                                oldData.push({ name: label.data, value: e.target.value });
                                              }
                                              setClient({ ...client, data: oldData });
                                              clientRef.current = { ...client, data: oldData };
                                            } else {
                                              setClient({ ...client, data: [{ name: label.data, value: e.target.value }] });
                                              clientRef.current = { ...client, data: [{ name: label.data, value: e.target.value }] };
                                            }
                                          }} value={client.data?.find(dat => dat.name === label.name)?.value || client[label.data]} style={style}>
                                            <option>Seleccionar opción</option>
                                            {
                                              label.datas?.map(data => <option key={data}>{data}</option>)
                                            }
                                          </Select>
                                        )
                                        : ''
                                    }
                                  </div>
                                ))
                              }
                            </div>
                            {
                              content.info.video === 'Realizar pago'
                                ? (
                                  <>
                                    <div className='flex flex-col gap-4'>
                                      <p className='text-lg font-medium px-6 md:px-8'>Pago</p>
                                      {
                                        service?.typePrice === 'Suscripción' || service?.typePrice === 'Pago variable con suscripción'
                                          ? (
                                            <>
                                              <form id="card-form" onSubmit={handleSubmit} className='flex flex-col gap-4 w-full px-6 pb-6 md:px-8 md:pb-8'>
                                                <div className='flex flex-col gap-2'>
                                                  <p>Nombre en la tarjeta</p>
                                                  <Input inputChange={(e: any) => setCardholderName(e.target.value)} value={cardholderName} placeholder={'Nombre en la tarjeta'} style={style} />
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                  <p>Numero de la tarjeta</p>
                                                  <div className='border py-2 px-3 w-full text-sm transition-all duration-200 h-10 flex' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
                                                    <MemoCardNumber placeholder="Número de tarjeta" />
                                                  </div>
                                                </div>
                                                <div className='flex gap-2'>
                                                  <div className='w-1/2 flex flex-col gap-2'>
                                                    <p>Fecha de expiración</p>
                                                    <div className='border py-2 px-3 w-full text-sm transition-all duration-200 h-10 flex' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
                                                      <MemoExpirationDate placeholder="MM/AA" />
                                                    </div>
                                                  </div>
                                                  <div className='w-1/2 flex flex-col gap-2'>
                                                    <p>CVV</p>
                                                    <div className='border py-2 px-3 w-full text-sm transition-all duration-200 h-10 flex' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>
                                                      <MemoSecurityCode placeholder="CVV" />
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className='flex flex-col gap-2'>
                                                  <p>Documento de identidad</p>
                                                  <div className='flex gap-2'>
                                                    <Select selectChange={(e: any) => setIdentificationType(e.target.value)} value={identificationType} style={style}>
                                                      <option>RUT</option>
                                                      <option>Otro</option>
                                                    </Select>
                                                    <Input placeholder="Documento de identidad" inputChange={(e: any) => setIdentificationNumber(e.target.value)} value={identificationNumber} style={style} />
                                                  </div>
                                                </div>
                                                {
                                                  error !== ''
                                                    ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                    : ''
                                                }
                                                <Button type="submit" style={style} config='w-full'>Suscribirme</Button>
                                              </form>
                                            </>
                                          )
                                          : (
                                            <>
                                              <div className='flex flex-col gap-2 w-full'>
                                                {
                                                  payment.mercadoPago.active && payment.mercadoPago.accessToken && payment.mercadoPago.accessToken !== '' && payment.mercadoPago.publicKey && payment.mercadoPago.publicKey !== ''
                                                    ? (
                                                      <div className='w-full px-6 md:px-8'>
                                                        <button className='flex gap-2 p-2 border w-full' onClick={() => setPay('MercadoPago')} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                                                          <input type='radio' className='my-auto' checked={pay === 'MercadoPago'} />
                                                          <p>Tarjeta de Credito o Debito</p>
                                                        </button>
                                                        {
                                                          pay === 'MercadoPago'
                                                            ? (
                                                              <>
                                                                {cardPaymentMemo}
                                                                {
                                                                  error !== ''
                                                                    ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                                    : ''
                                                                }
                                                              </>
                                                            )
                                                            : ''
                                                        }
                                                      </div>
                                                    )
                                                    : ''
                                                }
                                                {
                                                  payment.transbank.active && payment.transbank.apiKey && payment.transbank.apiKey !== '' && payment.transbank.commerceCode && payment.transbank.commerceCode !== ''
                                                    ? (
                                                      <div className='w-full px-6 md:px-8'>
                                                        <button className='flex gap-2 p-2 border w-full' style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} onClick={async () => {
                                                          setPay('WebPay Plus')
                                                          const pago = {
                                                            amount: initializationRef.current.amount,
                                                            returnUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/procesando-pago`
                                                          }
                                                          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/create`, pago)
                                                          setToken(response.data.token)
                                                          setUrl(response.data.url)
                                                        }}>
                                                          <input type='radio' className='my-auto' checked={pay === 'WebPay Plus'} />
                                                          <p>WebPay Plus</p>
                                                        </button>
                                                        {
                                                          pay === 'WebPay Plus'
                                                            ? (
                                                              <form action={url} method="POST" id='formTransbank' className='mt-2 flex flex-col gap-2'>
                                                                {
                                                                  error !== ''
                                                                    ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                                    : ''
                                                                }
                                                                <input type="hidden" name="token_ws" value={token} />
                                                                <Button style={style} action={async (e: any) => {
                                                                  e.preventDefault()
                                                                  if (!transbankLoading) {
                                                                    setTransbankLoading(true)
                                                                    setError('')
                                                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                                                    if (clientRef.current.email !== '' && clientRef.current.firstName !== '' && clientRef.current.lastName !== '' && clientRef.current.phone !== '') {
                                                                      if (emailRegex.test(clientRef.current.email)) {
                                                                        let currentClient = clientRef.current
                                                                        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${currentClient.email}`)
                                                                        let client
                                                                        if (res.data.email) {
                                                                          currentClient.services![0].payStatus = res.data.services.find((service: any) => service.service === currentClient.services![0].service)?.payStatus === 'Pago realizado' ? 'Segundo pago iniciado' : 'Pago iniciado'
                                                                          client = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                                                                          localStorage.setItem('service', JSON.stringify(currentClient.services![0]))
                                                                        } else {
                                                                          currentClient.services![0].payStatus = 'Pago iniciado'
                                                                          client = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...currentClient, services: [{ ...currentClient.services![0], payStatus: 'Pago iniciado' }] })
                                                                          localStorage.setItem('service', JSON.stringify({ ...currentClient.services![0], payStatus: 'Pago iniciado' }))
                                                                        }
                                                                        const service = services?.find(service => service._id === content.service?.service)
                                                                        const price = Number(initializationRef.current.amount)
                                                                        const newEventId = new Date().getTime().toString()
                                                                        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, service: service?._id, stepService: service?.steps.find(step => `/${step.slug}` === pathname)?._id, typeService: service?.typeService, typePrice: service?.typePrice, plan: plan?._id, price: price, state: currentClient.services![0].payStatus, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'WebPay Plus' })
                                                                        fbq('track', 'AddPaymentInfo', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: service?._id, currency: "clp", value: price, contents: { id: service?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                                                                        localStorage.setItem('pay', JSON.stringify(response.data))
                                                                        localStorage.setItem('service2', JSON.stringify(service))
                                                                        const form = document.getElementById('formTransbank') as HTMLFormElement
                                                                        if (form) {
                                                                          form.submit()
                                                                        }
                                                                      } else {
                                                                        setError('Debes ingresar un correo valido')
                                                                      }
                                                                    } else {
                                                                      setError('Debes llenar todos los datos')
                                                                    }
                                                                  }
                                                                }} loading={transbankLoading} config='w-full'>Pagar con WebPay Plus</Button>
                                                              </form>
                                                            )
                                                            : ''
                                                        }
                                                      </div>
                                                    )
                                                    : ''
                                                }
                                                {
                                                  payment.mercadoPagoPro.active && payment.mercadoPagoPro.accessToken && payment.mercadoPagoPro.accessToken !== '' && payment.mercadoPagoPro.publicKey && payment.mercadoPagoPro.publicKey !== ''
                                                    ? (
                                                      <div className='w-full px-6 pb-6 md:px-8 md:pb-8'>
                                                        <button className='flex gap-2 p-2 border w-full' onClick={() => setPay('MercadoPagoPro')} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                                                          <input type='radio' className='my-auto' checked={pay === 'MercadoPagoPro'} />
                                                          <p>MercadoPago</p>
                                                        </button>
                                                        {
                                                          error !== ''
                                                            ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                            : ''
                                                        }
                                                        {
                                                          pay === 'MercadoPagoPro'
                                                            ? <Button action={mercadoSubmit} style={style} loading={submitLoading} config='mt-2 w-full'>Pagar con MercadoPago</Button>
                                                            : ''
                                                        }
                                                      </div>
                                                    )
                                                    : ''
                                                }
                                              </div>
                                            </>
                                          )
                                      }
                                    </div>
                                  </>
                                )
                                : <div className='flex flex-col gap-4 pb-6 px-6 md:pb-8 md:px-8 w-full'>
                                  {
                                    error !== ''
                                      ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                      : ''
                                  }
                                  <Button style={style} config='w-full' loading={loading} action={async (e: any) => {
                                    if (!loading) {
                                      setLoading(true)
                                      setError('')

                                      const form = forms?.find(form => form._id === content.form)
                                      let valid = true
                                      let errorMessage = ''
                                  
                                      // Función para obtener el valor del campo desde client o client.data
                                      const getClientValue = (name: string) => client[name] || client.data?.find(dat => dat.name === name)?.value;
                                  
                                      form?.labels.forEach(label => {
                                        const value = getClientValue(label.data)
                                        
                                        if (label.data && (!value || value.trim() === '')) {
                                          valid = false
                                          errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                                        }
                                      })
                                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                      if (client.email && !emailRegex.test(client.email)) {
                                        valid = false
                                        errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                                      }
                                  
                                      if (!valid) {
                                        setError(errorMessage)
                                        setLoading(false)
                                        return
                                      }
                                      let currentClient = clientRef.current
                                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                                      const newEventId = new Date().getTime().toString()
                                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, {
                                        firstName: client.firstName,
                                        lastName: client.lastName,
                                        email: client.email,
                                        phone: client.phone,
                                        data: client.data,
                                        form: client.forms![0].form,
                                        fbc: Cookies.get('_fbc'),
                                        fbp: Cookies.get('_fbp'),
                                        service: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined,
                                        funnel: client.funnel,
                                        step: client.funnel?.step,
                                        page: pathname,
                                        eventId: newEventId
                                      })
                                      fbq('track', 'Lead', {
                                        first_name: client.firstName,
                                        last_name: client.lastName,
                                        email: client.email,
                                        phone: client.phone && client.phone !== '' ? `56${client.phone}` : undefined,
                                        fbp: Cookies.get('_fbp'),
                                        fbc: Cookies.get('_fbc'),
                                        content_name: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined,
                                        contents: { id: client.services?.length && client.services[0].service !== '' ? client.services[0].service : undefined, quantity: 1 },
                                        event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}`
                                      }, { eventID: newEventId })
                                      setFormCompleted(true)
                                      setLoading(false)
                                    }
                                  }}>Solicitar plan</Button>
                                </div>
                            }
                          </>
                        )
                  }
                </div>
              </>
            )
            : ''
        }
      </div>
    </div>
  )
}
