"use client"
import { IDesign, IService } from '@/interfaces'
import React, { useEffect, useRef, useState } from 'react'
import { H1, H2, P } from '../ui'

interface Props {
    content: IDesign
    index: number
    style?: any
    services?: IService[]
}

export const Faq: React.FC<Props> = ({ content, index, style, services }) => {
  const [question, setQuestion] = useState(-1);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [descriptionLoaded, setDescriptionLoaded] = useState(false);
  const [faqLoaded, setFaqLoaded] = useState(false);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const faqRef = useRef(null);

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
            setFaqLoaded(true);
          }, 300);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (faqRef.current) {
      observer.observe(faqRef.current);
    }

    return () => {
      if (faqRef.current) {
        observer.unobserve(faqRef.current);
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
          content.info.faq?.length
            ? (
              <div className={`${faqLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 flex flex-col gap-6`}>
                {content.info.faq?.map((faq, i) => (
                  <div
                    key={i}
                    ref={i === 0 ? faqRef : null}
                    className={`flex flex-col transition-all duration-500`}
                    style={{
                      padding: question === i ? "24px" : "24px 24px 12px",
                      boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '',
                      gap: question === i ? "16px" : "8px",
                      borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '',
                      border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '',
                      color: content.info.textColor,
                      backgroundColor: content.info.image
                    }}
                  >
                    <div
                      className="flex gap-6 justify-between cursor-pointer"
                      onClick={(e: any) => {
                        e.preventDefault();
                        toggleQuestion(i);
                      }}
                    >
                      <p className="font-medium text-lg">{faq.question}</p>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        className={`my-auto min-w-6 text-2xl transition-transform duration-300 ${
                          question === i ? "rotate-180" : ""
                        }`}
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
                      </svg>
                    </div>
                    <div
                      ref={(el) => (contentRefs.current[i] = el)}
                      className={`overflow-hidden transition-all duration-300`}
                      style={{
                        maxHeight: getMaxHeight(i),
                        marginTop: question === i ? "8px" : "0",
                      }}
                    >
                      <p className="mt-2">{faq.response}</p>
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