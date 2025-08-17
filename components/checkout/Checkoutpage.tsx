"use client"
import { useContext, useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import { Design, ICartProduct, IClient, IProduct, ISell, IShipping, IStoreData } from "@/interfaces"
import { useSession } from "next-auth/react"
import CartContext from "@/context/cart/CartContext"
import { useRouter } from "next/navigation"
import axios from "axios"
import { calcularPaquete, offer, verificarStockCarrito } from "@/utils"
import { ButtonPay, Data, EditData, EditShipping, Resume, ResumePhone, ShippingPay } from "."

declare const fbq: Function

interface Props {
  storeData: IStoreData
  chilexpress: any
  style: any
  payment?: any
  design : Design
  integrations: any
}

export const CheckoutPage: React.FC<Props> = ({ storeData, chilexpress, style, payment, design, integrations }) => {

  const {cart, setCart} = useContext(CartContext)
  
  const [sell, setSell] = useState<ISell>({
    firstName: Cookies.get('firstName') || '',
    lastName: Cookies.get('lastName') || '',
    email: Cookies.get('email') || '',
    address: Cookies.get('address') || '',
    number: Cookies.get('number') || '',
    region: Cookies.get('region') || '',
    city: Cookies.get('city') || '',
    cart: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart')!) : [],
    shipping: 0,
    pay: '',
    state: 'Pedido realizado',
    total: cart?.reduce((bef: any, curr: any) => bef + curr.price * curr.quantity, 0),
    fbp: Cookies.get('_fbp'),
    fbc: Cookies.get('_fbc'),
    shippingMethod: '',
    shippingState: '',
    subscription: false,
    phone: Number(Cookies.get('phone')) || undefined,
  })
  const [shipping, setShipping] = useState<IShipping[]>()
  const [saveData, setSaveData] = useState(false)
  const [contactView, setContactView] = useState('hidden')
  const [contactOpacity, setContactOpacity] = useState('opacity-0')
  const [contactMouse, setContactMouse] = useState(false)
  const [shippingView, setShippingView] = useState('hidden')
  const [shippingOpacity, setShippingOpacity] = useState('opacity-0')
  const [shippingMouse, setShippingMouse] = useState(false)
  const [clientId, setClientId] = useState('')
  const [link, setLink] = useState('')
  const [token, setToken] = useState('')
  const [url, setUrl] = useState('')
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [paymentFailed, setPaymentFailed] = useState(false)
  const [dest, setDest] = useState({ countyCoverageCode: '', streetName: '', serviceDeliveryCode: '' })
  const [streets, setStreets] = useState([])
  const [serviceTypeCode, setServiceTypeCode] = useState()

  const sellRef = useRef(sell)
  const initializationRef = useRef({ amount: cart?.reduce((bef: any, curr: any) => bef + curr.price * curr.quantity, 0) })
  const saveDataRef = useRef(false)
  const destRef = useRef({ countyCoverageCode: '', streetName: '', serviceDeliveryCode: '' })
  const serviceTypeCodeRef = useRef()

  const { data: session, status } = useSession()

  const user = session?.user as { firstName: string, lastName: string, email: string, _id: string }

  const router = useRouter()

  const getClientData = async () => {
    if (status === 'authenticated') {
      const resp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chilexpress`)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client-email/${user.email}`)
      const data: IClient = response.data
      if (data) {
        setSell({...sell, address: data.address ? data.address : '', city: data.city ? data.city : '', email: data.email, firstName: data.firstName ? data.firstName : '', lastName: data.lastName ? data.lastName : '', phone: data.phone ? Number(data.phone) : undefined, region: data.region ? data.region : '', total: cart?.reduce((bef: any, curr: any) => bef + curr.price * curr.quantity, 0), cart: cart!})
        sellRef.current = {...sell, address: data.address ? data.address : '', city: data.city ? data.city : '', email: data.email, firstName: data.firstName ? data.firstName : '', lastName: data.lastName ? data.lastName : '', phone: data.phone ? Number(data.phone) : undefined, region: data.region ? data.region : '', total: cart?.reduce((bef: any, curr: any) => bef + curr.price * curr.quantity, 0), cart: cart!}
        setClientId(data._id!)
      }
      if (data.city && data.region) {
        const res = await axios.get('https://testservices.wschilexpress.com/georeference/api/v1.0/regions', {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': resp.data.coberturaKey
          }
        })
        const regions = res.data.regions
        const region = regions?.find((region: any) => region.regionName === data.region)
        const response = await axios.get(`https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${region?.regionId}&type=0`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': resp.data.coberturaKey
          }
        })
        const citys = response.data.coverageAreas
        const city = citys?.find((city: any) => city.countyName === data.city)
        const dimentions = calcularPaquete(cart!)
        const request = await axios.post('https://testservices.wschilexpress.com/rating/api/v1.0/rates/courier', {
          "originCountyCode": storeData.locations![0].countyCoverageCode,
          "destinationCountyCode": city?.countyCode,
          "package": {
              "weight": dimentions.weight,
              "height": dimentions.height,
              "width": dimentions.width,
              "length": dimentions.length
          },
          "productType": 3,
          "contentType": 5,
          "declaredWorth": sell.cart.reduce((bef, curr) => curr.quantityOffers?.length ? bef + offer(curr) : bef + curr.price * curr.quantity, 0),
          "deliveryTime": 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': resp.data.cotizadorKey
          }
        })
        setShipping(request.data.data.courierServiceOptions)
        const respo = await axios.post('http://testservices.wschilexpress.com/georeference/api/v1.0/streets/search', {
          "countyName": city?.countyName,
          "streetName": sell.address,
          "pointsOfInterestEnabled": true,
          "streetNameEnabled": true,
          "roadType": 0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Ocp-Apim-Subscription-Key': resp.data.coberturaKey
          }
        })
        if (respo.data.streets.length) {
          if (respo.data.streets.length === 1) {
            setDest({ ...dest, streetName: respo.data.streets[0].streetName, countyCoverageCode: city?.countyCode })
          } else {
            setDest({ ...dest, countyCoverageCode: city?.countyCode })
            setStreets(respo.data.streets)
          }
        }
      }
    }
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/information`, { cart: cart, fbp: Cookies.get('_fbp'), fbc: Cookies.get('_fbc') })
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {contents: cart?.map(product => ({ id: product._id, quantity: product.quantity, category: product.category.category, item_price: product.price, title: product.name })), currency: "clp", value: cart!.reduce((bef, curr) => curr.quantityOffers?.length ? offer(curr) : bef + curr.price * curr.quantity, 0) + Number(sell.shipping), content_ids: cart?.map(product => product._id), event_id: res.data._id})
    }
  }

  useEffect(() => {
    if (integrations?.apiPixelId && integrations.apiPixelId !== '' && cart?.length) {
      const interval = setInterval(() => {
        if (typeof fbq === 'function') {
          getClientData()
          clearInterval(interval)
        }
      }, 100)
      
      return () => clearInterval(interval)
    } else {
      getClientData()
    }
  }, [])

  useEffect(() => {
    const limpiarCarrito = async () => {
      const cartGuardado = JSON.parse(localStorage.getItem("cart") || "[]");
      const carritoVerificado = await verificarStockCarrito(cartGuardado);
      setCart(carritoVerificado);
      setSell({ ...sell, cart: carritoVerificado })
      sellRef.current = { ...sell, cart: carritoVerificado }
      localStorage.setItem("cart", JSON.stringify(carritoVerificado));
      if (!carritoVerificado.length) {
        router.push('/carrito')
      }
    };

    limpiarCarrito();
  }, [])

  const inputChange = async (e: any) => {
    e.preventDefault()
    setSell({ ...sell, [e.target.name]: e.target.value, buyOrder: `${storeData?.name ? storeData.name : 'ORDEN'}${Math.floor(Math.random() * 10000) + 1}` })
    sellRef.current = { ...sell, [e.target.name]: e.target.value, buyOrder: `${storeData?.name ? storeData.name : 'ORDEN'}${Math.floor(Math.random() * 10000) + 1}` }
    if (e.target.name === 'pay' && e.target.value === 'WebPay Plus') {
      const pago = {
        amount: sell.total,
        returnUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/procesando-pago`
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/create`, pago)
      setToken(response.data.token)
      setUrl(response.data.url)
    } else if (e.target.name === 'pay' && e.target.value === 'MercadoPagoPro') {
      let products: any[] = []
      sell.cart.map((product: any) => {
        products = products.concat({ title: product.name, unit_price: product.price, quantity: product.quantity })
      })
      products = products.concat({ title: 'Envío', unit_price: Number(sell.shipping), quantity: 1 })
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/mercado-pago-create`, products)
      setLink(res.data.init_point)
    }
  }

  return (
    <>
      {
        ((chilexpress.active && chilexpress.coberturaKey !== '' && chilexpress.cotizadorKey !== '' && chilexpress.enviosKey !== '' && chilexpress.cardNumber !== '') && ((payment.transbank.active && payment.transbank.commerceCode !== '' && payment.transbank.apiKey !== '') || (payment.mercadoPago.active && payment.mercadoPago.accessToken !== '' && payment.mercadoPago.publicKey !== '') || (payment.mercadoPagoPro.active && payment.mercadoPagoPro.accessToken !== '' && payment.mercadoPagoPro.publicKey !== ''))) && storeData.locations?.length && storeData.locations[0].countyCoverageCode !== '' && storeData.locations[0].streetName !== '' && storeData.locations[0].streetNumber !== '' && storeData.nameContact !== ''
          ? (
            <div style={{ backgroundColor: design.checkoutPage.bgColor, color: design.checkoutPage.textColor }}>
              <EditData contactMouse={contactMouse} setContactOpacity={setContactOpacity} setContactView={setContactView} contactView={contactView} contactOpacity={contactOpacity} setContactMouse={setContactMouse} inputChange={inputChange} sell={sell} style={style} />
              <EditShipping shippingMouse={shippingMouse} setShippingOpacity={setShippingOpacity} setShippingView={setShippingView} shippingView={shippingView} shippingOpacity={shippingOpacity} setShippingMouse={setShippingMouse} sell={sell} inputChange={inputChange} setSell={setSell} setShipping={setShipping} chilexpress={chilexpress} style={style} sellRef={sellRef} />
              <ResumePhone cart={cart} sell={sell} style={style} design={design} />
              <div className='mt-28 flex p-4 xl:mt-0'>
                <form className='w-[1280px] m-auto block xl:flex' id='formBuy'>
                  <div className='w-full flex flex-col gap-6 pr-0 xl:w-7/12 xl:pr-8'>
                    {
                      paymentCompleted
                        ? (
                          <div className='flex flex-col gap-6 py-20'>
                            <svg className='m-auto' stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="100px" width="100px" xmlns="http://www.w3.org/2000/svg"><polygon fill="#8BC34A" points="24,3 28.7,6.6 34.5,5.8 36.7,11.3 42.2,13.5 41.4,19.3 45,24 41.4,28.7 42.2,34.5 36.7,36.7 34.5,42.2 28.7,41.4 24,45 19.3,41.4 13.5,42.2 11.3,36.7 5.8,34.5 6.6,28.7 3,24 6.6,19.3 5.8,13.5 11.3,11.3 13.5,5.8 19.3,6.6"></polygon><polygon fill="#CCFF90" points="34.6,14.6 21,28.2 15.4,22.6 12.6,25.4 21,33.8 37.4,17.4"></polygon></svg>
                            <p className='text-center mx-auto text-3xl font-medium'>Pago realizado con exito</p>
                            <p className='text-center mx-auto text-lg'>Recibiras un correo con toda la información.</p>
                          </div>
                        )
                        : paymentFailed
                          ? (
                            <div className='flex flex-col gap-6 py-20'>
                              <p className='text-center mx-auto text-3xl font-medium'>Pago fallido</p>
                              <p className='text-center mx-auto text-lg'>Vuelvelo a intentar más tarde.</p>
                            </div>
                          )
                          : (
                            <>
                              <h1 className="font-medium text-2xl sm:text-4xl">Finalizar compra</h1>
                              <Data status={status} sell={sell} setContactView={setContactView} setContactOpacity={setContactOpacity} setShippingView={setShippingView} setShippingOpacity={setShippingOpacity} inputChange={inputChange} setSell={setSell} setShipping={setShipping} chilexpress={chilexpress} style={style} design={design} sellRef={sellRef} dest={dest} setDest={setDest} streets={streets} setStreets={setStreets} />
                              <ShippingPay shipping={shipping} sell={sell} inputChange={inputChange} setSell={setSell} payment={payment} style={style} sellRef={sellRef} initializationRef={initializationRef} setServiceTypeCode={setServiceTypeCode} serviceTypeCodeRef={serviceTypeCodeRef} />
                              {
                                status === 'authenticated'
                                  ? ''
                                  : (
                                    <div className='flex gap-2 mb-4'>
                                      <input type='checkbox' checked={saveData} onChange={(e: any) => {
                                        if (e.target.checked) {
                                          setSaveData(true)
                                          saveDataRef.current = true
                                        } else {
                                          setSaveData(false)
                                          saveDataRef.current = false
                                        }
                                      }} />
                                      <span className='text-sm text-neutral-400'>Guardar datos para poder comprar más rapido la proxima vez</span>
                                    </div>
                                  )
                              }
                              <ButtonPay sell={sell} clientId={clientId} saveData={saveData} token={token} link={link} url={url} style={style} payment={payment} sellRef={sellRef} initializationRef={initializationRef} saveDataRef={saveDataRef} setPaymentCompleted={setPaymentCompleted} setPaymentFailed={setPaymentFailed} dest={dest} storeData={storeData} serviceTypeCode={serviceTypeCode} serviceTypeCodeRef={serviceTypeCodeRef} destRef={destRef} />
                            </>
                          )
                    }
                  </div>
                  <Resume cart={cart} sell={sell} style={style} design={design} />
                </form>
              </div>
            </div>
          )
          : (
            <div className="flex w-full h-full">
              <p className="text-xl m-auto">Pagina de pago no habilitada</p>
            </div>
          )
      }
    </>
  )
}