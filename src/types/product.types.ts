export interface dataProduct {
  id: string
  name: string
  description: string
  image: string
  price: number
  quantity_in_stock: number
  companyId: string
  createdAt: string
  Order: {
    id: string
    productId: string
    quantity: number
    value: number
    statusId: number
    createdAt: string
    companyId: string
  }[]
  Sales: {
    id: string
    productId: string
    quantity: number
    value: number
    createdAt: string
    companyId: string
  }[]
}