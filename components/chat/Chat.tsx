"use client"
import { IMessage, IStoreData } from '@/interfaces'
import axios from 'axios'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import io from 'socket.io-client'
import { Button, Input } from '../ui'
import CartContext from '@/context/cart/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

declare const fbq: Function

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/`, {
  transports: ['websocket']
})

interface Props {
  style?: any
  storeData?: IStoreData
  design: any
  viewChat: boolean
}

export const Chat: React.FC<Props> = ({ style, storeData, design, viewChat }) => {

  const [chatView, setChatView] = useState(false)
  const [chatOpacity, setChatOpacity] = useState('-mb-[200px]')
  const [chat, setChat] = useState<IMessage[]>([{
    response: `¡Hola! Soy el agente de IA de ${storeData?.name} ¿En que te puedo ayudar?`,
    adminView: false,
    userView: false,
    agent: true
  }])
  const [newMessage, setNewMessage] = useState('')
  const [loadingMessage, setLoadingMessage] = useState(false)

  const {setCart} = useContext(CartContext)

  const chatRef = useRef(chat)
  const containerRef = useRef<HTMLDivElement>(null)
  const chatOpacityRef = useRef(chatOpacity)

  const router = useRouter()

  const getMessages = async () => {
    if (localStorage.getItem('chatId')) {
      const senderId = localStorage.getItem('chatId')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chat/${senderId}`)
      const messages = response.data
      const messagesReverse = messages.reverse()
      const lastMessage = messagesReverse[0]
      if (lastMessage?.createdAt) {
        const lastDate = new Date(lastMessage.createdAt);
        const now = new Date();
        const diffInDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffInDays > 2) {
          setChat([
            ...response.data,
            {
              response: `¡Hola! Soy el agente de IA de ${storeData?.name} ¿En qué te puedo ayudar?`,
              adminView: false,
              userView: false,
              agent: true
            },
          ])
        } else {
          setChat(response.data)
        }
      }
    }
  }

  useEffect(() => {
    getMessages()
  }, [])

  useEffect(() => {
    chatRef.current = chat
  }, [chat])

  useEffect(() => {
    chatOpacityRef.current = chatOpacity
  }, [chatOpacity])

  useEffect(() => {
    socket.on('messageAdmin', message => {
      if (localStorage.getItem('chatId') === message.senderId) {
        if (chatOpacityRef.current === '') {
          setChat(chatRef.current.concat([{ ...message, agent: true, adminView: true, userView: true }]))
        } else {
          setChat(chatRef.current.concat([{ ...message, agent: true, adminView: true, userView: false }]))
        }
      }
    })

    return () => {
      socket.off('messageAdmin', message => console.log(message))
    }
  }, [])

  const inputChange = (e: any) => {
    setNewMessage(e.target.value)
  }

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chat])

  const renderMessageWithLinks = (message: string) => {
    // Expresión regular para encontrar las etiquetas <a>
    const regex = /<a href="([^"]+)">([^<]+)<\/a>/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    // Buscar todas las coincidencias de <a> en el mensaje
    while ((match = regex.exec(message)) !== null) {
      // Agregar el texto antes del enlace
      parts.push(message.slice(lastIndex, match.index));
      // Crear el componente Link para el enlace
      parts.push(
        <Link key={match.index} href={match[1]} onClick={() => {
          setChatOpacity('-mb-[200px]')
          setTimeout(() => {
            setChatView(false)
          }, 500);
        }} className='text-blue-600 underline'>
          {match[2]}
        </Link>
      );
      lastIndex = regex.lastIndex;
    }
    // Agregar el texto restante después del último enlace
    parts.push(message.slice(lastIndex));

    return <>{parts}</>;
  };

  const submitMessage = async (e: any) => {
    e.preventDefault()
    if (!loadingMessage) {
      setLoadingMessage(true)
      let senderId
      let cart
      let message = newMessage
      setNewMessage('')
      setChat(chat.concat({message: message, userView: true}))
      if (localStorage.getItem('chatId')) {
        senderId = localStorage.getItem('chatId')
      } else {
        senderId = uuidv4()
        localStorage.setItem('chatId', senderId)
      }
      if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart')!)
      } else {
        cart = [{
          name: '',
          image: '',
          price: '',
          beforePrice: '',
          variation: {
            variation: '',
            subVariation: '',
            subVariation2: '',
            stock: '',
            image: '',
            sku: ''
          },
          slug: '',
          quantity: '',
          stock: '',
          category: { category: '', slug: '' },
          quantityOffers: [],
          sku: ''
        }]
        localStorage.setItem('cart', JSON.stringify(cart))
      }
      let response
      if (!chat.reverse()[0].agent) {
        socket.emit('message', {message: message, senderId: senderId, createdAt: new Date()})
      }
      if (chat.length === 1) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/create`, { senderId: senderId, response: chat[0].response, agent: true, adminView: false, userView: true, cart: cart })
      } else if (chat.reverse()[0].message === `¡Hola! Soy el agente de IA de ${storeData?.name} ¿En que te puedo ayudar?`) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, response: `¡Hola! Soy el agente de IA de ${storeData?.name} ¿En que te puedo ayudar?`, agent: true, adminView: false, userView: true, cart: cart })
      }
      response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, { senderId: senderId, message: message, agent: chat.reverse()[0].agent, adminView: false, userView: true, cart: cart })
      if (response!.data.response) {
        setChat(chat.filter(mes => mes.message === message))
      }
      setLoadingMessage(false)
      if (response!.data.response) {
        setChat(chat.concat(response!.data))
      }
      if (response!.data.cart) {
        localStorage.setItem('cart', JSON.stringify(response.data.cart))
        setCart(response.data.cart)
      }
    }
  }

  return (
    <>
        <div className={`${chatOpacity} ${chatView ? 'flex' : 'hidden'} ${chatOpacity === '-mb-[200px]' ? 'opacity-0' : 'opacity-1'} fixed bottom-24 right-4 z-50 h-[450px] ml-3 justify-between flex-col gap-3 transition-all duration-500 w-80 sm:w-96 sm:h-[570px] sm:gap-4`} style={{ borderRadius: `${style.borderBlock}px`, boxShadow: `0px 3px 20px 3px #11111125`, backgroundColor: design.chat?.bgColor && design.chat.bgColor !== '' ? design.chat.bgColor : '#ffffff' }}>
          <div className='h-28 w-full flex p-4' style={{ backgroundColor: style.primary, borderTopLeftRadius: `${style.borderBlock}px`, borderTopRightRadius: `${style.borderBlock}px` }}>
            <span className='text-white mt-auto mb-auto text-xl'>Chat</span>
          </div>
          <div ref={containerRef} className='flex flex-col h-full gap-2 pl-3 sm:pl-4' style={{ overflow: 'overlay' }}>
            {
              chat?.length
                ? chat.map((info, i) => (
                    <div key={info.response} className="flex flex-col gap-2 pr-3 sm:pr-4">
                      {info.message && (
                        <div className="flex flex-col gap-2 ml-6">
                          <div
                            className="text-white p-1.5 rounded-md w-fit ml-auto"
                            style={{ backgroundColor: style.primary }}
                          >
                            {/* Renderizar el mensaje con enlaces */}
                            {renderMessageWithLinks(info.message)}
                          </div>
                        </div>
                      )}
                      {info.response && (
                        <div className="flex flex-col gap-2 mr-6">
                          <div className="bg-gray-200 p-1.5 rounded-md w-fit">
                            {/* Renderizar la respuesta con enlaces */}
                            {renderMessageWithLinks(info.response)}
                          </div>
                          {info.ready && (
                            <Button
                              action={(e: any) => {
                                e.preventDefault();
                                router.push('/finalizar-compra');
                                setChatOpacity('-mb-[200px]');
                                setTimeout(() => {
                                  setChatView(false);
                                }, 500);
                              }}
                              style={style}
                            >
                              Finalizar compra
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                : ''
            }
            {
              loadingMessage
                ? (
                  <div className='flex flex-col gap-2 mr-6'>
                    <div className='bg-gray-200 p-1.5 rounded-md w-fit'>
                      <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="25px" width="25px" xmlns="http://www.w3.org/2000/svg"><circle cx="12.1" cy="12.1" r="1"></circle><circle cx="3" cy="12.1" r="1"></circle><circle cx="21" cy="12.1" r="1"></circle></svg>
                    </div>
                  </div>
                )
                : ''
            }
          </div>
          <form className='flex gap-2 pr-3 pl-3 pb-3 sm:pr-4 sm:pl-4 sm:pb-4'>
            <Input inputChange={inputChange} value={newMessage} type={'text'} placeholder={'Mensaje'} style={style} />
            <button type='submit' onClick={submitMessage} className='text-white w-28 dark:bg-neutral-700 transition-colors duration-200 hover:bg-transparent' style={{ backgroundColor: style.primary, borderRadius: style?.form === 'Redondeadas' ? `${style?.borderButton}px` : '' }}>Enviar</button>
          </form>
        </div>
        <button onClick={async (e: any) => {
          e.preventDefault()
          if (chatOpacity === '-mb-[200px]') {
            setChatView(true)
            setTimeout(() => {
              setChatOpacity('')
            }, 50)
          } else {
            setChatOpacity('-mb-[200px]')
            setTimeout(() => {
              setChatView(false)
            }, 500);
          }
          const senderId = localStorage.getItem('chatId')
          if (senderId) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/chat-user/${senderId}`)
            getMessages()
          } else {
            chat[0].userView = true
            setChat(chat)
          }
        }} aria-label='Botón para abrir y cerrar el chat' id='chat' className={`${viewChat ? 'opacity-1' : 'opacity-0 translate-y-6'} transition-all duration-500 w-14 h-14 z-50 flex rounded-full`} style={{ backgroundColor: style.primary }}>
          {
            chatOpacity === '-mb-[200px]'
              ? (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" className="text-3xl text-white m-auto" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path><path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"></path>
                </svg>
              )
              : (
                <svg className="m-auto w-[19px] text-white" role="presentation" viewBox="0 0 16 14">
                  <path d="M15 0L1 14m14 0L1 0" stroke="currentColor" fill="none" fill-rule="evenodd"></path>
                </svg>
              )
          }
          {
            chat.map((message, index) => (
              <div key={index}>
                {
                  index === chat.length - 1
                    ? message.userView
                        ? ''
                        : <div className='h-3 w-3 rounded-full bg-button right-0 absolute' />
                    : ''
                  }
              </div>
            ))
          }
        </button>
    </>
  )
}
