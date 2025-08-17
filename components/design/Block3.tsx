"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonSecondary, H1, H2, P } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { Design, ICall, IDesign, IForm, IPayment } from '@/interfaces'
import { PopupPage } from './PopupPage'

export const Block3 = ({ content, index, calls, forms, design, payment, style, storeData }: { content: IDesign, index: any, forms: IForm[], calls: ICall[], design: Design, payment: IPayment, style?: any, storeData?: any }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [cont, setCont] = useState('')
  const [viewLogo, setViewLogo] = useState(false)
  const [viewLogo2, setViewLogo2] = useState(false)
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [buttonLoaded, setButtonLoaded] = useState(false);

  const refLogo = useRef(null)
  const refLogo2 = useRef(null)
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

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
            setButtonLoaded(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setImageLoaded(true);
          }, 400);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []);

  return (
    <>
      <PopupPage popup={popup} setPopup={setPopup} content={cont} design={design} calls={calls} forms={forms} payment={payment} style={style} storeData={storeData} />
      <div key={content.content} className={`py-10 md:py-20 w-full flex px-4`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
        <div className="text-center m-auto max-w-[1100px] w-full flex flex-col gap-8">
          {
            content.info.titleForm === 'Logo principal' && storeData?.logo && storeData.logo !== ''
              ? <Link ref={refLogo} href='/' target='_blank' className={`${viewLogo ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : content.info.titleForm === 'Logo blanco' && storeData?.logoWhite && storeData.logoWhite !== ''
                ? <Link ref={refLogo2} href='/' target='_blank' className={`${viewLogo2 ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
                : ''
          }
          <div className='flex gap-4 flex-col'>
            {
              content.info.title && content.info.title !== ''
                ? (
                  <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                    {
                      index === 0
                        ? <H1 text={content.info.title} color={content.info.textColor} />
                        : <H2 text={content.info.title} color={content.info.textColor} />
                    }
                  </div>
                )
                : ''
            }
            {
              content.info.description && content.info.description !== ''
                ? (
                  <div ref={descriptionRef} className={`${descriptionLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                    <P text={content.info.description} color={content.info.textColor} />
                  </div>
                )
                : ''
            }
            {
              (content.info.buttonLink === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink) || forms.find(form => form._id === content.info.buttonLink)) || (content.info.buttonLink !== '' || content.info.button !== '')
                ? (
                  <div ref={buttonRef} className={`${buttonLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 flex`}>
                    <div className='w-fit m-auto flex gap-4 flex-wrap'>
                      {
                        content.info.buttonLink === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink) || forms.find(form => form._id === content.info.buttonLink)
                          ? <Button action={(e: any) => {
                            e.preventDefault()
                            setCont(content.info.buttonLink!)
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                            setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                            }, 10);
                          }} config='mx-auto lg:m-0' style={style}>{content.info.button}</Button>
                          : content.info.buttonLink !== '' || content.info.button !== ''
                            ? content.info.buttonLink === 'Abrir Whatsapp'
                              ? <button className={`w-fit flex text-center py-2 px-6 font-medium`} style={{ backgroundColor: style.primary, color: style.button, borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} onClick={() => window.open(`https://wa.me/+56${storeData?.phone}`)}>{content.info.button}</button>
                              : <Link href={`${content.info.buttonLink}`} className='mx-auto lg:m-0'><Button style={style}>{content.info.button}</Button></Link>
                            : ''
                      }
                      {
                        content.info.buttonLink2 === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink2) || forms.find(form => form._id === content.info.buttonLink2)
                          ? <ButtonSecondary action={(e: any) => {
                            e.preventDefault()
                            setCont(content.info.buttonLink2!)
                            setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                            setTimeout(() => {
                              setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                            }, 10);
                          }} config='mx-auto text-[#292929]' style={style} content={content}>{content.info.button2}</ButtonSecondary>
                          : content.info.buttonLink2 && content.info.buttonLink2 !== '' || content.info.button2 && content.info.button2 !== ''
                            ? <Link href={`${content.info.buttonLink2}`} className='mx-auto text-[#292929]'><ButtonSecondary style={style} content={content}>{content.info.button2}</ButtonSecondary></Link>
                            : ''
                      }
                    </div>
                  </div>
                )
                : ''
            }
          </div>
          {
            content.info?.image && content.info.image !== ''
              ? <Image ref={imageRef} className={`${imageLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 h-fit m-auto`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} width={700} height={500} alt='Imagen slider prueba' src={content.info.image} />
              : ''
          }
        </div>
      </div>
    </>
  )
}
