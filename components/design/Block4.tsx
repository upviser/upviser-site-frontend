"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Button, H1, H2, H3, P } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { Design, ICall, IDesign, IForm, IPayment, IStoreData } from '@/interfaces'
import { PopupPage } from './PopupPage'

export const Block4 = ({ content, index, calls, forms, design, payment, style, storeData }: { content: IDesign, index: any, forms: IForm[], calls: ICall[], design: Design, payment: IPayment, style?: any, storeData: IStoreData }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [cont, setCont] = useState('')
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [block1Loaded, setBlock1Loaded] = useState(false);
  const [block2Loaded, setBlock2Loaded] = useState(false);
  const [block3Loaded, setBlock3Loaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const titleRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  const imageRef = useRef(null);

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
            setBlock1Loaded(true);
          }, 200);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block1Ref.current) {
      observer.observe(block1Ref.current);
    }

    return () => {
      if (block1Ref.current) {
        observer.unobserve(block1Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock2Loaded(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block2Ref.current) {
      observer.observe(block2Ref.current);
    }

    return () => {
      if (block2Ref.current) {
        observer.unobserve(block2Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock3Loaded(true);
          }, 400);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block3Ref.current) {
      observer.observe(block3Ref.current);
    }

    return () => {
      if (block3Ref.current) {
        observer.unobserve(block3Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setImageLoaded(true);
          }, 500);
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
        <div className="w-full text-center max-w-[1280px] m-auto flex flex-col gap-6">
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
          <div className="flex gap-4 flex-col md:flex-row">
            <div ref={block1Ref} className={`${block1Loaded ? 'opacity-1' : 'opacity-0 translate-x-6'} transition-all duration-500 w-full flex flex-col gap-3 md:w-1/3`}>
              {
                content.info.subTitle && content.info.subTitle !== ''
                  ? index === 0
                    ? <H2 text={content.info.subTitle} color={content.info.textColor} />
                    : <H3 text={content.info.subTitle} color={content.info.textColor} />
                  : ''
              }
              {
                content.info.description && content.info.description !== ''
                  ? <P text={content.info.description} color={content.info.textColor} />
                  : ''
              }
              {
                (content.info.buttonLink === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink) || forms.find(form => form._id === content.info.buttonLink)) || (content.info.buttonLink !== '' || content.info.button !== '')
                  ? content.info.buttonLink === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink) || forms.find(form => form._id === content.info.buttonLink)
                    ? <Button action={(e: any) => {
                      e.preventDefault()
                      setCont(content.info.buttonLink!)
                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                      setTimeout(() => {
                        setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                      }, 10);
                    }} config='mx-auto lg:m-0' style={style}>{content.info.button}</Button>
                    : content.info.buttonLink === '' || content.info.button === ''
                      ? ''
                      : <Link href={`${content.info.buttonLink}`} className='mx-auto lg:m-0'><Button style={style}>{content.info.button}</Button></Link>
                  : ''
              }
            </div>
            <div ref={block2Ref} className={`${block2Loaded ? 'opacity-1' : 'opacity-0 translate-x-6'} transition-all duration-500 w-full flex flex-col gap-3 md:w-1/3`}>
              {
                content.info.subTitle2 && content.info.subTitle2 !== ''
                  ? index === 0
                    ? <H2 text={content.info.subTitle2} color={content.info.textColor} />
                    : <H3 text={content.info.subTitle2} color={content.info.textColor} />
                  : ''
              }
              {
                content.info.description2 && content.info.description2 !== ''
                  ? <P text={content.info.description2} color={content.info.textColor} />
                  : ''
              }
              {
                (content.info.buttonLink2 === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink2) || forms.find(form => form._id === content.info.buttonLink2)) || (content.info.buttonLink2 !== '' || content.info.button2 !== '')
                  ? content.info.buttonLink2 === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink2) || forms.find(form => form._id === content.info.buttonLink2)
                    ? <Button action={(e: any) => {
                      e.preventDefault()
                      setCont(content.info.buttonLink2!)
                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                      setTimeout(() => {
                        setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                      }, 10);
                    }} config='mx-auto lg:m-0' style={style}>{content.info.button2}</Button>
                    : content.info.buttonLink2 === '' || content.info.button2 === ''
                      ? ''
                      : <Link href={`${content.info.buttonLink2}`} className='mx-auto lg:m-0'><Button style={style}>{content.info.button2}</Button></Link>
                  : ''
              }
            </div>
            <div ref={block3Ref} className={`${block3Loaded ? 'opacity-1' : 'opacity-0 translate-x-6'} transition-all duration-500 w-full flex flex-col gap-3 md:w-1/3`}>
              {
                content.info.subTitle3 && content.info.subTitle3 !== ''
                  ? index === 0
                    ? <H2 text={content.info.subTitle3} color={content.info.textColor} />
                    : <H3 text={content.info.subTitle3} color={content.info.textColor} />
                  : ''
              }
              {
                content.info.description3 && content.info.description3 !== ''
                  ? <P text={content.info.description3} color={content.info.textColor} />
                  : ''
              }
              {
                (content.info.buttonLink3 === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink3) || forms.find(form => form._id === content.info.buttonLink3)) || (content.info.buttonLink3 !== '' || content.info.button3 !== '')
                  ? content.info.buttonLink3 === 'Abrir popup' || calls.find(call => call._id === content.info.buttonLink3) || forms.find(form => form._id === content.info.buttonLink3)
                    ? <Button action={(e: any) => {
                      e.preventDefault()
                      setCont(content.info.buttonLink3!)
                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                      setTimeout(() => {
                        setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                      }, 10);
                    }} config='mx-auto lg:m-0' style={style}>{content.info.button3}</Button>
                    : content.info.buttonLink3 === '' || content.info.button3 === ''
                      ? ''
                      : <Link href={`${content.info.buttonLink3}`} className='mx-auto lg:m-0'><Button style={style}>{content.info.button3}</Button></Link>
                  : ''
              }
            </div>
          </div>
          {
            content.info?.image && content.info.image !== ''
              ? <Image ref={imageRef} className={`${imageLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 h-fit m-auto max-w-[700px] w-full`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} width={1400} height={1000} alt='Imagen slider prueba' src={content.info.image} />
              : ''
          }
        </div>
      </div>
    </>
  )
}
