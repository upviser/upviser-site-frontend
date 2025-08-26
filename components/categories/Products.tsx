"use client"
import { IDesign, IProduct } from "@/interfaces"
import ProductCard from "../products/ProductCard"
import { useEffect, useRef, useState } from "react"
import { Select } from "../ui"

export default function Products({ products, style, content }: { products: IProduct[], style: any, content: IDesign }) {
  
  const [productsOrder, setProductsOrder] = useState<IProduct[]>(products)
  const [order, setOrder] = useState('Más recientes')

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

  const orderProducts = () => {
    if (order === 'Más recientes') {
      const before = [...productsOrder]
      before.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1)
      setProductsOrder(before)
    }
    if (order === 'Mayor precio') {
      const before = [...productsOrder]
      before.sort((a, b) => (a.price < b.price) ? 1 : -1)
      setProductsOrder(before)
    }
    if (order === 'Menor precio') {
      const before = [...productsOrder]
      before.sort((a, b) => (a.price > b.price) ? 1 : -1)
      setProductsOrder(before)
    }
  }

  useEffect(() => {
    orderProducts()
  }, [order])
  
  return (
    <div className="px-4 py-4 flex flex-col gap-4" style={{
      background: `${
        content.info.typeBackground === "Degradado"
          ? content.info.background
          : content.info.typeBackground === "Color"
          ? content.info.background
          : ""
      }`,
      color: content.info.textColor
    }}>
      <div className="w-full flex">
        <div ref={titleRef} className={`${titleLoaded ? 'opacity-1' : 'opacity-0'} transition-all duration-500 max-w-[1280px] w-full m-auto flex gap-4 justify-between flex-wrap`}>
          <button>Filtros</button>
          <Select value={order} selectChange={(e: any) => setOrder(e.target.value)} config="w-44 bg-transparent" style={style}>
            <option>Más recientes</option>
            <option>Mayor precio</option>
            <option>Menor precio</option>
          </Select>
        </div>
      </div>
      <div className="w-full flex px-4 mb-8">
        <div ref={categoriesRef} className={`${categoriesLoaded ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 max-w-[1360px] w-full m-auto flex gap-4 justify-between flex-wrap`}>
          {
            productsOrder.map(product => (
              <ProductCard key={product._id} product={product} style={style} />
            ))
          }
        </div>
      </div>
    </div>
  )
}