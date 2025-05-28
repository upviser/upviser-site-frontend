"use client"
import { Table } from "@/components/design"
import { H1, H2, Spinner } from "@/components/ui"
import { ISell } from "@/interfaces"
import { NumberFormat } from "@/utils"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function Page () {

  const { data: session } = useSession()

  const [sells, setSells] = useState<ISell[]>([])
  const [loading, setLoading] = useState(true)

  const getSells = async () => {
    setLoading(true)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sells-client/${session?.user?.email}`)
    setSells(res.data)
    setLoading(false)
  }

  useEffect(() => {
    getSells()
  }, [])

  return (
    <div className='flex px-4 py-4 md:py-8 w-full'>
      <div className='m-auto w-full max-w-[1280px] flex gap-6 flex-col'>
        <H1 text="Cuenta" />
        <div className="flex flex-col gap-4">
          <H2 text="Compras" />
          {
            loading
              ? (
                <div className="flex w-full">
                  <div className="m-auto mt-16 mb-16">
                    <Spinner />
                  </div>
                </div>
              )
              : sells.length
                ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Numero de compra</th>
                        <th>Precio total</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        sells.map(sell => (
                          <tr key={sell._id}>
                            <td>{sell.buyOrder}</td>
                            <td>${NumberFormat(sell.total)}</td>
                            <td>{sell.shippingState} - {sell.state}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                )
                : <p>No has realizado compras</p>
          }
        </div>
      </div>
    </div>
  )
}