"use client"
import Link from "next/link"
import Image from 'next/image'
import { ICategory } from "@/interfaces"
import { useState } from "react"
import { H2, H3, P } from "../ui"

export default function CategoryCard({ category, title, style }: { category: ICategory, title: string, style: any }) {
  
  const [mouse, setMouse] = useState(false)
  
  return (
    <Link onMouseEnter={() => setMouse(true)} onMouseLeave={() => setMouse(false)} href={`/tienda/${category.slug}`} key={category._id} className="flex max-w-[400px] m-auto flex-row gap-4 w-full lg:flex-col">
      <div className="relative rounded-xl overflow-hidden w-1/2 lg:w-full">
        <Image className={`${mouse ? 'scale-110' : 'scale-100'} transition-transform duration-150 rounded-xl w-full h-auto`} width={500} height={500} src={category.image!} alt={`Imagen de la categoria ${category.category}`} />
      </div>
      <div className="flex flex-col gap-2 m-auto lg:m-0 w-1/2 lg:w-full">
        {
          title === 'H2'
            ? <H2 text={category.category} />
            : title === 'H3'
              ? <H3 text={category.category} />
              : ''
        }
        <p>{category.description}</p>
      </div>
    </Link>
  )
}