"use client"
import Link from 'next/link'
import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Design, ICategory, IPolitics, IProduct, IStoreData } from '@/interfaces'
import { AccountLogin, LinkButton } from '../ui'
import Footer from '../ui/Footer'
import { SubPage } from './'
import CartContext from '@/context/cart/CartContext'
import { NavbarCart } from '../cart'

interface Props {
  design: Design
  storeData: IStoreData
  politics: IPolitics | undefined
  style?: any
  categories?: ICategory[]
  products?: IProduct[]
}

export const Navbar: React.FC<PropsWithChildren<Props>> = ({ children, design, storeData, politics, style, categories, products }) => {

  const [menu, setMenu] = useState('-ml-[350px]')
  const [index, setIndex] = useState('hidden')
  const [subPages, setSubPages] = useState(-1)
  const [view, setView] = useState(false)
  const [element1, setElement1] = useState(false)
  const [element2, setElement2] = useState(false)
  const [element3, setElement3] = useState(false)
  const [element4, setElement4] = useState(false)
  const [element5, setElement5] = useState(false)
  const [element6, setElement6] = useState(false)
  const [element7, setElement7] = useState(false)
  const [element8, setElement8] = useState(false)
  const [element9, setElement9] = useState(false)
  const [element10, setElement10] = useState(false)
  const [accountView, setAccountView] = useState('hidden')
  const [accountPosition, setAccountPosition] = useState('-mt-[400px]')
  const [accountPc, setAccountPc] = useState(true)
  const [account, setAccount] = useState('Ingresar')
  const [navCategoriesOpacity, setNavCategoriesOpacity] = useState('-mt-[330px]')
  const [categoriesPhone, setCategoriesPhone] = useState(0)
  const [rotate, setRotate] = useState('rotate-90')
  const [mouseEnter, setMouseEnter] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  const {cart, cartPc, cartPosition, cartView, setCartPc, setCartPosition, setCartView} = useContext(CartContext)

  const categoriesPhoneRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setView(true)
  }, [])

  useEffect(() => {
    if (categoriesPhoneRef.current) {
      setCategoriesPhone(rotate === '-rotate-90' ? 120 * categories!.length : 0)
    }
  }, [rotate])

  return (
    <>
      <div className='w-full min-h-screen flex flex-col justify-between'>
      <div>
      {
        pathname !== '/finalizar-compra'
          ? design.header?.topStrip && design.header.topStrip !== ''
            ? (
              <div className='flex pl-2 pr-2 pt-1.5 pb-1.5 text-center sticky z-50' style={{ backgroundColor: design.header?.bgColorTop, color: design.header?.textColorTop }}>
                <p className='m-auto font-medium text-[13px]'>{design.header.topStrip}</p>
              </div>
            )
            : ''
          : ''
      }
      <div style={{ top: '-0.5px' }} className={`${view ? 'opacity-1' : 'opacity-0 -translate-y-16'} transition-all duration-500 sticky flex w-full z-40 flex-col`}>
        <div className={`z-40 m-auto w-full absolute flex justify-between px-2 sm:py-0`} style={{ boxShadow: style.design === 'Sombreado' ? `0px 0px 10px 0px ${style.borderColor}15` : '', backgroundColor: design.header?.bgColor && design.header?.bgColor !== '' ? design.header.bgColor : '#ffffff', color: design.header?.textColor && design.header?.textColor !== '' ? design.header?.textColor : '#111111', borderBottom: style.design === 'Borde' ? subPages !== -1 ? '' : `1px solid ${style.borderColor}` : '' }}>
          <div className='m-auto w-[1280px] flex justify-between py-1 sm:py-0'>
          <div className='hidden gap-2 sm:flex'>
            {
              storeData?.logo && storeData?.logo !== '' && design.header?.logo === 'Logo'
                ? <Link href='/'><Image className={`w-auto h-[54px] py-2`} src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                : storeData?.logoWhite && storeData?.logoWhite !== '' && design.header?.logo === 'Logo blanco'
                  ? <Link href='/'><Image className={`w-auto h-[54px] py-2`} src={`${storeData.logoWhite}`} alt='Logo blanco' width={320} height={150} /></Link>
                  : storeData?.logo && storeData?.logo !== ''
                    ? <Link href='/'><Image className={`w-auto h-[54px] py-2`} src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                    : <Link href='/'><div className='h-[50px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
            }
          </div>
          {
            pathname !== '/finalizar-compra'
              ? <>
                <div className='hidden gap-6 sm:flex'>
                  {
                    design.pages?.map((page, index) => {
                      if (page.header) {
                        if (page.page === 'Tienda') {
                          return (
                            <Link key={page.slug} className='flex h-full' href='/tienda' onMouseEnter={() => {
                              setNavCategoriesOpacity('-mt-[1px]')
                            }} onMouseLeave={() => {
                              setNavCategoriesOpacity('-mt-[330px]')
                            }} onClick={() => {
                              setNavCategoriesOpacity('-mt-[330px]')
                            }}>
                              <div className={`mt-auto transition-colors duration-150 font-medium text-[#1c1b1b] mb-auto dark:text-white`}>{page.page}</div>
                            </Link>
                          )
                        } else if (page.button) {
                          return (
                            <LinkButton key={page.slug} url={page.slug} config='py-[6px] my-auto' style={style}>{page.page}</LinkButton>
                          )
                        } else {
                          if (page.slug === '') {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium mb-auto' href='/'>
                                <div className={`mt-auto ${pathname === '/' ? 'dark:border-white' : 'border-white dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 mb-auto`}>{page.page}</div>
                              </Link>
                            )
                          } else {
                            return (
                              <Link key={page.slug} className='mt-auto flex h-full font-medium mb-auto' href={`/${page.slug}`} onMouseEnter={() => page.subPage?.length ? setSubPages(index) : ''} onMouseLeave={() => setSubPages(-1)} onClick={() => setSubPages(-1)}>
                                <div className={`mt-auto ${pathname.includes(`/${page.slug}`) ? 'dark:border-white' : 'border-white dark:border-neutral-900 dark:hover:border-white'} transition-colors duration-150 mb-auto`}>{page.page}</div>
                              </Link>
                            )
                          }
                        }
                      }
                    })
                  }
                  {
                    products?.length
                      ? accountPosition === '-mt-[400px]'
                        ? (
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setAccountView('flex')
                            setTimeout(() => {
                              setAccountPosition('')
                            }, 10)
                          }}>
                            <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10.9531" cy="6" r="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></circle>
                              <path d="M20.4906 18C19.2164 13.9429 15.4261 11 10.9484 11C6.47081 11 2.68051 13.9429 1.40625 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </button>
                        )
                        : (
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setAccountPosition('-mt-[400px]')
                            setTimeout(() => {
                              setAccountView('hidden')
                            }, 500)
                          }}>
                            <svg className="m-auto w-[21px] px-[2px]" role="presentation" viewBox="0 0 16 14">
                              <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        )
                      : ''
                  }
                  {
                    products?.length
                      ? cartPosition === '-mr-96'
                        ? (
                          <div>
                            <button onClick={() => {
                              setCartView('flex')
                              setTimeout(() => {
                                setCartPosition('')
                              }, 10)
                            }} className='flex h-full mr-2'>
                              <svg className='m-auto cursor-pointer w-[17px]' role="presentation" viewBox="0 0 17 20">
                                <path d="M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z" fill="currentColor"></path>
                              </svg>
                            </button>
                            {
                              cart?.length
                                ? (
                                  <div className='bg-button w-5 h-5 absolute top-2 ml-3 flex rounded-full'>
                                    <span className='m-auto text-xs text-white'>{cart.reduce((prev, curr) => prev + Number(curr.quantity), 0)}</span>
                                  </div>
                                )
                                : ''
                            }
                          </div>
                          )
                        : (
                          <button className='h-full flex mr-2' onClick={() => {
                            setCartPosition('-mr-96')
                            setTimeout(() => {
                              setCartView('hidden')
                            }, 500)
                          }}>
                            <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                              <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        )
                      : ''
                  }
                </div>
                <div className="relative flex px-2 w-full items-center h-[50px] sm:hidden">
                  <div className="flex gap-4 z-10">
                    {
                      menu === '-ml-[350px]'
                        ? <button onClick={() => {
                            setIndex('flex')
                            setTimeout(() => {
                              setMenu('')
                              setTimeout(() => {
                                setElement1(true)
                                setTimeout(() => {
                                  setElement2(true)
                                  setTimeout(() => {
                                    setElement3(true)
                                    setTimeout(() => {
                                      setElement4(true)
                                      setTimeout(() => {
                                        setElement5(true)
                                        setTimeout(() => {
                                          setElement6(true)
                                          setTimeout(() => {
                                            setElement7(true)
                                            setTimeout(() => {
                                              setElement8(true)
                                              setTimeout(() => {
                                                setElement9(true)
                                                setTimeout(() => {
                                                  setElement10(true)
                                                }, 50)
                                              }, 50)
                                            }, 50)
                                          }, 50)
                                        }, 50)
                                      }, 50)
                                    }, 50)
                                  }, 50)
                                }, 50)
                              }, 200)
                            }, 10)
                          }} aria-label='Boton para abrir el menu'>
                          <svg className="w-5" role="presentation" viewBox="0 0 20 14">
                            <path d="M0 14v-1h20v1H0zm0-7.5h20v1H0v-1zM0 0h20v1H0V0z" fill="currentColor"></path>
                          </svg>
                        </button>
                        : <button onClick={() => {
                            setMenu('-ml-[350px]')
                            setTimeout(() => {
                              setIndex('hidden')
                              setElement1(false)
                              setElement2(false)
                              setElement3(false)
                              setElement4(false)
                              setElement5(false)
                              setElement6(false)
                              setElement7(false)
                              setElement8(false)
                              setElement9(false)
                              setElement10(false)
                            }, 500)
                          }} className='flex w-5' aria-label='Boton para cerrar el menu'>
                          <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                            <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                          </svg>
                        </button>
                    }
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {
                      storeData?.logo && storeData?.logo !== '' && design.header?.logo === 'Logo'
                        ? <Link href='/'><Image className={`w-auto h-[50px] py-1`} src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                        : storeData?.logoWhite && storeData?.logoWhite !== '' && design.header?.logo === 'Logo blanco'
                          ? <Link href='/'><Image className={`w-auto h-[50px] py-1`} src={`${storeData.logoWhite}`} alt='Logo blanco' width={320} height={150} /></Link>
                          : <Link href='/'><div className='h-[50px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
                    }
                  </div>
                  <div className={`${products?.length ? 'flex' : 'hidden'} ml-auto gap-4 z-10`}>
                    {
                      accountPosition === '-mt-[400px]'
                        ? (
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setAccountView('flex')
                            setTimeout(() => {
                              setAccountPosition('')
                            }, 10)
                          }}>
                            <svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="10.9531" cy="6" r="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></circle>
                              <path d="M20.4906 18C19.2164 13.9429 15.4261 11 10.9484 11C6.47081 11 2.68051 13.9429 1.40625 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                          </button>
                        )
                        : (
                          <button onClick={(e: any) => {
                            e.preventDefault()
                            setAccountPosition('-mt-[400px]')
                            setTimeout(() => {
                              setAccountView('hidden')
                            }, 500)
                          }}>
                            <svg className="m-auto w-[21px] px-[2px]" role="presentation" viewBox="0 0 16 14">
                              <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        )
                    }
                    {
                      cartPosition === '-mr-96'
                        ? (
                          <div>
                            <button onClick={() => {
                              setCartView('flex')
                              setTimeout(() => {
                                setCartPosition('')
                              }, 10)
                            }} className='flex h-full'>
                              <svg className='m-auto cursor-pointer w-[17px]' role="presentation" viewBox="0 0 17 20">
                                <path d="M0 20V4.995l1 .006v.015l4-.002V4c0-2.484 1.274-4 3.5-4C10.518 0 12 1.48 12 4v1.012l5-.003v.985H1V19h15V6.005h1V20H0zM11 4.49C11 2.267 10.507 1 8.5 1 6.5 1 6 2.27 6 4.49V5l5-.002V4.49z" fill="currentColor"></path>
                              </svg>
                            </button>
                            {
                              cart?.length
                                ? (
                                  <div className='bg-button w-5 h-5 absolute top-2 ml-3 flex rounded-full'>
                                  <span className='m-auto text-xs text-white'>{cart.reduce((prev, curr) => prev + Number(curr.quantity), 0)}</span>
                                </div>
                                )
                                : ''
                            }
                          </div>
                          )
                        : (
                          <button onClick={() => {
                            setCartPosition('-mr-96')
                            setTimeout(() => {
                              setCartView('hidden')
                            }, 500)
                          }} className='flex h-full'>
                            <svg className="m-auto w-[17px]" role="presentation" viewBox="0 0 16 14">
                              <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                            </svg>
                          </button>
                        )
                    }
                  </div>
                </div>
              </>
              : <div className='flex gap-4 justify-between'>
                <div className='gap-2 flex sm:hidden'>
                  {
                    storeData?.logo && storeData?.logo !== '' && design.header?.logo === 'Logo'
                      ? <Link href='/'><Image className='h-[50px] py-0.5' src={`${storeData.logo}`} alt='Logo' width={320} height={150} /></Link>
                      : storeData?.logoWhite && storeData?.logoWhite !== '' && design.header?.logo === 'Logo blanco'
                        ? <Link href='/'><Image className='h-[50px] py-0.5' src={`${storeData.logoWhite}`} alt='Logo blanco' width={320} height={150} /></Link>
                        : <Link href='/'><div className='h-[50px] flex'><p className='m-auto text-2xl font-medium'>SITIO WEB</p></div></Link>
                  }
                </div>
                <Link href='/tienda' className='mt-auto mb-auto text-sm text-neutral-500'>Continuar comprando</Link>
              </div>
          }
          </div>
        </div>
        <div className={`${accountView} ${accountPosition} transition-all duration-500 w-full -z-10 absolute top-[50px] sm:hidden`} style={{ height: 'calc(100vh - 91px)' }}>
          <div className='w-full px-4 ml-auto mr-auto'>
            <div className='ml-auto h-fit flex w-full 400:w-96'>
              <AccountLogin account={account} setAccount={setAccount} setAccountPc={setAccountPc} setAccountView={setAccountView} setAccountPosition={setAccountPosition} style={style} />
            </div>
            <div onClick={() => {
              setAccountPosition('-mt-[400px]')
              setTimeout(() => {
                setAccountView('hidden')
              }, 500)
            }} className='h-full w-full' />
          </div>
        </div>
        <div onClick={() => {
          if (accountPc) {
            setAccountPosition('-mt-[400px]')
            setTimeout(() => {
              setAccountView('hidden')
            }, 500)
          }
        }} className={`hidden ${accountPosition} w-full -z-10 transition-all duration-500 absolute top-[53px] sm:${accountView}`} style={{ height: 'calc(100vh - 91px)' }}>
          <div className='w-[1770px] ml-auto mr-auto'>
            <div className='ml-auto h-fit flex w-full 400:w-96'>
              <AccountLogin account={account} setAccount={setAccount} setAccountPc={setAccountPc} setAccountView={setAccountView} setAccountPosition={setAccountPosition} style={style} />
            </div>
          </div>
        </div>
        <div className={`${cartView} ${cartPosition === '' ? 'bg-black/30' : ''} transition-all duration-500 -z-10 absolute top-[58px] sm:top-[54px] w-full overflow-hidden`}>
          <div onClick={() => {
            setCartPosition('-mr-96')
            setTimeout(() => {
              setCartView('hidden')
            }, 500)
          }} style={{ width: 'calc(100% - 360px)' }} />
          <div className={`${cartPosition} h-fit flex w-[360px] ml-auto transition-all duration-500`}>
            <NavbarCart cartRef={cartRef} setCartView={setCartView} setCartPosition={setCartPosition} categories={categories} style={style} />
          </div>
        </div>
        <div className={`${index} w-full ${menu === '' ? 'bg-black/30' : ''} transition-colors duration-500 absolute z-30 justify-between 530:hidden`} style={{ top: '58px', height: 'calc(100vh - 58px)' }}>
          <div className={`${menu} w-[284px] flex flex-col p-4 shadow-md transition-all duration-500 overflow-hidden`} style={{ backgroundColor: design.header?.bgColor && design.header.bgColor !== '' ? design.header.bgColor : '#ffffff' }}>
            {
              design.pages?.filter(page => page.header).map((page, index) => {
                if (page.page === 'Tienda') {
                  return (
                    <div key={page.slug} className={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-5' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 7 ? element8 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 8 ? element9 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 9 ? element10 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 border-b mb-4 dark:border-neutral-600`}>
                      <div className={`flex justify-between pb-2`}>
                        <Link onClick={() => {
                          setMenu('-ml-[350px]')
                          setTimeout(() => {
                            setIndex('hidden')
                            setElement1(false)
                            setElement2(false)
                            setElement3(false)
                            setElement4(false)
                            setElement5(false)
                            setElement6(false)
                            setElement7(false)
                            setElement8(false)
                            setElement9(false)
                            setElement10(false)
                          }, 500)
                        }} className='font-medium text-[#1c1b1b] w-full dark:text-white' href={`/${page.slug}`}>{page.page}</Link>
                        {
                          categories?.length
                            ? <button onClick={() => rotate === 'rotate-90' ? setRotate('-rotate-90') : setRotate('rotate-90')}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className={`${rotate} transition-all duration-150 ml-auto text-lg w-4 text-neutral-500`} xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></button>
                            : <Link href='/tienda' onClick={() => {
                              setMenu('-ml-[350px]')
                              setTimeout(() => {
                                setIndex('hidden')
                                setElement1(false)
                                setElement2(false)
                                setElement3(false)
                                setElement4(false)
                                setElement5(false)
                                setElement6(false)
                                setElement7(false)
                                setElement8(false)
                                setElement9(false)
                                setElement10(false)
                              }, 500)
                            }}><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
                        }
                      </div>
                      <div key={page.slug} ref={categoriesPhoneRef} style={{ maxHeight: `${categoriesPhone}px`, overflow: 'hidden', transition: 'max-height 0.5s' }} className={`${categoriesPhone} flex flex-col`}>
                        {
                          categories?.length
                            ? categories.map(category => (
                              <Link onClick={() => {
                                setMenu('-ml-[350px]')
                                setTimeout(() => {
                                  setIndex('hidden')
                                  setElement1(false)
                                  setElement2(false)
                                  setElement3(false)
                                  setElement4(false)
                                  setElement5(false)
                                  setElement6(false)
                                  setElement7(false)
                                  setElement8(false)
                                  setElement9(false)
                                  setElement10(false)
                                }, 500)
                              }} href={`/tienda/${category.slug}`} className='flex gap-2 mb-2' key={category._id}>
                                <Image className='w-28 rounded-md h-auto' src={category.image!} width={112} height={112} alt={`Categoria ${category.category}`} />
                                <p className='mt-auto text-[#1c1b1b] font-medium mb-auto dark:text-white'>{category.category}</p>
                              </Link>
                            ))
                            : ''
                        }
                      </div>
                    </div>
                  )
                } else if (page.button) {
                  return (
                    <LinkButton key={page.slug} url={page.slug} config={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-5' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 7 ? element8 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 8 ? element9 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 9 ? element10 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 py-[6px] mx-auto mb-4`} style={style} click={() => {
                      setMenu('-ml-[350px]')
                      setTimeout(() => {
                        setIndex('hidden')
                        setElement1(false)
                        setElement2(false)
                        setElement3(false)
                        setElement4(false)
                        setElement5(false)
                        setElement6(false)
                        setElement7(false)
                        setElement8(false)
                        setElement9(false)
                        setElement10(false)
                      }, 500)
                    }}>{page.page}</LinkButton>
                  )
                } else {
                  if (page.subPage?.length) {
                    return <SubPage key={page.slug} page={page} setMenu={setMenu} setIndex={setIndex} design={design} style={style} element1={element1} element2={element2} element3={element3} element4={element4} element5={element5} element6={element6} element7={element7} index={index} />
                  } else {
                    return (
                      <Link key={page.slug} className={`${index === 0 ? element1 ? 'opacity-1' : 'opacity-0 translate-y-5' : index === 1 ? element2 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 2 ? element3 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 3 ? element4 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 4 ? element5 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 5 ? element6 ? 'opacity-1' : 'opacity-0 translate-y-4' : index === 6 ? element7 ? 'opacity-1' : 'opacity-0 translate-y-4' : ''} transition-all duration-500 font-medium mb-4 flex pb-2 border-b`} style={{ color: design.header?.textColor, borderBottom: `1px solid ${style.design === 'Borde' ? style.borderColor : `${style.borderColor}20`}` }} onClick={() => {
                        setMenu('-ml-[350px]')
                        setTimeout(() => {
                          setIndex('hidden')
                          setElement1(false)
                          setElement2(false)
                          setElement3(false)
                          setElement4(false)
                          setElement5(false)
                          setElement6(false)
                          setElement7(false)
                          setElement8(false)
                          setElement9(false)
                          setElement10(false)
                        }, 500)
                      }} href={`/${page.slug}`}>{page.page}<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="ml-auto w-4 text-lg text-neutral-500" xmlns="http://www.w3.org/2000/svg"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg></Link>
                    )
                  }
                }
              })
            }
          </div>
          <div className='h-full' style={{ width: 'calc(100% - 284px)' }} onClick={() => {
            setMenu('-ml-[350px]')
            setTimeout(() => {
              setIndex('hidden')
              setElement1(false)
              setElement2(false)
              setElement3(false)
              setElement4(false)
              setElement5(false)
              setElement6(false)
              setElement7(false)
              setElement8(false)
              setElement9(false)
              setElement10(false)
            }, 500)
          }} />
        </div>
        <div className={`${subPages !== -1 ? 'top-0' : '-mt-[130px]'} transition-all duration-500 z-30 w-full p-6 flex absolute h-32`} style={{ top: '52px', boxShadow: style.design === 'Sombreado' ? '0px 0px 10px 0px #11111115' : '', backgroundColor: design.header?.bgColor && design.header.bgColor !== '' ? design.header.bgColor : '#ffffff', color: design.header?.textColor, border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '' }} onMouseEnter={() => setSubPages(subPages)} onMouseLeave={() => setSubPages(-1)}>
          <div className='m-auto flex gap-6'>
            {
              subPages !== -1 ? design.pages[subPages].subPage?.map(subPage => <Link key={subPage.slug} href={subPage.slug!} className='text-lg' onClick={() => setSubPages(-1)}>{subPage.page}</Link>) : ''
            }
          </div>
        </div>
        <div className={`${navCategoriesOpacity} -z-10 border-t box-border transition-all duration-500 absolute top-[53px] w-full dark:border-neutral-800`} onMouseEnter={() => {
          setMouseEnter(true)
          setNavCategoriesOpacity('-mt-[1px]')
        }} onMouseLeave={() => {
          setNavCategoriesOpacity('-mt-[330px]')
        }}>
          {
            categories?.length
              ? (
                <div className='w-full bg-white p-4 flex gap-4 border-b justify-center dark:bg-neutral-900 dark:border-neutral-800'>
                  {categories.map(category => (
                    <div key={category._id}>
                      <Image className='w-64h-auto mb-2 cursor-pointer' style={{ borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }} onClick={() => {
                        setNavCategoriesOpacity('-mt-[330px]')
                        router.push(`/tienda/${category.slug}`)
                      }} src={category.image!} width={256} height={256} alt={`Categoria ${category.category}`} />
                      <Link href={`/tienda/${category.slug}`} onClick={() => {
                        setNavCategoriesOpacity('-mt-[330px]')
                      }} className='m-auto font-medium text-[#1c1b1b] dark:text-white'>{category.category}</Link>
                    </div>
                  ))}
                </div>
              )
              : ''
          }
        </div>
      </div>
      { children }
      </div>
      <Footer storeData={storeData} politics={politics} design={design} />
    </div>
    </>
  )
}
