"use client"
import { IDesign, IStoreData } from '@/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import { Button, H1, H2, H3, LinkButton, P } from '../ui'
import Image from 'next/image'

interface Props {
    content: IDesign
    index: number
    style?: any
    storeData?: IStoreData
}

export const Blocks: React.FC<Props> = ({ content, index, style, storeData }) => {
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [block1Loaded, setBlock1Loaded] = useState(false);
  const [block2Loaded, setBlock2Loaded] = useState(false);
  const [block3Loaded, setBlock3Loaded] = useState(false);
  const [block4Loaded, setBlock4Loaded] = useState(false);
  const [block5Loaded, setBlock5Loaded] = useState(false);
  const [block6Loaded, setBlock6Loaded] = useState(false);
  const [block7Loaded, setBlock7Loaded] = useState(false);
  const [block8Loaded, setBlock8Loaded] = useState(false);
  const [block9Loaded, setBlock9Loaded] = useState(false);
  const [block10Loaded, setBlock10Loaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const block3Ref = useRef(null);
  const block4Ref = useRef(null);
  const block5Ref = useRef(null);
  const block6Ref = useRef(null);
  const block7Ref = useRef(null);
  const block8Ref = useRef(null);
  const block9Ref = useRef(null);
  const block10Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTitleLoaded(true);
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
          }, 100);
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
          }, 250);
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
          }, 300);
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
          }, 350);
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
          }, 400);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock6Loaded(true);
          }, 450);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block6Ref.current) {
      observer.observe(block6Ref.current);
    }

    return () => {
      if (block6Ref.current) {
        observer.unobserve(block6Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock7Loaded(true);
          }, 500);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block7Ref.current) {
      observer.observe(block7Ref.current);
    }

    return () => {
      if (block7Ref.current) {
        observer.unobserve(block7Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock8Loaded(true);
          }, 550);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block8Ref.current) {
      observer.observe(block8Ref.current);
    }

    return () => {
      if (block8Ref.current) {
        observer.unobserve(block8Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock9Loaded(true);
          }, 600);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block9Ref.current) {
      observer.observe(block9Ref.current);
    }

    return () => {
      if (block9Ref.current) {
        observer.unobserve(block9Ref.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setBlock10Loaded(true);
          }, 650);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (block10Ref.current) {
      observer.observe(block10Ref.current);
    }

    return () => {
      if (block10Ref.current) {
        observer.unobserve(block10Ref.current);
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
        <div className="flex flex-col gap-3">
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
        </div>
        {
          content.info.blocks?.length
            ? (
              <div className='flex gap-6 justify-around flex-wrap'>
                {content.info.blocks?.map((block, i) => (
                  <div
                    key={i}
                    ref={i === 0 ? block1Ref : i === 1 ? block2Ref : i === 2 ? block3Ref : i === 3 ? block4Ref : i === 4 ? block5Ref : i === 5 ? block6Ref : i === 6 ? block7Ref : i === 7 ? block8Ref : i === 8 ? block9Ref : i === 9 ? block10Ref : null}
                    className={`${i === 0 ? block1Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 1 ? block2Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 2 ? block3Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 3 ? block4Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 4 ? block5Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 5 ? block6Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 6 ? block7Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 7 ? block8Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 8 ? block9Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : i === 9 ? block10Loaded ? 'opacity-1' : 'opacity-0 translate-y-6' : ''} transition-all duration-500 flex flex-col p-6 w-full max-w-96 min-h-48 lg:min-h-56`}
                    style={{
                      boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '',
                      borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '',
                      border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '',
                      backgroundColor: content.info.image
                    }}
                  >
                    <div className='flex flex-col gap-2 m-auto'>
                      {
                        block.image && block.image !== ''
                          ? <Image className='w-full sm:h-52' src={block.image} alt={`Imagen del bloque de ${block.title}`} width={1000} height={800} style={{ boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '', borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} />
                          : ''
                      }
                      {block.title && block.title !== "" ? (
                        index === 0 ? (
                            <H2 text={block.title} color={content.info.textColor} config="text-center font-semibold" />
                        ) : (
                            <H3 text={block.title} color={content.info.textColor} config="text-center font-semibold" />
                        )
                        ) : (
                        ""
                      )}
                      <P text={block.description} color={content.info.textColor} config='text-center' />
                      {
                        block.buttonLink && block.buttonLink !== '' && block.buttonText && block.buttonText !== ''
                          ? block.buttonLink === 'Abrir Whatsapp'
                            ? <button className={`m-auto w-fit flex text-center py-2 px-6 font-medium`} style={{ backgroundColor: style.primary, color: style.button, borderRadius: style.form === 'Redondeadas' ? `${style.borderButton}px` : '' }} onClick={() => window.open(`https://wa.me/+56${storeData?.phone}?text=${block.title}`)}>{block.buttonText}</button>
                            : <LinkButton url={block.buttonLink} style={style} config='mx-auto'>{block.buttonText}</LinkButton>
                          : ''
                      }
                    </div>
                  </div>
                ))}
              </div>
            )
            : ''
        }
      </div>
    </div>
  );
};