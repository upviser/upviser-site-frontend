"use client"
import { ICategory, IDesign, IProduct } from "@/interfaces"
import SliderProducts from "./SliderProducts"
import { H2 } from "../ui"
import { useEffect, useRef, useState } from "react"

export default function Products({ products, title, filter, categories, product, style, content }: { products: IProduct[], title: string, filter: string, categories: ICategory[], product?: IProduct, style: any, content: IDesign }) {

  const [productsFilter, setProductsFilter] = useState(products)
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
      { threshold: 0.5 }
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

  const filterProducts = () => {
    let prod = products
    if (filter === 'Todos') {
      if (product) {
        prod = products.filter(produ => produ._id !== product?._id)
      }
      setProductsFilter(prod)
    } else if (filter === 'Productos en oferta') {
      if (product) {
        prod = products.filter(produ => produ._id !== product?._id)
      }
      prod = prod.filter(product => product.beforePrice)
      setProductsFilter(prod)
    } else if (filter === 'Productos con que contengan algun tag' && product) {
      const productsTag = products.filter(producto => producto.tags.some(tag => product.tags.includes(tag)))
      const productsFinal = productsTag.filter(prod => prod._id !== product._id)
      setProductsFilter(productsFinal)
    } else {
      if (product) {
        prod = products.filter(produ => produ._id !== product?._id)
      }
      prod = prod.filter(product => product.category.category === filter)
      setProductsFilter(prod)
    }
  }

  useEffect(() => {
    filterProducts()
  }, [])

  return (
    <div className="w-full flex px-4 py-4" style={{
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
        <H2 ref={titleRef} config={`${titleLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`} text={title} />
        <div ref={categoriesRef} className={`${categoriesLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500`}>
          <SliderProducts products={productsFilter} style={style} />
        </div>
      </div>
    </div>
  )
}