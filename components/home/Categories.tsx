"use client"
import { ICategory, IDesign, IInfo } from "@/interfaces"
import CategoryCard from "../categories/CategoryCard"
import { H2 } from "../ui"
import { useEffect, useRef, useState } from "react"

export default function Categories({ info, style, content, categories }: { info: IInfo, style: any, content: IDesign, categories: ICategory[] }) {

  const [titleLoaded, setTitleLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const titleRef = useRef(null);
  const categoriesRef = useRef(null);

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
            setCategoriesLoaded(true);
          }, 200);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (categoriesRef.current) {
      observer.observe(categoriesRef.current);
    }

    return () => {
      if (categoriesRef.current) {
        observer.unobserve(categoriesRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full flex px-4 py-10 md:py-20" style={{
      background: `${
        content.info.typeBackground === "Degradado"
          ? content.info.background
          : content.info.typeBackground === "Color"
          ? content.info.background
          : ""
      }`,
      color: content.info.textColor
    }}>
      <div className="w-full max-w-[1280px] m-auto flex flex-col gap-4">
        {
          info.title
            ? <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}><H2 text={info.title} config="text-center font-semibold" /></div>
            : ''
        }
        <div ref={categoriesRef} className={`${categoriesLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 flex flex-col gap-4 justify-between lg:flex-row`}>
          {
            info.descriptionView
              ? categories.map(category => (
                <CategoryCard key={category._id} category={category} title={"H3"} style={style} />
              ))
              : categories.map(category => (
                <CategoryCard key={category._id} category={category} title={"H2"} style={style} />
              ))
          }
        </div>
      </div>
    </div>
  )
}