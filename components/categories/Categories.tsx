"use client"
import { ICategory, IDesign } from "@/interfaces"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react";

export default function Categories({ categories, style, content }: { categories: ICategory[], style: any, content: IDesign }) {
  
  const [titleLoaded, setTitleLoaded] = useState(false);

  const pathname = usePathname()

  const titleRef = useRef(null);

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
  
  return (
    <div className="w-full flex px-4 py-4 overflow-y-auto" style={{
      background: `${
        content.info.typeBackground === "Degradado"
          ? content.info.background
          : content.info.typeBackground === "Color"
          ? content.info.background
          : ""
      }`,
      color: content.info.textColor
    }}>
      <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 max-w-[1280px] m-auto flex gap-4`}>
        <Link className={`transition-colors duration-200 py-1 px-4 border`} style={{ border: pathname === '/tienda' ? `1px solid ${style?.primary}` : '', borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} href='/tienda'>Todos los productos</Link>
        {
          categories.map(category => (
            <Link key={category._id} className={`py-1 px-4 border transition-colors duration-200`} style={{ border: pathname === `/tienda/${category.slug}` ? `1px solid ${style?.primary}` : '', borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} href={`/tienda/${category.slug}`}>{ category.category }</Link>
          ))
        }
      </div>
    </div>
  )
}