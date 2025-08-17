import Products from "@/components/categories/Products"
import { ContactPage } from "@/components/contact"
import { Block1, Block2, Block3, Block4, Block5, Lead1, Video, Call, Block7, Calls, Checkout, Lead2, Plans, Faq, Lead3, Table, Blocks, Form, Reviews, SliderImages } from "@/components/design"
import { Slider } from "@/components/home"
import Categories from "@/components/home/Categories"
import { H1, Subscribe } from "@/components/ui"
import Cate from '@/components/categories/Categories'
import Prod from '@/components/home/Products'
import Image from 'next/image'
import { Metadata } from "next"
import { ICategory } from "@/interfaces"

export const revalidate = 3600

async function fetchCategory (category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category}`)
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
  return res.json()
}

async function fetchProductsCategory (category: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products-category/${category}`)
  return res.json()
}

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchCalls () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calls`)
  return res.json()
}

async function fetchForms () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forms`)
  return res.json()
}

async function fetchServices () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`)
  return res.json()
}

async function fetchStoreData () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store-data`)
  return res.json()
}

async function fetchPayment () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment`)
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`)
  return res.json()
}

async function fetchIntegrations () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`)
  return res.json()
}

export async function generateMetadata({
  params
}: {
  params: { category: string }
}): Promise<Metadata> {

  const id = params.category
  const category: ICategory = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, { next: { revalidate: 3600 } }).then((res) => res.json())
 
  return {
    title: category.titleSeo !== '' ? category.titleSeo : category.category,
    description: category.descriptionSeo !== '' ? category.descriptionSeo : `Esta es la pagina de la categoria ${category.category}`,
    openGraph: {
      title: category.titleSeo !== '' ? category.titleSeo : category.category,
      description: category.descriptionSeo !== '' ? category.descriptionSeo : `Esta es la pagina de la categoria ${category.category}`,
      images: [category.image!],
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/tienda/${category.slug}`
    }
  }
}

