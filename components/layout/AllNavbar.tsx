"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Navbar } from './Navbar'
import { Chat } from '../chat'
import { Design, ICall, ICategory, IClient, IForm, IFunnel, IPayment, IPolitics, IProduct, IService, IStoreData } from '@/interfaces'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Button, Calendar, Input, LinkButton } from '../ui'

interface Props {
    design: Design
    storeData: IStoreData
    funnels: IFunnel[]
    politics?: IPolitics
    calls: ICall[]
    forms: IForm[]
    payment: IPayment
    services: IService[]
    style?: any
    categories: ICategory[]
    products?: IProduct[]
    integrations: any
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

declare const fbq: Function

export const AllNavbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, funnels, politics, calls, forms, payment, services, style, categories, products, integrations }) => {

  const [load, setLoad] = useState(false)
  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [message, setMessage] = useState('')
  const [clientData, setClientData] = useState<IClient>({ email: '' })
  const [loadingPopup, setLoadingPopup] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [viewWhatsapp, setViewWhatsapp] = useState(false)
  const [viewChat, setViewChat] = useState(false)
  const [viewInstagram, setViewInstagram] = useState(false)

  const popupRef = useRef<HTMLDivElement | null>(null);

  const pathname = decodeURIComponent(usePathname())
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setViewWhatsapp(true)
      setTimeout(() => {
        setViewInstagram(true)
        setTimeout(() => {
          setViewChat(true)
        }, 50);
      }, 50);
    }, 200);
  }, [])

  const pageView = async () => {
    const funnel = funnels.find(funnel => funnel.steps.some(step => step.slug !== '' ? `/${step.slug}` === pathname : false))
    const service = services.find(service => service.steps.some(step => step.slug !== '' ? `/${step.slug}` === pathname : false))
    const newEventId = new Date().getTime().toString()
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/page`, { page: pathname, funnel: funnel?._id, step: funnel?.steps.find(step => `/${step.slug}` === pathname), service: funnel?.service ? funnel?.service : service?._id, stepService: service?.steps.find(step => `/${step.slug}` === pathname)?._id, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc'), eventId: newEventId })
    if (typeof fbq === 'function') {
      fbq('track', 'PageView', { content_name: funnel?.service, fbc: Cookies.get('_fbc'), fbp: Cookies.get('_fbp'), event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}` }, { eventID: newEventId })
    }
    if (!load) {
      setLoad(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/session`, { page: pathname, funnel: funnel?._id, step: funnel?.steps.find(step => `/${step.slug}` === pathname), service: funnel?.service ? funnel?.service : service?._id, stepService: service?.steps.find(step => `/${step.slug}` === pathname)?._id })
    }
  }

  useEffect(() => {
    if (integrations?.apiPixelId && integrations.apiPixelId !== '') {
      const interval = setInterval(() => {
        if (typeof fbq === 'function') {
          pageView()
          clearInterval(interval)
        }
      }, 100)
    
      return () => clearInterval(interval)
    } else {
      pageView()
    }
  }, [pathname])

  const getClientData = async () => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-data`)
    setData(res.data)
  }

  useEffect(() => {
    getClientData()
  }, [])

  useEffect(() => {
    if (localStorage.getItem('popup') !== design.popup?.title) {
      setTimeout(() => {
        setPopup({ view: 'flex', opacity: 'opacity-0', mouse: false })
        setTimeout(() => {
          setPopup({ view: 'flex', opacity: 'opacity-1', mouse: false })
        }, 10)
      }, (design.popup?.wait ? design.popup?.wait * 1000 : 0));
    }
  }, [])

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
  }, [popup, setPopup]);

  return (
    <>
      {
        design.popup?.active
          ? (
            <div className={`${popup.view} ${popup.opacity} transition-opacity duration-200 w-full h-full fixed bg-black/30 flex z-50 px-4`}>
              <div ref={popupRef} onMouseEnter={() => setPopup({ ...popup, mouse: true })} onMouseLeave={() => setPopup({ ...popup, mouse: false })} className={`${popup.opacity === 'opacity-1' ? 'scale-1' : 'scale-90'} ${calls.find(call => call._id === design.popup?.content) ? 'max-w-[800px]' : 'max-w-[600px]'} transition-transform duration-200 w-full p-6 max-h-[600px] overflow-y-auto bg-white m-auto flex flex-col gap-4`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                {
                  message !== ''
                    ? <p>{message}</p>
                    : (
                      <>
                        {
                          design.popup.title && design.popup.title !== ''
                            ? <h2 className='text-2xl font-medium'>{design.popup.title}</h2>
                            : ''
                        }
                        {
                          design.popup.description && design.popup.description !== ''
                            ? <p>{design.popup.description}</p>
                            : ''
                        }
                        {
                          design.popup.content && design.popup.content !== ''
                            ? calls.find(call => call._id === design.popup?.content)
                              ? (
                                <div className="lg:flex" style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', color: '#111111', backgroundColor: '#ffffff' }}>
                                  <div className="p-6 border-b lg:border-b-0 lg:border-r flex flex-col gap-8 w-full lg:w-5/12">
                                    <div className="flex flex-col gap-3">
                                      {
                                        storeData?.logo && storeData.logo !== ''
                                          ? <Image src={storeData.logo} alt={`Imagen logo ${storeData.name}`} width={200} height={150} className='w-40' />
                                          : storeData?.logoWhite && storeData.logoWhite !== ''
                                            ? <Image src={storeData.logoWhite} alt={`Imagen logo ${storeData.name}`} width={200} height={150} className='w-40' />
                                            : ''
                                      }
                                      {
                                        calls.find(call => call._id === design.popup?.content)
                                          ? (
                                            <>
                                              <p className="text-xl font-semibold">{calls.find(call => call._id === design.popup?.content)?.nameMeeting}</p>
                                              <div className="flex gap-2">
                                                <svg className="w-5 text-gray-500" data-id="details-item-icon" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 3.269V5l1.759 2.052" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                                <p className="text-gray-500">{calls.find(call => call._id === design.popup?.content)?.duration}</p>
                                              </div>
                                            </>
                                          )
                                          : <p>No has seleccionado una llamada</p>
                                      }
                                    </div>
                                    {
                                      calls.find(call => call._id === design.popup?.content) && calls.find(call => call._id === design.popup?.content)?.description !== ''
                                        ? (
                                          <div className="flex flex-col gap-3">
                                            <p className="font-medium">Descripción:</p>
                                            <div className="flex flex-col gap-2">
                                              {
                                                calls.find(call => call._id === design.popup?.content)?.description?.split('\n').map(text => <p key={text}>{text}</p>)
                                              }
                                            </div>
                                          </div>
                                        )
                                        : ''
                                    }
                                  </div>
                                  <div className="p-6 w-full lg:w-7/12">
                                    <Calendar newClient={clientData} setNewClient={setClientData} call={calls.find(call => call._id === design.popup?.content)!} tags={calls.find(call => call._id === design.popup?.content)?.tags!} meeting={calls.find(call => call._id === design.popup?.content)?.nameMeeting!} payment={payment} style={style} />
                                  </div>
                                </div>
                              )
                              : forms?.find(form => form._id === design.popup?.content)
                              ? (
                                <form className="flex w-full" onSubmit={async (e: any) => {
                                  e.preventDefault()
                                  if (!loading) {
                                    setLoading(true)
                                    setError('')
                                    
                                    const form = forms.find(form => form._id === design.popup?.content)
                                    let valid = true
                                    let errorMessage = ''
                                
                                    // Función para obtener el valor del campo desde client o client.data
                                    const getClientValue = (name: string) => clientData[name] || clientData.data?.find(dat => dat.name === name)?.value;
                                
                                    form?.labels.forEach(label => {
                                      const value = getClientValue(label.data)
                                      
                                      if (label.data && (!value || value.trim() === '')) {
                                        valid = false
                                        errorMessage = `Por favor, completa el campo ${label.text || label.name}.`
                                      }
                                    })
                                
                                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    if (clientData.email && !emailRegex.test(clientData.email)) {
                                      valid = false
                                      errorMessage = 'Por favor, ingresa un correo electrónico válido.'
                                    }
                                
                                    if (!valid) {
                                      setError(errorMessage)
                                      setLoading(false)
                                      return
                                    }

                                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, clientData)
                                    const newEventId = new Date().getTime().toString()
                                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/lead`, {
                                      firstName: clientData.firstName,
                                      lastName: clientData.lastName,
                                      email: clientData.email,
                                      phone: clientData.phone,
                                      data: clientData.data,
                                      form: clientData.forms![0].form,
                                      fbc: Cookies.get('_fbc'),
                                      fbp: Cookies.get('_fbp'),
                                      page: pathname,
                                      eventId: newEventId
                                    })
                                    if (typeof fbq === 'function') {
                                      fbq('track', 'Lead', {
                                        first_name: clientData.firstName,
                                        last_name: clientData.lastName,
                                        email: clientData.email,
                                        phone: clientData.phone && clientData.phone !== '' ? `56${clientData.phone}` : undefined,
                                        fbp: Cookies.get('_fbp'),
                                        fbc: Cookies.get('_fbc'),
                                        content_name: clientData.services?.length && clientData.services[0].service !== '' ? clientData.services[0].service : undefined,
                                        contents: { id: clientData.services?.length && clientData.services[0].service !== '' ? clientData.services[0].service : undefined, quantity: 1 },
                                        event_source_url: `${process.env.NEXT_PUBLIC_WEB_URL}${pathname}`
                                      }, { eventID: newEventId })
                                    }
                                    if (form?.action === 'Ir a una pagina') {
                                      localStorage.setItem('popup', design.popup?.title!)
                                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                                      setTimeout(() => {
                                        setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
                                      }, 200);
                                      router.push(form.redirect!)
                                    } else if (form?.action === 'Mostrar mensaje') {
                                      setMessage(form.message!)
                                    }
                                    setLoading(false)
                                  }
                                }}>
                                  <div className="flex flex-col gap-4 h-fit m-auto w-full p-6 max-w-[500px]" style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', color: '#111111', backgroundColor: '#ffffff' }}>
                                    {
                                      message !== ''
                                        ? <p className='text-lg text-center font-medium'>{message}</p>
                                        : (
                                          <>
                                            {
                                              error !== ''
                                                ? <p className='px-2 py-1 bg-red-500 text-white w-fit'>{error}</p>
                                                : ''
                                            }
                                            <p className="text-xl font-medium text-center" style={{ color: style.primary }}>{forms?.find(form => form._id === design.popup?.content)?.title}</p>
                                            {
                                              forms?.find(form => form._id === design.popup?.content)?.informations.map(information => (
                                                <div key={information.text} className="flex gap-2">
                                                  <div
                                                    className="my-auto"
                                                    dangerouslySetInnerHTML={{ __html: information.icon }}
                                                  />
                                                  <div className="flex flex-col my-auto">
                                                    <p>{information.text}</p>
                                                    {
                                                      information.subText && information.subText !== ''
                                                        ? <p className="text-gray-400">{information.subText}</p>
                                                        : ''
                                                    }
                                                  </div>
                                                </div>
                                              ))
                                            }
                                            {
                                              forms?.find(form => form._id === design.popup?.content)?.labels.map(label => (
                                                <div key={label._id} className="flex flex-col gap-2">
                                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                                  <Input
                                                    style={style}
                                                    placeholder={label.name}
                                                    value={clientData.data?.find(dat => dat.name === label.name)?.value || clientData[label.data]}
                                                    inputChange={(e: any) => {
                                                      if (label.data === 'firstName' || label.data === 'lastName' || label.data === 'email' || label.data === 'phone') {
                                                        setClientData({ ...clientData, [label.data]: e.target.value })
                                                      } else if (Array.isArray(clientData.data)) {
                                                        const oldData = [...clientData.data];
                                                        const existingData = oldData.find(dat => dat.name === label.name);
                
                                                        if (existingData) {
                                                          existingData.value = e.target.value;
                                                        } else {
                                                          oldData.push({ name: label.data, value: e.target.value });
                                                        }
                
                                                        setClientData({ ...clientData, data: oldData });
                                                      } else {
                                                        setClientData({ ...clientData, data: [{ name: label.data, value: e.target.value }] });
                                                      }
                                                    }}
                                                  />
                                                </div>
                                              ))
                                            }
                                            <Button type='submit' config='w-full' style={style} loading={loading}>{forms?.find(form => form._id === design.popup?.content)?.button}</Button>
                                          </>
                                        )
                                    }
                                  </div>
                                </form>
                              )
                              : ''
                            : ''
                        }
                        {
                          design.popup.buttonText && design.popup.buttonText !== '' && design.popup.buttonLink && design.popup.buttonLink !== ''
                            ? <Button action={(e: any) => {
                              e.preventDefault()
                              localStorage.setItem('popup', design.popup?.title!)
                              router.push(design.popup!.buttonLink!)
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                              setTimeout(() => {
                                setPopup({ ...popup, view: 'hidden', opacity: 'opacity-0' })
                              }, 200);
                            }}>{design.popup.buttonText}</Button>
                            : ''
                        }
                      </>
                    )
                }
              </div>
            </div>
          )
          : ''
      }
      {
        funnels.find(funnel => funnel.steps.find(step => step.slug && step.slug !== '' ? `/${step.slug}` === pathname : false)) || services.find(service => service.steps.find(step => step.slug && step.slug !== '' ? `/${step.slug}` === pathname : false)) || pathname.includes('/llamadas')
          ? (
            <div className='flex flex-col justify-between min-h-screen'>
              { children }
              <div className='w-full p-6 flex flex-col gap-4' style={{ backgroundColor: design.footer?.bgColor && design.footer.bgColor !== '' ? design.footer.bgColor : '#111111', color: design.footer?.textColor && design.footer.textColor !== '' ? design.footer.textColor : '#ffffff' }}>
                {
                  storeData?.logoWhite
                    ? <Link href='/' target='_blank'><Image className='w-48 h-auto m-auto' src={storeData.logoWhite} alt='Logo' width={320} height={150} /></Link>
                    : <Link href='/' target='_blank' className='text-white text-3xl font-medium m-auto'>SITIO WEB</Link>
                }
                {
                  (politics?.privacy && politics.privacy !== '') || (politics?.terms && politics.terms !== '')
                    ? (
                      <div className='flex gap-4 m-auto'>
                        {
                          politics.terms && politics.terms !== ''
                            ? <Link className='block text-sm mb-1' href='/terminos-y-condiciones'>Terminos y condiciones</Link>
                            : ''
                        }
                        {
                          politics.privacy && politics.privacy !== ''
                            ? <Link className='block text-sm mb-1' href='/politica-de-privacidad'>Política de privacidad</Link>
                            : ''
                        }
                        {
                          politics.devoltions && politics.devoltions !== ''
                            ? <Link className='block text-sm mb-1' href='/politica-de-devoluciones'>Política de devoluciones</Link>
                            : ''
                        }
                        {
                          politics.shipping && politics.shipping !== ''
                            ? <Link className='block text-sm mb-1' href='/politica-de-envios'>Política de envíos</Link>
                            : ''
                        }
                        {
                          politics.pay && politics.pay !== ''
                            ? <Link className='block text-sm mb-1' href='/politica-de-pagos'>Política de pagos</Link>
                            : ''
                        }
                      </div>
                    )
                    : ''
                }
                {
                  design.footer?.funnelText && design.footer.funnelText !== ''
                    ? <p className='text-sm text-center m-auto' style={{ color: `${design.footer.textColor}80` }}>{design.footer.funnelText}</p>
                    : ''
                }
              </div>
            </div>
          )
          : (
            <Navbar design={design} storeData={storeData} politics={politics} style={style} categories={categories} products={products}>
              <div className="h-[58px] sm:h-[54px]" />
              { children }
            </Navbar>
          )
      }
      <div className='bottom-4 right-4 flex flex-col gap-2 fixed w-14 z-50' style={{ height: design.chatView ? design.instagram ? design.whatsapp ? '180px' : '120px' : design.whatsapp ? '120px' : '60px' : design.instagram ? design.whatsapp ? '120px' : '60px' : '0px' }}>
        {
          design.whatsapp && storeData?.phone && storeData.phone !== ''
            ? (
              <button area-label='Chatea con nosotros por Whatsapp' id='whatsapp' className={`${viewWhatsapp ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 z-50 w-14 h-14 flex bg-[#25D366] rounded-full`} onClick={() => window.open(`https://wa.me/+56${storeData.phone}`, '_blank')}>
                <svg className='m-auto text-white' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
              </button>
            )
            : ''
        }
        {
          design.instagram && storeData.instagram && storeData.instagram !== ''
            ? (
              <button area-label='Visita nuestro Instagram' id='instagram' className={`${viewInstagram ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 z-50 w-14 h-14 flex rounded-full bg-cover bg-center`} style={{ backgroundImage: "url('/fondo-instagram.png')" }} onClick={() => window.open(storeData.instagram)}>
                <svg className='m-auto text-white' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="35px" width="35px" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg>
              </button>
            )
            : ''
        }
        {
          design.chatView
            ? <Chat style={style} storeData={storeData} design={design} viewChat={viewChat} />
            : ''
        }
      </div>
    </>
  )
}
