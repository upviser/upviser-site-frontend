import { PageBlog } from '@/components/blog'
import { IPost } from '@/interfaces'

async function fetchPosts () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, { next: { revalidate: 3600 } })
  return res.json()
}

async function fetchStyle () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/style`)
  return res.json()
}

export default async function Page () {

  const posts: IPost[] = await fetchPosts()

  const style: any = await fetchStyle()

  return (
    <PageBlog posts={posts} style={style} />
  )
}