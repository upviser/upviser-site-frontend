"use client"
import LogoProvider from "@/context/logo/LogoProvider"
import React from "react"
import { SessionProvider } from "next-auth/react"
import CartProvider from "@/context/cart/CartProvider"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LogoProvider>
        <CartProvider>
          { children }
        </CartProvider>
      </LogoProvider>
    </SessionProvider>
  )
}