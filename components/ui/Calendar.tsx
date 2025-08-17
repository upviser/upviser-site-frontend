"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Input, Select, Spinner } from '.'
import axios from 'axios'
import { ICall, IClient, IPayment, IService } from '@/interfaces'
import { usePathname, useRouter } from 'next/navigation'
import { io } from 'socket.io-client'
import { CardPayment, initMercadoPago, StatusScreen } from '@mercadopago/sdk-react'
import Cookies from 'js-cookie'

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

type CalendarProps = {
  newClient: IClient
  setNewClient: any
  tags: string[]
  meeting: string
  call: ICall
  payment: IPayment
  services?: IService[]
  style?: any
  content?: any
};

interface DateData {
  date: Date;
  hours: number[];
}

declare global {
  interface Window {
    MercadoPago: any;
    cardPaymentBrickController: any;
  }
}

declare const fbq: Function

export const Calendar: React.FC<CalendarProps> = ({ newClient, setNewClient, tags, meeting, call, payment, services, style, content }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<DateData[]>([]);
  const [loading, setLoading] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [error, setError] = useState('')
  const [initialization, setInitialization] = useState({ amount: Number(call.price) })
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(true)
  const [pay, setPay] = useState('')
  const [link, setLink] = useState('')
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [transbankLoading, setTransbankLoading] = useState(false)
  const [type, setType] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)

  const clientRef: any = useRef(newClient);
  const selectDate: any = useRef(selectedDateTime)
  const initializationRef = useRef(initialization)
  const paymentIdRef = useRef(null)

  const router = useRouter()
  const pathname = usePathname()

  if (payment?.mercadoPago?.publicKey) {
    initMercadoPago(payment.mercadoPago.publicKey)
  }

  const getDates = async () => {
    try {
        const currentDate = new Date(); 
        const currentHour = currentDate.getHours(); 
        const currentMinutes = currentDate.getMinutes(); 

        const meetingsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/meetings`);
        const meetings = meetingsRes.data.map((meeting: any) => new Date(meeting.date));

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/calendar/${call.calendar}`);
        const datesWithConvertedDates = res.data.dates.map((dateItem: any) => ({
            ...dateItem,
            date: new Date(dateItem.date)
        }));

        // Función para convertir "45 minutos" a 45 (minutos)
        const parseDuration = (timeString: string) => {
            const match = timeString.match(/(\d+)/);
            return match ? parseInt(match[1], 10) : 15; // Default 15 minutos si no se encuentra número
        };

        // Determinar la duración que se usará
        const intervalDuration = call.intervals && call.intervals !== '' ? parseDuration(call.intervals) : parseDuration(call.duration);

        // Función para generar intervalos de tiempo
        const generateTimeIntervals = (hours: number[]) => {
            const intervals: any = [];
            let currentTime = hours[0] * 60; 

            hours.forEach(hour => {
                while (Math.floor(currentTime / 60) < 24) {
                    const currentHour = Math.floor(currentTime / 60);
                    const currentMinutes = currentTime % 60;

                    if (hours.includes(currentHour)) {
                        intervals.push(`${currentHour}:${currentMinutes.toString().padStart(2, '0')}`);
                    }
                    
                    currentTime += intervalDuration; // Usa intervalDuration en lugar de duration
                }
            });

            return intervals;
        };

        // Filtrar fechas pasadas y generar intervalos de horas disponibles
        const filteredDates = datesWithConvertedDates.map((dateData: any) => {
            if (dateData.date < currentDate.setHours(0, 0, 0, 0)) return null; 

            if (dateData.date.getDate() === currentDate.getDate()) {
                const startHour = currentHour < 2 ? 0 : currentHour + 2;
                const filteredHours = dateData.hours.filter((hour: number) => hour >= startHour);
                const intervals = generateTimeIntervals(filteredHours);
                const filteredIntervals = intervals.filter((interval: any) => {
                    const [hour, minutes] = interval.split(':').map(Number);
                    return hour > currentHour || (hour === currentHour && minutes > currentMinutes);
                });
                return {
                    ...dateData,
                    hours: filteredIntervals
                };
            }

            return {
                ...dateData,
                hours: generateTimeIntervals(dateData.hours)
            };
        }).filter((dateData: any) => dateData !== null);

        // Filtrar horas ya agendadas
        const filteredAvailableDates = filteredDates.map((dateData: any) => {
            const filteredHours = dateData.hours.filter((interval: string) => {
                const [hour, minutes] = interval.split(':').map(Number);
                const meetingDate = new Date(dateData.date);
                meetingDate.setHours(hour, minutes);

                return !meetings.some((meetingDateItem: Date) => meetingDateItem.getTime() === meetingDate.getTime());
            });

            return {
                ...dateData,
                hours: filteredHours
            };
        });

        setAvailableDates(filteredAvailableDates);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

  useEffect(() => {
    getDates();
  }, []);

  const handleChangeMonth = (increment: number): void => {
    setDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(1); // Fijamos siempre el día 1 para evitar desbordamientos
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  const handleDateTimeSelect = (selectedDate: Date): void => {
    setSelectedDateTime(selectedDate);
    selectDate.current = selectedDate
  };

  const handleHourSelect = (time: string): void => {
    if (selectedDateTime) {
      const selectedDateWithTime = new Date(selectedDateTime);
      const [hour, minutes] = time.split(':').map(Number);
      selectedDateWithTime.setHours(hour, minutes);
      setSelectedDateTime(selectedDateWithTime);
      selectDate.current = selectedDateWithTime
    }
  };
  
  const isTimeSelected = (time: string): boolean => {
    if (!selectedDateTime) return false;
    const [selectedHour, selectedMinutes] = time.split(':').map(Number);
    return selectedDateTime.getHours() === selectedHour && selectedDateTime.getMinutes() === selectedMinutes;
  };

  const onSubmit = async (formData: any) => {
    // callback llamado al hacer clic en el botón enviar datos
    if (!loading) {
      setLoading(true)
      setError('')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let valid = true;
      let errorMessage = ''
      call.labels?.forEach((label) => {
        const value = label.data === 'phone' ? newClient[label.data] : newClient.data?.find(dat => dat.name === label.data)?.value || newClient[label.data]
        if (label.data && (!value || value.trim() === '')) {
          valid = false;
          errorMessage = `Por favor, completa el campo ${label.text}.`;
        }
      })
      if (newClient.email && !emailRegex.test(newClient.email)) {
        valid = false
        errorMessage = 'Has ingresado un correo inválido'
      }
      if (!valid) {
        setError(errorMessage)
        setLoading(false)
        return
      }
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
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
            let respo
            let stepFind
            if (res.data) {
              respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
              stepFind = respo.data.steps.find((ste: any) => `/${ste.slug}` === pathname)
            }
            const newEventId = new Date().getTime().toString()
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, price: initializationRef.current.amount, state: 'Pago realizado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'WebPay Plus' })
            if (typeof fbq === 'function') {
              fbq('track', 'Purchase', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: call?._id, currency: "clp", value: initializationRef.current.amount, contents: { id: call?._id, item_price: initializationRef.current.amount, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
            }
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meeting`, { ...clientRef.current, date: selectDate.current, tags: tags, meeting: meeting, call: call.nameMeeting, duration: call.duration === '15 minutos' ? 15 : call.duration === '20 minutos' ? 20 : call.duration === '25 minutos' ? 25 : call.duration === '30 minutos' ? 30 : call.duration === '40 minutos' ? 40 : call.duration === '45 minutos' ? 45 : call.duration === '50 minutos' ? 50 : call.duration === '60 minutos' ? 60 : call.duration === '70 minutos' ? 70 : call.duration === '80 minutos' ? 80 : call.duration === '90 minutos' ? 90 : call.duration === '100 minutos' ? 100 : call.duration === '110 minutos' ? 110 : call.duration === '120 minutos' ? 120 : 120, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, service: clientRef.current.services?.length && clientRef.current.services[0].service && clientRef.current.services[0].service !== '' ? clientRef.current.services[0].service : undefined, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, funnel: respo?.data._id, step: stepFind?._id, eventId: newEventId, price: call.price, type: call.type?.length && call.type.length >= 2 ? type : call.type, calendar: call.calendar })
            if (typeof fbq === 'function') {
              fbq('track', 'Schedule', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: call._id, currency: "clp", value: call.price, contents: { id: call._id, item_price: call.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
            }
            socket.emit('newNotification', { title: 'Nueva reunion agendada:', description: meeting, url: '/llamadas', view: false })
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nueva reunion agendada:', description: call.nameMeeting, url: '/reuniones', view: false })
            if (call.action === 'Mostrar mensaje') {
              setScheduled(true)
            } else if (call.action === 'Ir a una pagina') {
              router.push(call.redirect!)
            }
            resolve();
          })
          .catch((error) => {
            // manejar la respuesta de error al intentar crear el pago
            reject();
          })
      })
    }
  }
   
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
        />
      )
    }
  }, [initializationRef.current.amount]);

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!loading) {
      setLoading(true)
      setError('')
      let valid = true;
      let errorMessage = ''
      call.labels?.forEach((label) => {
        const value = label.data === 'phone' ? newClient[label.data] : newClient.data?.find(dat => dat.name === label.data)?.value || newClient[label.data]
        if (label.data && (!value || value.trim() === '')) {
          valid = false;
          errorMessage = `Por favor, completa el campo ${label.text}.`;
        }
      })
      if (newClient.email && !emailRegex.test(newClient.email)) {
        valid = false
        errorMessage = 'Has ingresado un correo inválido'
      }
      if (!valid) {
        setError(errorMessage)
        setLoading(false)
        return
      }
      let res: any
      if (pathname !== '/' && !pathname.includes('/llamadas/')) {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      }
      let respo
      let stepFind
      if (res?.data) {
        respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        stepFind = respo.data?.steps?.find((ste: any) => `/${ste.slug}` === pathname)
      }
      const newEventId = new Date().getTime().toString()
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/meeting`, { ...newClient, date: selectedDateTime, tags: tags, meeting: meeting, call: call.nameMeeting, duration: call.duration === '15 minutos' ? 15 : call.duration === '20 minutos' ? 20 : call.duration === '25 minutos' ? 25 : call.duration === '30 minutos' ? 30 : call.duration === '40 minutos' ? 40 : call.duration === '45 minutos' ? 45 : call.duration === '50 minutos' ? 50 : call.duration === '60 minutos' ? 60 : call.duration === '70 minutos' ? 70 : call.duration === '80 minutos' ? 80 : call.duration === '90 minutos' ? 90 : call.duration === '100 minutos' ? 100 : call.duration === '110 minutos' ? 110 : call.duration === '120 minutos' ? 120 : 120, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, service: newClient.services?.length && newClient.services[0].service && newClient.services[0].service !== '' ? newClient.services[0].service : undefined, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, funnel: respo?.data?._id, step: stepFind?._id, eventId: newEventId, type: call.type?.length && call.type.length >= 2 ? type : call.type![0], calendar: call.calendar })
      if (typeof fbq === 'function') {
        fbq('track', 'Schedule', { first_name: newClient.firstName, last_name: newClient.lastName, email: newClient.email, phone: newClient.phone && newClient.phone !== '' ? `56${newClient.phone}` : undefined, content_name: call._id, currency: "clp", value: call.price, contents: { id: call._id, item_price: call.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      }
      socket.emit('newNotification', { title: 'Nueva reunion agendada:', description: call.nameMeeting, url: '/llamadas', view: false })
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification`, { title: 'Nueva reunion agendada:', description: call.nameMeeting, url: '/reuniones', view: false })
      if (call.action === 'Mostrar mensaje') {
        setScheduled(true)
      } else if (call.action === 'Ir a una pagina') {
        router.push(call.redirect!)
      }
    }
  }

  const mercadoSubmit = async (e: any) => {
    e.preventDefault()
    if (!submitLoading) {
      setSubmitLoading(true)
      setError('')
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      let valid = true;
      let errorMessage = ''
      call.labels?.forEach((label) => {
        const value = label.data === 'phone' ? newClient[label.data] : newClient.data?.find(dat => dat.name === label.data)?.value || newClient[label.data]
        if (label.data && (!value || value.trim() === '')) {
          valid = false;
          errorMessage = `Por favor, completa el campo ${label.text}.`;
        }
      })
      if (newClient.email && !emailRegex.test(newClient.email)) {
        valid = false
        errorMessage = 'Has ingresado un correo inválido'
      }
      if (!valid) {
        setError(errorMessage)
        setSubmitLoading(false)
        return
      }
      let currentClient = clientRef.current
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
      const price = Number(initializationRef.current.amount)
      let res: any
      if (pathname !== '/' && !pathname.includes('/llamadas/')) {
        res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      }
      let respo
      let stepFind
      if (res?.data) {
        respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
        stepFind = respo.data?.steps?.find((ste: any) => `/${ste.slug}` === pathname)
      }
      const newEventId = new Date().getTime().toString()
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, price: price, state: 'Pago iniciado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'WebPay Plus' })
      if (typeof fbq === 'function') {
        fbq('track', 'AddPaymentInfo', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: call?._id, currency: "clp", value: price, contents: { id: call?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
      }
      localStorage.setItem('pay', JSON.stringify(response.data))
      const meetingData = { ...newClient, date: selectedDateTime, tags: tags, meeting: meeting, call: call.nameMeeting, duration: call.duration === '15 minutos' ? 15 : call.duration === '20 minutos' ? 20 : call.duration === '25 minutos' ? 25 : call.duration === '30 minutos' ? 30 : call.duration === '40 minutos' ? 40 : call.duration === '45 minutos' ? 45 : call.duration === '50 minutos' ? 50 : call.duration === '60 minutos' ? 60 : call.duration === '70 minutos' ? 70 : call.duration === '80 minutos' ? 80 : call.duration === '90 minutos' ? 90 : call.duration === '100 minutos' ? 100 : call.duration === '110 minutos' ? 110 : call.duration === '120 minutos' ? 120 : 120, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, service: newClient.services?.length && newClient.services[0].service && newClient.services[0].service !== '' ? newClient.services[0].service : undefined, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, funnel: respo?.data?._id, step: stepFind?._id, eventId: newEventId, type: call.type?.length && call.type.length >= 2 ? type : call.type![0], calendar: call.calendar, price: call.price }
      localStorage.setItem('meetingData', JSON.stringify(meetingData))
      localStorage.setItem('meetingEvent', JSON.stringify({ first_name: newClient.firstName, last_name: newClient.lastName, email: newClient.email, phone: newClient.phone && newClient.phone !== '' ? `56${newClient.phone}` : undefined, content_name: call._id, currency: "clp", value: call.price, contents: { id: call._id, item_price: call.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}`, eventID: newEventId }))
      window.location.href = link
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 h-full">
      {
        scheduled || paymentCompleted
          ? scheduled
            ? (
              <div className='flex flex-col gap-4 m-auto text-center'>
                <p className='text-xl font-medium'>Se ha agendado exitosamente</p>
                <p>{call.message}</p>
              </div>
            )
            : paymentCompleted
              ? (
                <div className='flex flex-col gap-6 py-20'>
                  <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                  <p className='text-center mx-auto text-3xl font-medium'>Pago realizado con exito</p>
                  <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
                </div>
              )
              : ''
          : (
            <>
              <div className='flex flex-col gap-6'>
                <div className="flex gap-6 items-center m-auto">
                  <button onClick={() => handleChangeMonth(-1)} className="text-gray-600 hover:text-gray-800">&lt;</button>
                  <p className="text-lg font-semibold">{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</p>
                  <button onClick={() => handleChangeMonth(1)} className="text-gray-600 hover:text-gray-800">&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Dom</div>
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Lun</div>
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Mar</div>
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Mié</div>
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Jue</div>
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Vie</div>
                  <div className="text-center font-semibold" style={{ color: `${content?.info.textColor}80` }}>Sáb</div>
                  {renderCalendar()}
                </div>
              </div>
              {selectedDateTime && (
                <div className='flex flex-col gap-2'>
                  <p className='text-lg font-semibold'>Elige la hora</p>
                  {
                    availableDates
                    .find(item => item.date.toDateString() === selectedDateTime.toDateString())
                    ?.hours.length
                      ? <div className="grid grid-cols-4 gap-2">
                          {availableDates
                          .find(item => item.date.toDateString() === selectedDateTime.toDateString())
                          ?.hours
                          .sort((a, b) => a - b) // Ordenar las horas
                          .map(hour => (
                            <button
                              key={hour}
                              onClick={() => handleHourSelect(hour.toString())}
                              className={`p-2 rounded-xl text-center transition-colors duration-200`}
                              style={{ backgroundColor: isTimeSelected(hour.toString()) ? style.primary : `${content?.info.textColor && content.info.textColor !== '' ? content.info.textColor : '#111111'}20`, color: isTimeSelected(hour.toString()) ? style.button : '' }}
                            >
                              {hour}
                            </button>
                          ))}
                        </div>
                      : <p className='w-full'>No hay horas disponibles para este día</p>
                  }
                </div>
              )}
              {selectedDateTime && selectedDateTime?.getHours() !== 0 && (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                  {
                    error !== ''
                      ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                      : ''
                  }
                  <p className='text-lg font-semibold'>Completa tus datos</p>
                  {
                    call.type?.length && call.type.length >= 2
                      ? (
                        <div className='flex flex-col gap-2'>
                          <p>Selecciona el tipo</p>
                          <Select selectChange={(e: any) => setType(e.target.value)} value={type} style={style}>
                            <option>Selecciona el tipo</option>
                            {
                              call.type.map(typ => <option key={typ}>{typ}</option>)
                            }
                          </Select>
                        </div>
                      )
                      : ''
                  }
                  {
                    call.labels?.map(label => (
                      <div key={label._id} className="flex flex-col gap-2">
                        <p>{label.text}</p>
                        {
                          label.type === 'Selector'
                            ? (
                              <Select selectChange={(e: any) => {
                                if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                  setNewClient({ ...newClient, [label.data]: e.target.value })
                                  clientRef.current = { ...newClient, [label.data]: e.target.value }
                                } else if (Array.isArray(newClient.data)) {
                                  const oldData = [...newClient.data];
                                  const existingData = oldData.find(dat => dat.name === label.data);

                                  if (existingData) {
                                    existingData.value = e.target.value;
                                  } else {
                                    oldData.push({ name: label.data, value: e.target.value });
                                  }

                                  setNewClient({ ...newClient, data: oldData });
                                  clientRef.current = { ...newClient, data: oldData }
                                } else {
                                  setNewClient({ ...newClient, data: [{ name: label.data, value: e.target.value }] });
                                  clientRef.current = { ...newClient, data: [{ name: label.data, value: e.target.value }] }
                                }
                              }} style={style}>
                                {
                                  label.datas?.map(data => <option key={data}>{data}</option>)
                                }
                              </Select>
                            )
                            : (
                              <div className='flex gap-2'>
                                {
                                  label.data === 'phone'
                                    ? <p className='my-auto'>+56</p>
                                    : ''
                                }
                                <Input
                                  style={style}
                                  placeholder={label.text}
                                  value={newClient.data?.find(dat => dat.name === label.text)?.value || newClient[label.data]}
                                  inputChange={(e: any) => {
                                    if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                      setNewClient({ ...newClient, [label.data]: e.target.value })
                                      clientRef.current = { ...newClient, [label.data]: e.target.value }
                                    } else if (Array.isArray(newClient.data)) {
                                      const oldData = [...newClient.data];
                                      const existingData = oldData.find(dat => dat.name === label.data);

                                      if (existingData) {
                                        existingData.value = e.target.value;
                                      } else {
                                        oldData.push({ name: label.data, value: e.target.value });
                                      }

                                      setNewClient({ ...newClient, data: oldData });
                                      clientRef.current = { ...newClient, data: oldData }
                                    } else {
                                      setNewClient({ ...newClient, data: [{ name: label.data, value: e.target.value }] });
                                      clientRef.current = { ...newClient, data: [{ name: label.data, value: e.target.value }] }
                                    }
                                  }}
                                />
                              </div>
                            )
                        }
                      </div>
                    ))
                  }
                  {
                    call.type?.length && call.type.length >= 2
                      ? type === 'Visita a domicilio'
                        ? (
                          <>
                            <div className='flex flex-col gap-2'>
                              <p>Dirección</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, address: e.target.value })} value={newClient.address} placeholder={'Dirección'} style={style} />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p>Detalles</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, details: e.target.value })} value={newClient.details} placeholder={'Detalles'} style={style} />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p>Ciudad</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, city: e.target.value })} value={newClient.city} placeholder={'Ciudad'} style={style} />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p>Región</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, region: e.target.value })} value={newClient.region} placeholder={'Región'} style={style} />
                            </div>
                          </>
                        )
                        : ''
                      : call.type![0] === 'Visita a domicilio'
                        ? (
                          <>
                            <div className='flex flex-col gap-2'>
                              <p>Dirección</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, address: e.target.value })} value={newClient.address} placeholder={'Dirección'} style={style} />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p>Detalles</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, details: e.target.value })} value={newClient.details} placeholder={'Detalles'} style={style} />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p>Ciudad</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, city: e.target.value })} value={newClient.city} placeholder={'Ciudad'} style={style} />
                            </div>
                            <div className='flex flex-col gap-2'>
                              <p>Región</p>
                              <Input inputChange={(e: any) => setNewClient({ ...newClient, region: e.target.value })} value={newClient.region} placeholder={'Región'} style={style} />
                            </div>
                          </>
                        )
                        : ''
                  }
                  {
                    call.price && call.price !== ''
                      ? (
                        <div className='flex flex-col gap-4 w-full'>
                          <p className='text-lg font-semibold'>Pago</p>
                          <div className='flex flex-col gap-4 w-full'>
                            {
                              payment.mercadoPago.active && payment.mercadoPago.accessToken && payment.mercadoPago.accessToken !== '' && payment.mercadoPago.publicKey && payment.mercadoPago.publicKey !== ''
                                ? (
                                  <div className='w-full'>
                                    <button className='flex gap-2 p-2 border w-full' onClick={async (e: any) => {
                                      e.preventDefault()
                                      setPay('MercadoPago')
                                      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago-create`, [{ title: services?.find(service => service._id === content.service)?.name, unit_price: initializationRef.current.amount, quantity: 1 }])
                                      setLink(res.data.init_point)
                                    }} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
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
                                  <div className='w-full'>
                                    <button className='flex gap-2 p-2 border w-full' style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} onClick={async (e: any) => {
                                      e.preventDefault()
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
                                          <form action={url} method="POST" id='formTransbank' className='mt-2'>
                                            <input type="hidden" name="token_ws" value={token} />
                                            <Button style={style} action={async (e: any) => {
                                              e.preventDefault()
                                              if (!transbankLoading) {
                                                setTransbankLoading(true)
                                                setError('')
                                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                                let valid = true;
                                                let errorMessage = ''
                                                call.labels?.forEach((label) => {
                                                  const value = label.data === 'phone' ? newClient[label.data] : newClient.data?.find(dat => dat.name === label.data)?.value || newClient[label.data]
                                                  if (label.data && (!value || value.trim() === '')) {
                                                    valid = false;
                                                    errorMessage = `Por favor, completa el campo ${label.text}.`;
                                                  }
                                                })
                                                if (newClient.email && !emailRegex.test(newClient.email)) {
                                                  valid = false
                                                  errorMessage = 'Has ingresado un correo inválido'
                                                }
                                                if (!valid) {
                                                  setError(errorMessage)
                                                  setLoading(false)
                                                  return
                                                }
                                                let currentClient = clientRef.current
                                                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, currentClient)
                                                const price = Number(initializationRef.current.amount)
                                                let res: any
                                                if (pathname !== '/' && !pathname.includes('/llamadas/')) {
                                                  res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
                                                }
                                                let respo
                                                let stepFind
                                                if (res?.data) {
                                                  respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
                                                  stepFind = respo.data?.steps?.find((ste: any) => `/${ste.slug}` === pathname)
                                                }
                                                const newEventId = new Date().getTime().toString()
                                                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay`, { firstName: clientRef.current.firstName, lastName: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone, price: price, state: 'Pago iniciado', fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), pathname: pathname, eventId: newEventId, funnel: clientRef.current.funnels?.length ? clientRef.current.funnels[0].funnel : undefined, step: clientRef.current.funnels?.length ? clientRef.current.funnels[0].step : undefined, method: 'WebPay Plus' })
                                                if (typeof fbq === 'function') {
                                                  fbq('track', 'AddPaymentInfo', { first_name: clientRef.current.firstName, last_name: clientRef.current.lastName, email: clientRef.current.email, phone: clientRef.current.phone && clientRef.current.phone !== '' ? `56${clientRef.current.phone}` : undefined, content_name: call?._id, currency: "clp", value: price, contents: { id: call?._id, item_price: price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
                                                }
                                                localStorage.setItem('pay', JSON.stringify(response.data))
                                                const meetingData = { ...newClient, date: selectedDateTime, tags: tags, meeting: meeting, call: call.nameMeeting, duration: call.duration === '15 minutos' ? 15 : call.duration === '20 minutos' ? 20 : call.duration === '25 minutos' ? 25 : call.duration === '30 minutos' ? 30 : call.duration === '40 minutos' ? 40 : call.duration === '45 minutos' ? 45 : call.duration === '50 minutos' ? 50 : call.duration === '60 minutos' ? 60 : call.duration === '70 minutos' ? 70 : call.duration === '80 minutos' ? 80 : call.duration === '90 minutos' ? 90 : call.duration === '100 minutos' ? 100 : call.duration === '110 minutos' ? 110 : call.duration === '120 minutos' ? 120 : 120, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), page: pathname, service: newClient.services?.length && newClient.services[0].service && newClient.services[0].service !== '' ? newClient.services[0].service : undefined, stepService: services?.find(service => service.steps.find(step => `/${step.slug}` === pathname))?.steps.find(step => `/${step.slug}` === pathname)?._id, funnel: respo?.data?._id, step: stepFind?._id, eventId: newEventId, type: call.type?.length && call.type.length >= 2 ? type : call.type![0], calendar: call.calendar, price: call.price }
                                                localStorage.setItem('meetingData', JSON.stringify(meetingData))
                                                localStorage.setItem('meetingEvent', JSON.stringify({ first_name: newClient.firstName, last_name: newClient.lastName, email: newClient.email, phone: newClient.phone && newClient.phone !== '' ? `56${newClient.phone}` : undefined, content_name: call._id, currency: "clp", value: call.price, contents: { id: call._id, item_price: call.price, quantity: 1 }, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}`, eventID: newEventId }))
                                                const form = document.getElementById('formTransbank') as HTMLFormElement
                                                if (form) {
                                                  form.submit()
                                                }
                                              }
                                            }} loading={transbankLoading} width='250'>Pagar con WebPay Plus</Button>
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
                                  <div className='w-full'>
                                    <button className='flex gap-2 p-2 border w-full' onClick={(e: any) => {
                                      e.preventDefault()
                                      setPay('MercadoPagoPro')
                                    }} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }}>
                                      <input type='radio' className='my-auto' checked={pay === 'MercadoPagoPro'} />
                                      <p>MercadoPago</p>
                                    </button>
                                    {
                                      pay === 'MercadoPagoPro'
                                        ? <Button action={mercadoSubmit} style={style} loading={submitLoading} config='mt-2' width='250'>Pagar con MercadoPago</Button>
                                        : ''
                                    }
                                  </div>
                                )
                                : ''
                            }
                          </div>
                        </div>
                      )
                      : <Button type='submit' loading={loading} config='w-full' style={style}>{call.buttonText && call.buttonText !== '' ? call.buttonText : 'Agendar llamada'}</Button>
                  }
                </form>
              )}
            </>
          )
      } 
    </div>
  );

  function renderCalendar(): JSX.Element[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const startingDay = new Date(year, month, 1).getDay();

    const days: JSX.Element[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    for (let i = 1; i <= daysCount; i++) {
      const currentDate = new Date(year, month, i);
      const dateData = availableDates.find(item => item.date.toDateString() === currentDate.toDateString());
      const isAvailable = dateData !== undefined;
      const isSelected = selectedDateTime && currentDate.toDateString() === selectedDateTime.toDateString();
      days.push(
        <button 
          key={i} 
          disabled={!isAvailable} 
          className={`w-10 h-10 sm:w-12 sm:h-12 m-auto flex rounded-full transition-color duration-150`}
          style={{ backgroundColor: isAvailable ? (isSelected ? style.primary : content?.info.textColor && content.info.textColor !== '' ? `${content.info.textColor}20` : '#11111120') : '', color: isAvailable ? (isSelected ? style.button : `${content?.info.textColor}`) : `${content?.info.textColor}50` }}
          onClick={() => handleDateTimeSelect(currentDate)}
        >
          <p className='m-auto'>{i}</p>
        </button>
      );
    }

    return days;
  }
};