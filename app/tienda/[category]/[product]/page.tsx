import PageProduct from "@/components/products/PageProduct"
import { Design, ICategory, IProduct } from "@/interfaces"
import type { Metadata } from 'next'
import { Slider } from "@/components/home/Slider"
import { ContactPage } from "@/components/contact"
import { Subscribe } from "@/components/ui"
import { Block1, Block2, Block3, Block4, Block5, Lead1, Video, Call, Block7, Calls, Checkout, Lead2, Plans, Faq, Lead3, Table, Blocks, Form, Reviews, SliderImages } from "@/components/design"
import Cate from '@/components/categories/Categories'
import Prod from '@/components/home/Products'
import Categories from "@/components/home/Categories"
import Products from "@/components/categories/Products"

export const revalidate = 3600

async function fetchProduct (product: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product}`)
  return res.json()
}

async function fetchDesign () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/design`)
  return res.json()
}

async function fetchProducts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
  return res.json()
}

async function fetchCategories () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
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
  params: { product: string }
}): Promise<Metadata> {

  const id = params.product
  const product: IProduct = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, { next: { revalidate: 3600 } }).then((res) => res.json())
 
  return {
    title: product.titleSeo !== '' ? product.titleSeo : product.name,
    description: product.descriptionSeo !== '' ? product.descriptionSeo : `Esta es la pagina del producto ${product.name}`,
    openGraph: {
      title: product.titleSeo !== '' ? product.titleSeo : product.name,
      description: product.descriptionSeo !== '' ? product.descriptionSeo : `Esta es la pagina del producto ${product.name}`,
      images: [product.images[0]],
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/tienda/${product.category.slug}/${product.slug}`
    }
  }
}

export default async function ({ params }: { params: { product: string } }) {

  const productData = fetchProduct(params.product)

  const designData = fetchDesign()

  const productsData = fetchProducts()

  const categoriesData = fetchCategories()

  const callsData = fetchCalls()

  const formsData = fetchForms()

  const servicesData = fetchServices()

  const storeDataData = fetchStoreData()

  const paymentData = fetchPayment()

  const styleData = fetchStyle()

  const integrationsData = fetchIntegrations()

  const [product, design, products, categories, calls, forms, services, storeData, payment, style, integrations] = await Promise.all([productData, designData, productsData, categoriesData, callsData, formsData, servicesData, storeDataData, paymentData, styleData, integrationsData])

  return (
    <div className="flex flex-col">
      <PageProduct product={product} design={design} products={products} categories={categories} style={style} integrations={integrations} />
      {
        design?.productPage[0].design?.map((content: any, index: any) => {
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
            if (products.length) {
              return <Products key={content.content} products={products} style={style} content={content} />
            }
          } else if (content.content === 'Categorias 2') {
            return <Cate key={content.content} categories={categories} style={style} content={content} />
          } else if (content.content === 'Carrusel productos') {
            if (products.length) {
              return <Prod key={content.content} products={products} title={content.info.title!} filter={content.info.products!} categories={categories} style={style} content={content} />
            }
          }
        })
      }
    </div>
  )
}