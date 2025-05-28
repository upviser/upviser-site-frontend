import { IInfo } from "@/interfaces"

export default function Banner({ info }: { info: IInfo }) {
  return (
    <div className="w-full flex px-4">
      <div className="w-full max-w-[1280px] m-auto flex flex-col gap-2 pt-10 pb-2">
        <h1 className="text-center">{info.title}</h1>
        <p className="text-center">{info.description}</p>
      </div>
    </div>
  )
}