"use client"
import { Spinner } from '@/components/ui'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

declare const fbq: Function

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

export default function PayProcess () {

  const router = useRouter()

  const verifyPay = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tokenWs = urlParams.get('token_ws')
    const status = urlParams.get('collection_status')
    const tbkToken = urlParams.get('TBK_TOKEN')
    if (tokenWs) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (pay) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/commit`, { token: tokenWs })
        if (response.data.status === 'AUTHORIZED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago realizado' })
          if (localStorage.getItem('service') && localStorage.getItem('service2')) {
            const service = JSON.parse(localStorage.getItem('service')!)
            const service2 = JSON.parse(localStorage.getItem('service2')!)
            service.step = service2.steps[service2.steps.find((step: any) => step._id === service.step) ? service2.steps.findIndex((step: any) => step._id === service.step) + 1 : 0]._id
            service.payStatus =
              service.payStatus === 'Pago iniciado'
                ? 'Pago realizado'
                : service.payStatus === 'Segundo pago iniciado'
                ? 'Segundo pago realizado'
                : '';
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: [service] })
          } else if (localStorage.getItem('meetingData')) {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meeting`, JSON.parse(localStorage.getItem('meetingData')!))
            if (typeof fbq === 'function') {
              const meetingEvent = JSON.parse(localStorage.getItem('meetingEvent')!)
              fbq('track', 'schedule', { ...meetingEvent }, { eventID: meetingEvent.eventID })
            }
            socket.emit('newNotification', { title: 'Nueva reunion agendada:', description: JSON.parse(localStorage.getItem('meetingData')!).nameMeeting, url: '/reuniones', view: false })
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nueva reunion agendada:', description: JSON.parse(localStorage.getItem('meetingData')!).nameMeeting, url: '/reuniones', view: false })
          }
          router.push('/gracias-por-comprar')
        } else if (response.data.status === 'FAILED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
          const services = [...res.data.services];
          const serviceToUpdate = services.find(service => service.service === pay.service)
          if (serviceToUpdate) {
            serviceToUpdate.payStatus =
            serviceToUpdate.payStatus === 'Pago iniciado'
              ? 'Pago no realizado'
              : serviceToUpdate.payStatus === 'Segundo pago iniciado'
              ? 'Segundo pago no realizado'
              : '';
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
          }
          localStorage.setItem('pay', '')
          localStorage.setItem('service', '')
          localStorage.setItem('service2', '')
          localStorage.setItem('meetingData', '')
          localStorage.setItem('meetingEvent', '')
          router.push('/pago-fallido')
        }
      } else if (sell) {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/commit`, { token: tokenWs })
        if (response.data.status === 'AUTHORIZED') {
          const shippingData = JSON.parse(localStorage.getItem('shippingData')!)
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
          const request = await axios.post('http://testservices.wschilexpress.com/transport-orders/api/v1.0/transport-orders', shippingData, {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Ocp-Apim-Subscription-Key': res.data.enviosKey
            }
          })
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago realizado', shippingLabel: request.data.data.detail[0].label.labelData })
          router.push('/gracias-por-comprar')
        } else if (response.data.status === 'FAILED') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
          localStorage.setItem('sell', '')
          localStorage.setItem('cart', '')
          localStorage.setItem('shippingData', '')
          router.push('/pago-fallido')
        }
      }
    } else if (status) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (pay) {
        if (status === 'approved') {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago realizado' })
          if (localStorage.getItem('service') && localStorage.getItem('service2')) {
            const service = JSON.parse(localStorage.getItem('service')!)
            const service2 = JSON.parse(localStorage.getItem('service2')!)
            service.step = service2.steps[service2.steps.find((step: any) => step._id === service.step) ? service2.steps.findIndex((step: any) => step._id === service.step) + 1 : 0]._id
            service.payStatus =
              service.payStatus === 'Pago iniciado'
                ? 'Pago realizado'
                : service.payStatus === 'Segundo pago iniciado'
                ? 'Segundo pago realizado'
                : '';
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: [service] })
          } else if (localStorage.getItem('meetingData')) {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meeting`, JSON.parse(localStorage.getItem('meetingData')!))
            if (typeof fbq === 'function') {
              const meetingEvent = JSON.parse(localStorage.getItem('meetingEvent')!)
              fbq('track', 'schedule', { ...meetingEvent }, { eventID: meetingEvent.eventID })
            }
            socket.emit('newNotification', { title: 'Nueva reunion agendada:', description: JSON.parse(localStorage.getItem('meetingData')!).nameMeeting, url: '/reuniones', view: false })
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nueva reunion agendada:', description: JSON.parse(localStorage.getItem('meetingData')!).nameMeeting, url: '/reuniones', view: false })
          }
          router.push('/gracias-por-comprar')
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
          const services = [...res.data.services];
          const serviceToUpdate = services.find(service => service.service === pay.service)
          if (serviceToUpdate) {
            serviceToUpdate.payStatus =
              serviceToUpdate.payStatus === 'Pago iniciado'
                ? 'Pago no realizado'
                : serviceToUpdate.payStatus === 'Segundo pago iniciado'
                ? 'Segundo pago no realizado'
                : '';
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
          }
          localStorage.setItem('pay', '')
          localStorage.setItem('service', '')
          localStorage.setItem('service2', '')
          localStorage.setItem('meetingData', '')
          localStorage.setItem('meetingEvent', '')
          router.push('/pago-fallido')
        }
      } else if (sell) {
        if (status === 'approved') {
          const shippingData = JSON.parse(localStorage.getItem('shippingData')!)
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
          const request = await axios.post('http://testservices.wschilexpress.com/transport-orders/api/v1.0/transport-orders', shippingData, {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
              'Ocp-Apim-Subscription-Key': res.data.enviosKey
            }
          })
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago realizado', shippingLabel: request.data.data.detail[0].label.labelData })
          router.push('/gracias-por-comprar')
        } else {
          await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
          localStorage.setItem('sell', '')
          localStorage.setItem('cart', '')
          localStorage.setItem('shippingData', '')
          router.push('/pago-fallido')
        }
      }
    } else if (tbkToken) {
      const pay = JSON.parse(localStorage.getItem('pay')!)
      const sell = JSON.parse(localStorage.getItem('sell')!)
      if (pay) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/pay/${pay._id}`, { state: 'Pago no realizado' })
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${pay.email}`)
        const services = [...res.data.services];
        const serviceToUpdate = services.find(service => service.service === pay.service)
        serviceToUpdate.payStatus =
          serviceToUpdate.payStatus === 'Pago iniciado'
            ? 'Pago no realizado'
            : serviceToUpdate.payStatus === 'Segundo pago iniciado'
            ? 'Segundo pago no realizado'
            : '';
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/client/${pay.email}`, { services: serviceToUpdate })
        localStorage.setItem('pay', '')
        localStorage.setItem('service', '')
        localStorage.setItem('service2', '')
        localStorage.setItem('meetingData', '')
        localStorage.setItem('meetingEvent', '')
        router.push('/pago-fallido')
      } else if (sell) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/sell/${sell._id}`, { state: 'Pago no realizado' })
        localStorage.setItem('sell', '')
        localStorage.setItem('cart', '')
        localStorage.setItem('shippingData', '')
        router.push('/pago-fallido')
      }
    }
  }

  useEffect(() => {
    verifyPay()
  }, [])

  return (
    <div className='w-full bg-white fixed flex' style={{ height: 'calc(100% - 150px)' }}>
      <div className='w-fit m-auto'>
        <Spinner />
      </div>
    </div>
  )
}