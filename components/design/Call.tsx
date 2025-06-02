"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Calendar, H1, H2, P } from '../ui'
import { ICall, IClient, IDesign, IPayment, IService, IStoreData } from '@/interfaces'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { NumberFormat } from '@/utils'
import Link from 'next/link'
import Image from 'next/image'

export const Call = ({ calls, content, step, services, payment, storeData, index, style }: { calls: ICall[], content: IDesign, step?: string, services: IService[], payment: IPayment, storeData?: IStoreData, index: number, style?: any }) => {

  const [newClient, setNewClient] = useState<IClient>({ email: '', meetings: [{ meeting: calls.find(call => call._id === content.meeting)?._id! }] })
  const [calendar, setCalendar] = useState(false)
  const [viewLogo, setViewLogo] = useState(false)
  const [viewLogo2, setViewLogo2] = useState(false)
  const [title, setTitle] = useState(false)
  const [description, setDescription] = useState(false)
  const [view, setView] = useState(false)

  const refLogo = useRef(null)
  const refLogo2 = useRef(null)
  const titleRef = useRef(null)
  const descriptionRef = useRef(null)
  const ref = useRef(null)

  const pathname = usePathname()

  const getFunnel = async () => {
    if (step) {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
      const stepFind = respo.data?.steps.find((ste: any) => ste.step === step)
      const stepIndex = respo.data.steps.reverse().findIndex((ste: any) => ste.step === step)
      const service = services?.find(service => service._id === respo.data?.service)
      if (res.data) {
        setNewClient({ ...newClient, funnels: [{ funnel: respo.data?._id, step: stepFind?._id }], services: service?._id ? stepIndex === 0 ? [{ service: service?._id, step: service.steps[0]._id }] : [{ service: service?._id }] : undefined })
      }
    }
  }

  useEffect(() => {
    getFunnel()
  }, [step])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewLogo(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (refLogo.current) {
      observer.observe(refLogo.current);
    }

    return () => {
      if (refLogo.current) {
        observer.unobserve(refLogo.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setViewLogo2(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (refLogo2.current) {
      observer.observe(refLogo2.current);
    }

    return () => {
      if (refLogo2.current) {
        observer.unobserve(refLogo2.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setTitle(true);
          }, 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => {
      if (titleRef.current) {
        observer.unobserve(titleRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setDescription(true);
          }, 200);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (descriptionRef.current) {
      observer.observe(descriptionRef.current);
    }

    return () => {
      if (descriptionRef.current) {
        observer.unobserve(descriptionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setView(true);
            setTimeout(() => {
              setCalendar(true)
            }, 100);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div className={`py-10 md:py-20 flex flex-col gap-16 px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className="w-full flex flex-col gap-8 max-w-[1280px] m-auto">
        {
          content.info.titleForm === 'Logo principal' && storeData?.logo && storeData.logo !== ''
            ? <Link ref={refLogo} href='/' target='_blank' className={`${viewLogo ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData?.logoWhite && storeData.logoWhite !== ''
              ? <Link ref={refLogo2} href='/' target='_blank' className={`${viewLogo2 ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        <div className='flex flex-col gap-3'>
          {
            content.info.title && content.info.title !== ''
              ? (
                <div ref={titleRef} className={`${title ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                  {
                    index === 0
                      ? <H1 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
                      : <H2 text={content.info.title} color={content.info.textColor} config='text-center font-semibold' />
                  }
                </div>
              )
              : ''
          }
          {
            content.info.description && content.info.description !== ''
              ? (
                <div ref={descriptionRef} className={`${description ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                  <P text={content.info.description} color={content.info.textColor} config='text-center' />
                </div>
              )
              : ''
          }
        </div>
        <div className={`m-auto w-full`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', color: content.info.textColor, backgroundColor: content.info.image }}>
          <div className="lg:flex">
            <div ref={ref} className="p-6 md:p-8 border-b border-black/5 lg:border-b-0 lg:border-r flex flex-col gap-8 w-full lg:w-5/12">
              <div className={`${view ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 flex flex-col gap-6 sticky top-20`}>
                <div className="flex flex-col gap-3">
                  {
                    storeData?.logo && storeData.logo !== '' && content.info.video === 'Logo'
                      ? <Image src={storeData.logo} alt={`Imagen logo ${storeData.name}`} width={200} height={150} className='w-40' />
                      : storeData?.logoWhite && storeData.logoWhite !== '' && content.info.video === 'Logo blanco'
                        ? <Image src={storeData.logoWhite} alt={`Imagen logo ${storeData.name}`} width={200} height={150} className='w-40' />
                        : ''
                  }
                  {
                    calls.find(call => call._id === content.meeting)
                      ? (
                        <>
                          <p className="text-xl font-semibold">{calls.find(call => call._id === content.meeting)?.title}</p>
                          <div className="flex gap-2">
                            <svg className="w-5" style={{ color: `${content.info.textColor}80` }} data-id="details-item-icon" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 3.269V5l1.759 2.052" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            <p style={{ color: `${content.info.textColor}80` }}>{calls.find(call => call._id === content.meeting)?.duration}</p>
                          </div>
                          {
                            calls.find(call => call._id === content.meeting)?.price
                              ? <p className='font-medium text-xl'>${NumberFormat(Number(calls.find(call => call._id === content.meeting)?.price))}</p>
                              : ''
                          }
                        </>
                      )
                      : <p>No has seleccionado una llamada</p>
                  }
                </div>
                {
                  calls.find(call => call._id === content.meeting)
                    ? (
                      <>
                        <p>Tipo: {calls.find(call => call._id === content.meeting)?.type?.map((typ, index) => index === 0 ? typ : ` - ${typ}`)}</p>
                        {
                          calls.find(call => call._id === content.meeting)?.description && calls.find(call => call._id === content.meeting)?.description !== ''
                            ? (
                              <div className="flex flex-col gap-3">
                                <p className="font-medium">Descripción:</p>
                                <div className="flex flex-col gap-2">
                                  {
                                    calls.find(call => call._id === content.meeting)?.description?.split('\n').map(text => <p key={text}>{text}</p>)
                                  }
                                </div>
                              </div>
                            )
                            : ''
                        }
                      </>
                    )
                    : ''
                }
                {
                  calls.find(call => call._id === content.meeting)?.type?.find(typ => typ === 'Visita al local')
                    ? (
                      <div className="flex flex-col gap-3">
                        <p className="font-medium">Dirección:</p>
                        <p>{calls.find(call => call._id === content.meeting)?.address}, {calls.find(call => call._id === content.meeting)?.city}, {calls.find(call => call._id === content.meeting)?.region}</p>
                      </div>
                    )
                    : ''
                }
              </div>
            </div>
            <div className={`${calendar ? 'opacity-1' : 'opacity-0'} transition-opacity duration-500 p-6 w-full lg:w-7/12`}>
              <Calendar newClient={newClient} setNewClient={setNewClient} call={calls.find(call => call._id === content.meeting)!} tags={calls.find(call => call._id === content.meeting)?.tags!} meeting={calls.find(call => call._id === content.meeting)?._id!} payment={payment} services={services} style={style} content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
