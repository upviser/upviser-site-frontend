import { Design, IPolitics, IProduct, IStoreData } from "@/interfaces"
import { FooterPage } from "./FooterPage"

export default function Footer({ storeData, politics, design, products }: { storeData: IStoreData, politics?: IPolitics, design: Design, products?: IProduct[] }) {
  return (
    <FooterPage storeData={storeData} politics={politics} design={design} products={products} />
  )
}