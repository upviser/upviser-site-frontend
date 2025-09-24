"use client"
import React, { useEffect, useRef, useState } from 'react'
import { H1, H2 } from '../ui'
import Link from 'next/link'
import Image from 'next/image'
import { IStoreData } from '@/interfaces'

export const Video = ({ content, index, storeData, style }: { content: any, index: any, storeData?: IStoreData, style: any }) => {

  const [isLoaded, setIsLoaded] = useState(false);
  const [viewLogo, setViewLogo] = useState(false)
  const [viewLogo2, setViewLogo2] = useState(false)
  const [viewSubtitle, setViewSubtitle] = useState(false)
  const [viewTitle, setViewTitle] = useState(false)
  const [viewVideo, setViewVideo] = useState(false)

  const refLogo = useRef(null)
  const refLogo2 = useRef(null)
  const refSubtitle = useRef(null)
  const refTitle = useRef(null)
  const refVideo = useRef(null)

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
            setViewSubtitle(true);
          }, 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (refSubtitle.current) {
      observer.observe(refSubtitle.current);
    }

    return () => {
      if (refSubtitle.current) {
        observer.unobserve(refSubtitle.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setViewTitle(true);
          }, 200);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (refTitle.current) {
      observer.observe(refTitle.current);
    }

    return () => {
      if (refTitle.current) {
        observer.unobserve(refTitle.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setViewVideo(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    if (refTitle.current) {
      observer.observe(refTitle.current);
    }

    return () => {
      if (refTitle.current) {
        observer.unobserve(refTitle.current);
      }
    };
  }, []);

  return (
    <div className={`py-10 md:py-20 w-full p-4 flex`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='w-full max-w-[1280px] m-auto flex flex-col gap-6'>
        {
          content.info.titleForm === 'Logo principal' && storeData?.logo && storeData.logo !== ''
            ? <Link ref={refLogo} href='/' target='_blank' className={`${viewLogo ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logo} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
            : content.info.titleForm === 'Logo blanco' && storeData?.logoWhite && storeData.logoWhite !== ''
              ? <Link ref={refLogo2} href='/' target='_blank' className={`${viewLogo2 ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-fit m-auto`}><Image src={storeData.logoWhite} alt={`Logo ${storeData.name}`} width={320} height={150} className='w-44 m-auto lg:w-52' /></Link>
              : ''
        }
        {
          content.info.description && content.info.description !== ''
            ? <p ref={refSubtitle} className={`${viewSubtitle ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 text-white bg-main px-4 py-2 w-fit text-base lg:text-lg`}>{content.info.description}</p>
            : ''
        }
        {
          content.info.title && content.info.title !== ''
            ? (
              <div ref={refTitle} className={`${viewTitle ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
                {
                  index === 0
                    ? <H1 text={content.info.title} color={content.info.textColor} config='text-center' />
                    : <H2 text={content.info.title} color={content.info.textColor} config='text-center' />
                }
              </div>
            )
            : ''
        }
        <div ref={refVideo} className={`${viewVideo ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 max-w-[1000px] m-auto w-full`}><div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '' }}><iframe src={content.info.video} loading="lazy" onLoad={() => setIsLoaded(true)} style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '' }} allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;" allowFullScreen={true}></iframe></div></div>
      </div>
    </div>
  )
}
