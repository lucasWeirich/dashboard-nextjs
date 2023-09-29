import { dataProduct } from "./product.types"

export interface dataOrder {
  id: string
  productId: number
  quantity: number
  value: number
  statusId: number
  companyId: string
  createdAt: string
  product: {
    id: string
    name: string
    description: string
    image: string
    price: number
    quantity_in_stock: number
    companyId: string
    createdAt: string
  }
}