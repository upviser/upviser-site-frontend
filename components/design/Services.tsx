"use client"
import { IDesign, IService } from '@/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import { H1, H2, LinkButton, P } from '../ui'

interface Props {
    content: IDesign
    services: IService[]
    index: number
    style?: any
}

export const Services: React.FC<Props> = ({ content, services, index, style }) => {

  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [block1Loaded, setBlock1Loaded] = useState(false);
  const [block2Loaded, setBlock2Loaded] = useState(false);
  const [block3Loaded, setBlock3Loaded] = useState(false);
  const [block4Loaded, setBlock4Loaded] = useState(false);
  const [block5Loaded, setBlock5Loaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  const block4Ref = useRef(null);
  const block5Ref = useRef(null);

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
            setBlock1Loaded(true);
          }, 300);
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
          }, 400);
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
          }, 500);
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
            setBlock4Loaded(true);
          }, 600);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block4Ref.current) {
      observer.observe(block4Ref.current);
    }

    return () => {
      if (block4Ref.current) {
        observer.unobserve(block4Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock5Loaded(true);
          }, 700);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block5Ref.current) {
      observer.observe(block5Ref.current);
    }

    return () => {
      if (block5Ref.current) {
        observer.unobserve(block5Ref.current);
      }
    };
  }, []);

  return (
    <div className={`py-10 md:py-20 flex px-4 m-auto w-full`} style={{ background: `${content.info.typeBackground === 'Degradado' ? content.info.background : content.info.typeBackground === 'Color' ? content.info.background : ''}` }}>
      <div className='flex flex-col gap-8 w-full max-w-[1280px] m-auto'>
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
          content.services?.length
            ? (
              <div className='flex gap-8 flex-wrap justify-center'>
                {
                  content.services.filter(service => services.find(servi => servi._id === service.service)).map((service, index) => {
                    const serviceFind = services?.find(servi => servi._id === service.service)
                    if (serviceFind) {
                      return (
                        <div ref={index === 0 ? block1Ref : index === 1 ? block2Ref : index === 2 ? block3Ref : index === 3 ? block4Ref : index === 4 ? block5Ref : ''} key={service.service} className={`${index === 0 ? block1Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 1 ? block2Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 2 ? block3Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 3 ? block4Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : index === 4 ? block5Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : ''} transition-all duration-500 flex flex-col gap-2 p-4 w-[350px] min-h-60 justify-center`} style={{ boxShadow: style.design === 'Sombreado' ? '0px 3px 20px 3px #11111110' : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }}>
                          {
                            index === 0
                              ? <h2 className={`text-center font-semibold text-xl lg:text-3xl`} style={{ color: content.info.textColor }}>{serviceFind.name}</h2>
                              : <h3 className={`text-center font-semibold text-lg lg:text-2xl`} style={{ color: content.info.textColor }}>{serviceFind.name}</h3>
                          }
                          <p className='text-center'>{serviceFind.description}</p>
                          <LinkButton style={style} url={service.url} config='mx-auto'>Ver más información</LinkButton>
                        </div>
                      )
                    }
                  })
                }
              </div>
            )
            : ''
        }
      </div>
    </div>
  )
}
