"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import styles from "./Slider.module.css"
import { Navigation, Pagination } from "swiper/modules"
import Link from "next/link"
import Image from 'next/image'
import { Button, H1, H2, P } from "../ui"
import { Design, ICall, IClient, IForm, IInfo, IPayment, IStoreData } from "@/interfaces"
import { useEffect, useRef, useState } from "react"
import { PopupPage } from "../design"

export const Slider = ({ info, index, forms, calls, design, payment, style, storeData }: { info: IInfo, index: any, forms: IForm[], calls: ICall[], design: Design, payment: IPayment, style?: any, storeData?: IStoreData }) => {

  const [popup, setPopup] = useState({ view: 'hidden', opacity: 'opacity-0', mouse: false })
  const [content, setContent] = useState('')
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [buttonLoaded, setButtonLoaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

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
      <PopupPage popup={popup} setPopup={setPopup} content={content} design={design} calls={calls} forms={forms} payment={payment} />
      <div className="z-0">
        <Swiper
          className={styles.mySwiper}
          slidesPerView={1}
          loop={true}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Navigation]}
        >
          {
            info.banner
              ? info.banner.map((banner, index) => (
                <SwiperSlide key={banner.title}>
                  <div className={`flex h-[450px] md:h-[550px] 2xl:h-[700px]`}>
                    <div className="m-auto w-full p-4">
                      <div className='max-w-[1280px] w-full m-auto flex flex-col gap-3'>
                        {
                          banner.title && banner.title !== ''
                            ? (
                              <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                                {
                                  index === 0
                                    ? <H1 config={`text-white font-semibold ${banner.type === 'Izquierda' ? '' : 'text-center'}`} text={banner.title} color={info.textColor} />
                                    : <H2 config={`text-white font-semibold ${banner.type === 'Izquierda' ? '' : 'text-center'}`} text={banner.title} color={info.textColor} />
                                }
                              </div>
                            )
                            : ''
                        }
                        {
                          banner.description && banner.description !== ''
                            ? (
                              <div ref={descriptionRef} className={`${descriptionLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                                <P text={banner.description} config={`text-white ${banner.type === 'Izquierda' ? '' : 'text-center'}`} color={info.textColor} />
                              </div>
                            )
                            : ''
                        }
                        {
                          (banner.buttonLink === 'Abrir popup' || calls.find(call => call._id === banner.buttonLink) || forms.find(form => form._id === banner.buttonLink)) || (banner.buttonLink !== '' && banner.button !== '')
                            ? (
                              <div ref={buttonRef} className={`${buttonLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 ${banner.type === 'Izquierda' ? '' : 'm-auto'}`}>
                                {
                                  banner.buttonLink === 'Abrir popup' || calls.find(call => call._id === banner.buttonLink) || forms.find(form => form._id === banner.buttonLink)
                                    ? <Button action={(e: any) => {
                                      e.preventDefault()
                                      setContent(banner.buttonLink!)
                                      setPopup({ ...popup, view: 'flex', opacity: 'opacity-0' })
                                      setTimeout(() => {
                                        setPopup({ ...popup, view: 'flex', opacity: 'opacity-1' })
                                      }, 10);
                                    }} style={style}>{banner.button}</Button>
                                    : banner.buttonLink !== '' || banner.button !== ''
                                      ? banner.buttonLink === 'Abrir Whatsapp'
                                        ? <button className={`w-fit flex text-center py-2 px-6 font-medium`} style={{ backgroundColor: style.primary, color: style.button, borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} onClick={() => window.open(`https://wa.me/+56${storeData?.phone}`)}>{banner.button}</button>
                                        : <Link href={`${banner.buttonLink}`}><Button style={style}>{banner.button}</Button></Link>
                                      : ''
                                }
                              </div>
                            )
                            : ''
                        }
                      </div>
                    </div>
                    <Image width={1920} height={1080} className={`absolute object-cover h-full w-full -z-10`} src={banner.image!} alt='banner' />
                  </div>
                </SwiperSlide>
              ))
              : ''
          }
        </Swiper>
      </div>
    </>
  )
}