"use client"
import axios from 'axios'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, useState } from 'react'
import { Spinner2 } from './Spinner2'
import Link from 'next/link'
import { Button, H3, Input } from '.'

interface Props {
    account: any
    setAccount: any
    setAccountPc: any
    setAccountView: any
    setAccountPosition: any
    style?: any
}

export const AccountLogin: React.FC<Props> = ({ account, setAccount, setAccountPc, setAccountView, setAccountPosition, style }) => {

  const [login, setLogin] = useState({
    email: '',
    password: ''
  })
  const [register, setRegister] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassrword: '',
    marketing: false
  })
  const [error, setError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [closeLoading, setCloseLoading] = useState(false)

  const { data: session, status } = useSession()
  const router = useRouter()

  const loginHandleSubmit = async (e: any) => {
    e.preventDefault()
    setLoginLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email: login.email,
      password: login.password,
      redirect: false
    })
    setLoginLoading(false)
    if (res?.error) return setError(res.error)
    if (res?.ok) {
      setLogin({ email: '', password: '' })
      setAccountPosition('-mt-[400px]')
      setTimeout(() => {
        setAccountView('hidden')
      }, 500)
      return router.push('/cuenta')
    }
  }

  const registerHandleSubmit = async (e: any) => {
    e.preventDefault()
    setRegisterLoading(true)
    setError('')
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, register)
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients`, { email: register.email, firstName: register.firstName, lastName: register.lastName, tags: register.marketing ? ['Suscriptores'] : undefined })
    if (response.data.message) setError(response.data.message)
    const res = await signIn('credentials', {
      email: response.data.email,
      password: register.password,
      redirect: false
    })
    setRegisterLoading(false)
    if (res?.error) return setError(res.error)
    if (res?.ok) {
      setRegister({ firstName: '', lastName: '', email: '', password: '', confirmPassrword: '', marketing: false })
      setAccountPosition('-mt-[400px]')
      setTimeout(() => {
        setAccountView('hidden')
      }, 500)
      return router.push('/cuenta')
    } 
  }

  const handleLogout = async () => {
    setCloseLoading(true)
    await signOut({ callbackUrl: '/' })
    setCloseLoading(false)
  }

  return (
    <div onMouseEnter={() => setAccountPc(false)} onMouseLeave={() => setAccountPc(true)} className={`ml-auto flex flex-col gap-3 p-4 bg-white z-40 w-full sm:w-96`} style={{ borderRadius: style.form === 'Redondeadas' ? `${style.borderBlock}px` : '', border: style.design === 'Borde' ? `1px solid ${style.borderColor}` : '', boxShadow: style.design === 'Sombreado' ? `0px 3px 20px 3px ${style.borderColor}10` : '' }}>
      {
        error !== ''
          ? (
            <div className='bg-red-600 w-full py-2 flex text-white'>
              <p className='m-auto'>{error}</p>
            </div>
          )
          : ''
      }
      <h3 className='text-center border-b pb-2'>Cuenta</h3>
      {
        status === 'authenticated'
          ? (
            <>
              <Link href='/cuenta' onClick={(e: any) => {
                setAccountPosition('-mt-[400px]')
                setTimeout(() => {
                  setAccountView('hidden')
                }, 500)
              }} className='p-1.5 hover:bg-neutral-100 rounded-md transition-colors duration-100'>Ver mi cuenta</Link>
              <Button action={handleLogout} style={style} loading={closeLoading} config='w-full'>Cerrar sesion</Button>
            </>
          )
          : (
            <>
              <div className='flex gap-2'>
                <button onClick={(e: any) => {
                  e.preventDefault()
                  setAccount('Ingresar')
                }} className={`${account === 'Ingresar' ? 'border-neutral-700' : 'border-white'} border-b-2 w-1/2 h-10 text-sm lg:text-[16px]`}>Ingresar</button>
                <button onClick={(e: any) => {
                  e.preventDefault()
                  setAccount('Registrarse')
                }} className={`${account === 'Registrarse' ? 'border-neutral-700' : 'border-white'} border-b-2 w-1/2 h-10 text-sm lg:text-[16px]`}>Registrarse</button>
              </div>
              {
                account === 'Ingresar'
                  ? (
                    <form onSubmit={loginHandleSubmit} className='flex flex-col gap-3'>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Email</p>
                        <Input placeholder='Email' inputChange={(e: ChangeEvent<HTMLInputElement>) => setLogin({ ...login, email: e.target.value })} style={style} value={login.email} />
                      </div>
                      <div className='flex flex-col gap-2'>
                        <p className='text-sm'>Contraseña</p>
                        <Input type='password' placeholder='*******' inputChange={(e: ChangeEvent<HTMLInputElement>) => setLogin({...login, password: e.target.value})} style={style} value={login.password} />
                      </div>
                      <Button type='submit' loading={loginLoading} style={style} config='w-full'>Ingresar</Button>
                      <Link href='/' className='text-sm'>Olvide mi contraseña</Link>
                    </form>
                  )
                  : (
                    <form onSubmit={registerHandleSubmit} className='flex flex-col gap-3'>
                      <div className='flex flex-col gap-3 overflow-y-auto max-h-52'>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Nombre</p>
                          <Input placeholder='Nombre' inputChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({ ...register, firstName: e.target.value })} style={style} value={register.firstName} />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Apellido</p>
                          <Input placeholder='Apellido' inputChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, lastName: e.target.value})} style={style} value={register.lastName} />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Email</p>
                          <Input placeholder='Email' inputChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, email: e.target.value})} style={style} value={register.email} />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Contraseña</p>
                          <Input type='password' placeholder='*******' inputChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, password: e.target.value})} style={style} value={register.password} />
                        </div>
                        <div className='flex flex-col gap-2'>
                          <p className='text-sm'>Confirmar contraseña</p>
                          <Input type='password' placeholder='*******' inputChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({...register, confirmPassrword: e.target.value})} style={style} value={register.confirmPassrword} />
                        </div>
                        <div className='flex gap-2'>
                          <input type='checkbox' checked={register.marketing} onChange={(e: ChangeEvent<HTMLInputElement>) => setRegister({ ...register, marketing: e.target.checked ? true : false })} />
                          <p className='text-sm'>Suscribirse a nuestra lista</p>
                        </div>
                      </div>
                      <Button type='submit' config='w-full' loading={registerLoading} style={style}>Registrarse</Button>
                    </form>
                  )
              }
            </>
          )
      }
    </div>
  )
}