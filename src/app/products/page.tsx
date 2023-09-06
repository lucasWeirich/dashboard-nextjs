"use client"

import HeaderTitle from "@/components/HeaderTitle";
import { api } from "@/lib/api";
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";

interface ProductTable {
  id: string
  image: string
  name: string
  price: number
  orders: number
}

export default function Produtcs() {
  const [products, setProducts] = useState<ProductTable[]>([])

  async function getProducts() {
    const token = Cookies.get('token')

    const products = await api.get('/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setProducts(products.data)
  }

  useEffect(() => {
    getProducts()
  }, [])

  return <>
    <HeaderTitle
      title="Products"
      label="Manage all available products"
    />

    <table className="table-fixed w-full">
      <thead>
        <td>Image</td>
        <td>Name</td>
        <td>Price</td>
        <td>Orders</td>
      </thead>
      <tbody>
        {
          products.map((product, index) => (
            <tr key={index}>
              <td>IMAGEM</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.orders}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </>
}