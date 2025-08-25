"use client"
import { IDesign, IPayment, IPlan, IService } from '@/interfaces'
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
    integrations: any
}

export const Table: React.FC<Props> = ({ content, services, index, payment, step, style, integrations }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [plan, setPlan] = useState<IPlan>()
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [tableLoaded, setTableLoaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const tableRef = useRef(null);

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
            setTableLoaded(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (tableRef.current) {
      observer.observe(tableRef.current);
    }

    return () => {
      if (tableRef.current) {
        observer.unobserve(tableRef.current);
      }
    };
  }, []);

  return (
    <>
      <PopupPlans popup={popup} setPopup={setPopup} plan={plan} services={services} payment={payment} content={content} step={step} style={style} integrations={integrations} />
      <div className={`py-10 md:py-20 px-4 m-auto w-full flex`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}`, color: content.info.textColor }}>
        <div className='flex flex-col gap-8 m-auto w-full max-w-[1280px]'>
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
            services?.find(service => service._id === content.service?.service)?.plans?.plans.length
              ? (
                <div className={`${tableLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 overflow-x-auto w-full`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', backgroundColor: content.info.image }}>
                  <table className={`min-w-full table-auto rounded-xl`}>
                    <thead ref={tableRef}>
                      <tr>
                        <th className='px-4 py-5 text-left font-medium'>Funcionalidades</th>
                        {
                          services?.find(service => service._id === content.service?.service)?.plans?.plans.map((plan, idx) => (
                            <th key={plan._id} className='px-4 py-5 text-center font-medium'>{plan.name}</th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        services?.find(service => service._id === content.service?.service)?.plans?.functionalities.map((functionality, index) => (
                          <tr key={index}>
                            <td className='p-4' style={{ borderTop: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>{functionality}</td>
                            {
                              services?.find(service => service._id === content.service?.service)?.plans?.plans.map((plan) => (
                                <td key={plan._id} className={`p-4 text-center`} style={{ borderTop: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                                  {
                                    // Buscar si la funcionalidad existe en el plan
                                    plan.functionalities?.some(f => f.name === functionality)
                                      ? (
                                        // Si la funcionalidad existe, muestra el valor de la funcionalidad
                                        plan.functionalities?.find(f => f.name === functionality)?.value === 'Si' ? <Check config='m-auto' style={style} /> : plan.functionalities?.find(f => f.name === functionality)?.value
                                      ) 
                                      : '✘'
                                  }
                                </td>
                              ))
                            }
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              )
              : ''
          }
        </div>
      </div>
    </>
  )
}
