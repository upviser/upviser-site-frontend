"use client"
import { IDesign, IForm, IPayment, IPlan, IService } from '@/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Check, H1, H2, P } from '../ui'
import { NumberFormat } from '@/utils'
import { PopupPlans } from './PopupPlans'

interface Props {
    content: IDesign
    services: IService[]
    index: number
    payment: IPayment
    step?: string
    style?: any
    forms?: IForm[]
    integrations: any
}

export const Plans: React.FC<Props> = ({ content, services, index, payment, step, style, forms, integrations }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [plan, setPlan] = useState<IPlan>()
  const [typePrice, setTypePrice] = useState('Mensual')
  const [isDragging, setIsDragging] = useState(false)
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [plan1Loaded, setPlan1Loaded] = useState(false);
  const [plan2Loaded, setPlan2Loaded] = useState(false);
  const [plan3Loaded, setPlan3Loaded] = useState(false);
  const [plan4Loaded, setPlan4Loaded] = useState(false);
  const [plan5Loaded, setPlan5Loaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const plan1Ref = useRef(null);
  const plan2Ref = useRef(null);
  const plan3Ref = useRef(null);
  const plan4Ref = useRef(null);
  const plan5Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setTitleLoaded(true);
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
            setDescriptionLoaded(true);
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
            setPlan1Loaded(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 1 }
    );

    if (plan1Ref.current) {
      observer.observe(plan1Ref.current);
    }

    return () => {
      if (plan1Ref.current) {
        observer.unobserve(plan1Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPlan2Loaded(true);
          }, 400);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 1 }
    );

    if (plan2Ref.current) {
      observer.observe(plan2Ref.current);
    }

    return () => {
      if (plan2Ref.current) {
        observer.unobserve(plan2Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPlan3Loaded(true);
          }, 500);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 1 }
    );

    if (plan3Ref.current) {
      observer.observe(plan3Ref.current);
    }

    return () => {
      if (plan3Ref.current) {
        observer.unobserve(plan3Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPlan4Loaded(true);
          }, 600);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 1 }
    );

    if (plan4Ref.current) {
      observer.observe(plan4Ref.current);
    }

    return () => {
      if (plan4Ref.current) {
        observer.unobserve(plan4Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPlan5Loaded(true);
          }, 700);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 1 }
    );

    if (plan5Ref.current) {
      observer.observe(plan5Ref.current);
    }

    return () => {
      if (plan5Ref.current) {
        observer.unobserve(plan5Ref.current);
      }
    };
  }, []);

  return (
    <>
      <PopupPlans popup={popup} setPopup={setPopup} plan={plan} services={services} payment={payment} content={content} step={step} style={style} typePrice={typePrice} forms={forms} integrations={integrations} />
      <div onMouseUp={() => setIsDragging(false)} className={`py-10 md:py-20 px-4 m-auto w-full flex`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}`, color: content.info.textColor }}>
        <div className='flex flex-col gap-8 m-auto w-full max-w-[1280px]'>
          <div className='flex flex-col gap-4'>
          {
            content.info.title && content.info.title !== ''
              ? (
                <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                  {
                    index === 0
                      ? <H1 text={content.info.title} color={content.info.textColor} config='text-center' />
                      : <H2 text={content.info.title} color={content.info.textColor} config='text-center' />
                  }
                </div>
              )
              : ''
          }
          {
            content.info.description && content.info.description !== ''
              ? (
                <div ref={descriptionRef} className={`${descriptionLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                  <P text={content.info.description} color={content.info.textColor} config='text-center' />
                </div>
              )
              : ''
          }
          {
            services?.find(service => service._id === content.service?.service)?.typePrice === 'Suscripción'
              ? (
                <div className='m-auto p-1 rounded-full' style={{ border: `1px solid ${style.borderColor}` }}>
                  <button onClick={() => setTypePrice('Mensual')} className={`px-2 py-1 rounded-full`} style={{ backgroundColor: typePrice === 'Mensual' ? style.primary : '', color: typePrice === 'Mensual' ? style.button : '' }}>Mensual</button>
                  <button onClick={() => setTypePrice('Anual')} className={`px-2 py-1 rounded-full`} style={{ backgroundColor: typePrice === 'Anual' ? style.primary : '', color: typePrice === 'Anual' ? style.button : '' }}>Anual {Math.round(100 - Number(services?.find(service => service._id === content.service?.service)?.plans?.plans[0].anualPrice) * 100 / (Number(services?.find(service => service._id === content.service?.service)?.plans?.plans[0].price) * 12)) }%</button>
                </div>
              )
              : ''
          }
          </div>
          {
            services?.find(service => service._id === content.service?.service)?.plans?.plans.length
              ? (
                <div className='flex gap-6 justify-around flex-wrap'>
                  {
                    services?.find(service => service._id === content.service?.service)?.plans?.plans.map((plan, index) => (
                      <div className={`${index === 0 ? plan1Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 1 ? plan2Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 2 ? plan3Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 3 ? plan4Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 4 ? plan5Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : ''} transition-all duration-500 p-6 flex flex-col gap-4 w-full max-w-96 justify-between`} key={plan._id} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', backgroundColor: content.info.image }}>
                        <div className='flex flex-col gap-4'>
                          <p className='text-center font-medium text-xl'>{plan.name}</p>
                          <div className='flex gap-2 w-fit m-auto'>
                            <p className='text-center font-bold text-3xl'>${NumberFormat(Number(typePrice === 'Mensual' ? plan.price : plan.anualPrice))}</p>
                            <p ref={index === 0 ? plan1Ref : index === 1 ? plan2Ref : index === 2 ? plan3Ref : index === 3 ? plan4Ref : index === 4 ? plan5Ref : ''} className='my-auto'>{services?.find(service => service._id === content.service?.service)?.typePrice === 'Suscripción' ? `/ ${typePrice === 'Mensual' ? 'Mes' : 'Anual'}` : ''}</p>
                          </div>
                          {
                            plan.characteristics?.length
                              ? (
                                <>
                                  <p className='font-medium text-lg'>{index === 0 ? 'Funcionalidades:' : `Todo lo anterior más:`}</p>
                                  <div className='flex flex-col gap-2'>
                                    {
                                      plan.characteristics?.map(characteristic => characteristic ? <div key={characteristic} className='flex gap-2'><Check config='my-auto' style={style} /><p>{characteristic}</p></div> : '')
                                    }
                                  </div>
                                </>
                              )
                              : ''
                          }
                        </div>
                        <Button config='w-full' action={(e: any) => {
                          e.preventDefault()
                          setPlan(plan)
                          setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                          setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                          }, 10)
                        }} style={style}>Me interesa este plan</Button>
                      </div>
                    ))
                  }
                </div>
              )
              : ''
          }
        </div>
      </div>
    </>
  )
}