export default async function CategoryPage({ params }: { params: { category: string } }) {

  const category = await fetchCategory(params.category)

  const categoriesData = fetchCategories()

  const productsCategoryData = fetchProductsCategory(category.category)

  const designData = fetchDesign()

  const callsData = fetchCalls()

  const formsData = fetchForms()

  const servicesData = fetchServices()

  const storeDataData = fetchStoreData()

  const paymentData = fetchPayment()

  const styleData = fetchStyle()

  const integrationsData = fetchIntegrations()

  const [categories, productsCategory, design, calls, forms, services, storeData, payment, style, integrations] = await Promise.all([categoriesData, productsCategoryData, designData, callsData, formsData, servicesData, storeDataData, paymentData, styleData, integrationsData])

  return (
    <div className="flex flex-col">
      {
        design?.categoryPage[0].design?.map((content: any, index: any) => {
          if (content.content === 'Carrusel') {
            return <Slider key={content.content} info={content.info} index={index} forms={forms} calls={calls} design={design} payment={payment} style={style} storeData={storeData} />
          } else if (content.content === 'Bloque 1') {
            return <Block1 key={content.content} content={content} index={index} forms={forms} calls={calls} design={design} payment={payment} style={style} storeData={storeData} />
          } else if (content.content === 'Bloque 2') {
            return <Block2 key={content.content} content={content} index={index} forms={forms} calls={calls} design={design} payment={payment} style={style} storeData={storeData} />
          } else if (content.content === 'Bloque 3') {
            return <Block3 key={content.content} content={content} index={index} forms={forms} calls={calls} design={design} payment={payment} style={style} storeData={storeData} />
          } else if (content.content === 'Bloque 4') {
            return <Block4 key={content.content} content={content} index={index} forms={forms} calls={calls} design={design} payment={payment} style={style} storeData={storeData} />
          } else if (content.content === 'Bloque 5') {
            return <Block5 key={content.content} content={content} index={index} forms={forms} calls={calls} design={design} payment={payment} style={style} storeData={storeData} />
          } else if (content.content === 'Contacto') {
            return <ContactPage key={content.content} info={ content.info } index={index} style={style} />
          } else if (content.content === 'Suscripción') {
            return <Subscribe key={content.content} info={ content.info } style={style} />
          } else if (content.content === 'Lead 1') {
            return <Lead1 key={content.content} content={content} forms={forms} index={index} services={services} style={style} />
          } else if (content.content === 'Video') {
            return <Video key={content.content} content={content} index={index} storeData={storeData} />
          } else if (content.content === 'Agendar llamada') {
            return <Call key={content.content} calls={calls} content={content} services={services} payment={payment} storeData={storeData} index={index} style={style} />
          } else if (content.content === 'Bloque 7') {
            return <Block7 key={content.content} content={content} />
          } else if (content.content === 'Llamadas') {
            return <Calls key={content.content} content={content} calls={calls} style={style} index={index} />
          } else if (content.content === 'Checkout') {
            return <Checkout key={content.content} content={content} services={services} payment={payment} storeData={storeData} style={style} index={index} integrations={integrations} />
          } else if (content.content === 'Lead 2') {
            return <Lead2 key={content.content} content={content} forms={forms} index={index} services={services} storeData={storeData} style={style} />
          } else if (content.content === 'Planes') {
            return <Plans key={content.content} content={content} services={services} index={index} payment={payment} style={style} forms={forms} integrations={integrations} />
          } else if (content.content === 'Preguntas frecuentes') {
            return <Faq key={content.content} content={content} services={services} index={index} style={style} />
          } else if (content.content === 'Lead 3') {
            return <Lead3 key={content.content} content={content} services={services} index={index} style={style} forms={forms} storeData={storeData} />
          } else if (content.content === 'Tabla comparativa') {
            return <Table key={content.content} content={content} services={services} index={index} payment={payment} style={style} integrations={integrations} />
          } else if (content.content === 'Bloques') {
            return <Blocks key={content.content} content={content} index={index} style={style} storeData={storeData} />
          } else if (content.content === 'Formulario') {
            return <Form key={content.content} content={content} index={index} style={style} forms={forms} />
          } else if (content.content === 'Reseñas') {
            return <Reviews key={content.content} content={content} index={index} />
          } else if (content.content === 'Carrusel de imagenes') {
            return <SliderImages key={content.content} content={content} index={index} style={style} />
          } else if (content.content === 'Categorias') {
            if (categories.length) {
              return <Categories key={content.content} info={content.info} style={style} content={content} categories={categories} />
            }
          } else if (content.content === 'Productos') {
            if (productsCategory.length) {
              return <Products key={content.content} products={ productsCategory } style={style} content={content} />
            }
          } else if (content.content === 'Categorias 2') {
            return <Cate key={content.content} categories={categories} style={style} content={content} />
          } else if (content.content === 'Carrusel productos') {
            if (productsCategory.length) {
              return <Prod key={content.content} products={productsCategory} title={content.info.title!} filter={content.info.products!} categories={categories} style={style} content={content} />
            }
          } else if (content.content === 'Bloque 6') {
            return (
              <div key={content.content} className="w-full flex">
                <div className={`${category.image ? 'h-64 xl:h-80 2xl:h-96 text-white' : 'pt-10 pb-2'} w-full max-w-[1360px] m-auto flex flex-col gap-2`}>
                  <div className="m-auto flex flex-col gap-2">
                    <H1 text={category.category} config="text-center font-semibold" />
                    <p className="text-center">{category.description}</p>
                  </div>
                </div>
                {
                  category.banner
                    ? <Image className={`absolute -z-10 w-full object-cover h-64 xl:h-80 2xl:h-96`} src={category.banner} alt='Banner categoria' width={1920} height={1080} />
                    : ''
                }
              </div>
            )
          }
        })
      }
    </div>
  )
}