"use client"
import { IClient, IDesign, IForm, IService } from '@/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import { Button, H1, H2, Input, P, Select } from '../ui'
import axios from 'axios'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
    content: IDesign
    index: number
    style?: any
    forms?: IForm[]
    step?: string
    services?: IService[]
}

declare const fbq: Function

export const Form: React.FC<Props> = ({ content, index, style, forms, step, services }) => {
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [client, setClient] = useState<IClient>({ email: '', tags: forms?.find(form => form._id === content.form)?.tags, forms: [{ form: forms?.find(form => form._id === content.form)?._id! }] })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [formLoaded, setFormLoaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const formRef = useRef(null);

  const router = useRouter()
  const pathname = usePathname()

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
            setFormLoaded(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const toggleQuestion = (i: number) => {
    setQuestion(question === i ? -1 : i);
  };

  const getMaxHeight = (i: number): string => {
    if (contentRefs.current[i]) {
      return question === i ? `${contentRefs.current[i]?.scrollHeight}px` : "0px";
    }
    return "0px";
  };

  const getClientValue = (name: string) => client[name] || client.data?.find(dat => dat.name === name)?.value;

  return (
    <div
      className={`py-10 md:py-20 px-4 m-auto w-full flex`}
      style={{
        background: `${
          content.info.typeBackground === "Degradado"
            ? content.info.background
            : content.info.typeBackground === "Color"
            ? content.info.background
            : ""
        }`,
      }}
    >
      <div className='flex flex-col gap-8 w-full max-w-[1280px] m-auto'>
        {
          content.info.title && content.info.title !== ''
            ? (
              <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
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
              <div ref={descriptionRef} className={`${descriptionLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                <P text={content.info.description} color={content.info.textColor} config='text-center' />
              </div>
            )
            : ''
        }
        {
          content.form && content.form !== ''
            ? (
              <div className={`w-full flex`}>
                <form ref={formRef} className={`${formLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 flex w-full`} onSubmit={async (e: any) => {
                  e.preventDefault()
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

                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-by-step${pathname}`)
                    if (!res.data.message) {
                      const respo = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/funnel-name/${res.data}`)
                      const stepFind = respo.data.steps.find((ste: any) => ste.step === step)
                      const stepIndex = respo.data.steps.reverse().findIndex((ste: any) => ste.step === step)
                      const service = services?.find(service => service._id === respo.data.service)
                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { ...client, funnels: [{ funnel: respo.data._id, step: stepFind._id }], services: stepIndex === 0 ? service?._id ? [{ service: service._id, step: service.steps[0]._id }] : [] : [] })
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
                        service: service?._id,
                        funnel: respo.data._id,
                        step: stepFind._id,
                        page: pathname,
                        eventId: newEventId
                      })
                      if (typeof fbq === 'function') {
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
                      }
                    } else {
                      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, client)
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
                        page: pathname,
                        eventId: newEventId
                      })
                      if (typeof fbq === 'function') {
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
                      }
                    }

                    if (form?.action === 'Ir a una pagina') {
                      router.push(form.redirect!)
                    } else if (form?.action === 'Mostrar mensaje') {
                      setMessage(form.message!)
                    }
                  }
                }}>
                  <div className={`flex flex-col gap-4 h-fit m-auto w-full p-6 md:p-8 max-w-[500px] bg-white`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                    {
                      message !== ''
                        ? (
                          <>
                            <p className='text-xl font-medium'>Fomulario completado con exito</p>
                            <p>{message}</p>
                          </>
                        )
                        : (
                          <>
                            {
                              error !== ''
                                ? <p className='w-fit px-2 py-1 bg-red-500 text-white m-auto'>{error}</p>
                                : ''
                            }
                            {
                              forms?.find(form => form._id === content.form)?.title !== ''
                                ? <p className="text-xl font-medium text-center" style={{ color: style.primary }}>{forms?.find(form => form._id === content.form)?.title}</p>
                                : ''
                            }
                            {
                              forms?.find(form => form._id === content.form)?.informations.map(information => (
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
                              forms?.find(form => form._id === content.form)?.labels.map(label => (
                                <div key={label._id} className="flex flex-col gap-2">
                                  <p>{label.text !== '' ? label.text : label.name}</p>
                                  {
                                    label.type === 'Texto' && (
                                      <Input
                                        style={style}
                                        placeholder={label.name}
                                        value={getClientValue(label.data)} // Usamos la función getClientValue
                                        inputChange={(e: any) => {
                                          if (['firstName', 'lastName', 'email', 'phone'].includes(label.data)) {
                                            setClient({ ...client, [label.data]: e.target.value })
                                          } else if (Array.isArray(client.data)) {
                                            const oldData = [...client.data]
                                            const existingData = oldData.find(dat => dat.name === label.data)
                                            if (existingData) {
                                              existingData.value = e.target.value
                                            } else {
                                              oldData.push({ name: label.data, value: e.target.value })
                                            }
                                            setClient({ ...client, data: oldData })
                                          } else {
                                            setClient({ ...client, data: [{ name: label.data, value: e.target.value }] })
                                          }
                                        }}
                                      />
                                    )
                                  }
                                  {
                                    label.type === 'Selector' && (
                                      <Select
                                        selectChange={(e: any) => {
                                          if (['firstName', 'lastName', 'email', 'phone'].includes(label.data)) {
                                            setClient({ ...client, [label.data]: e.target.value })
                                          } else if (Array.isArray(client.data)) {
                                            const oldData = [...client.data]
                                            const existingData = oldData.find(dat => dat.name === label.data)
                                            if (existingData) {
                                              existingData.value = e.target.value
                                            } else {
                                              oldData.push({ name: label.data, value: e.target.value })
                                            }
                                            setClient({ ...client, data: oldData })
                                          } else {
                                            setClient({ ...client, data: [{ name: label.data, value: e.target.value }] })
                                          }
                                        }}
                                        value={getClientValue(label.data)} // Usamos la función getClientValue
                                        style={style}
                                      >
                                        <option>Seleccionar opción</option>
                                        {label.datas?.map(data => <option key={data}>{data}</option>)}
                                      </Select>
                                    )
                                  }
                                </div>
                              ))
                            }
                            <Button type='submit' config='w-full' loading={loading} style={style}>{forms?.find(form => form._id === content.form)?.button}</Button>
                          </>
                        )
                    }
                  </div>
                </form>
              </div>
            )
            : ''
        }
      </div>
    </div>
  );
};