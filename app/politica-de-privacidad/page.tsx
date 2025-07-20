import { H1 } from "@/components/ui"

async function fetchPolitics () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/politics`)
  return res.json()
}

export default async function Page () {

  const politics = await fetchPolitics()

  return (
    <div className="w-full p-4 flex">
      <div className="w-full max-w-[1280px] m-auto flex flex-col gap-4">
        <H1 text="Política de privacidad" />
        {
          politics.privacy && politics.privacy !== ''
            ? <p dangerouslySetInnerHTML={{ __html: politics.privacy.replace(/\n/g, "<br/>") }} />
            : ''
        }
      </div>
    </div>
  )
}