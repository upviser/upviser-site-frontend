export interface ICategory {
  _id: string
  category: string
  slug: string
  image?: string
  banner?: string
  description: string
  titleSeo?: string
  descriptionSeo?: string
  
  createdAt: string
  updatedAt: string
}