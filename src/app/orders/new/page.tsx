"use client"

import LoadingDefault from "@/app/loadings/loadingDefault";
import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderNew {
  quantity: number
  statusId: number
  productId: string
}

interface Status {
  id: number
  label: string
  color: string
}

interface Products {
  id: string
  name: string
  price: number,
  quantity_in_stock: number
}

export default function NewOrder() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status[]>([])
  const [products, setProducts] = useState<Products[]>([])
  const [dataProductAtived, setDataProductActived] = useState({ price: 0, quantity_in_stock: 0 })
  const [order, setOrder] = useState<OrderNew | undefined>({
    quantity: 0,
    statusId: 1,
    productId: ''
  });

  async function getStatus() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const status = await api.get('/orders_status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setStatus(status.data)
    } catch (err) {
      // @ts-ignore
      if (err.response.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
      toast.error(`Error: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function getProducts() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const products = await api.get('/products_select', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProducts(products.data)
    } catch (err) {
      // @ts-ignore
      if (err.response.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
      toast.error(`Error: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getStatus();
    getProducts();
  }, [])

  const handleChangeDataOrder = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setOrder((prev) => {
      if (!prev) return;
      let newValue = (name === 'quantity' || name === 'statusId') ? Number(value) : value;

      if (name === 'productId') {
        setOrder((prev: OrderNew | undefined) => {
          if (!prev) return
          return {
            ...prev,
            quantity: 0
          }
        })
      }

      if (name === 'quantity') {
        if (Number(newValue) > dataProductAtived.quantity_in_stock) {
          newValue = dataProductAtived.quantity_in_stock
        } else if (Number(newValue) < 0) {
          newValue = 0
        }
      }

      let newProduct = {
        ...prev,
        [name]: newValue
      }

      return newProduct;
    })
  }

  const handleNewOrder = async (e?: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    if (e) e.preventDefault();

    const token = Cookies.get('token')

    try {
      const newOrder = await api.post(
        "/order",
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

      toast.success('Order Created!');
      router.push(`/orders/details/${newOrder.data.id}`);
    } catch (err) {
      // @ts-ignore
      if (err.response.status === 401) {
        Cookies.remove('token');
        router.push('/login');
      }
      toast.error(`Error: ${err}`)
    } finally {
      setIsLoading(false);
    }
  }

  const getPriceProductSelected = () => {
    products.filter(product => {
      if (!(product.id === order?.productId)) return

      setDataProductActived({
        price: product.price,
        quantity_in_stock: product.quantity_in_stock
      })
    })
  }

  useEffect(() => {
    getPriceProductSelected()
  }, [order?.productId])

  return <>
    <div className="grid grid-cols-2 items-end">
      <HeaderTitle
        title="New Order"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="to create"
          variant="second"
          onClick={() => handleNewOrder()}
        />
      </div>
    </div>

    <form onSubmit={handleNewOrder} className="grid gap-4">
      <div className="flex flex-col">
        <label className="font-mono text-lg">Product:</label>
        <select
          name="productId"
          onChange={handleChangeDataOrder}
          className="outline-none rounded-md p-1 bg-zinc-200 dark:bg-zinc-700 max-w-xs"
        >
          <option value="" selected disabled>Select a product</option>
          {products.map(item => (
            <option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </option>
          ))
          }
        </select>
      </div>

      <div className="flex flex-col">
        <Input
          label="Quantity"
          tagIdentity="quantity"
          placeholder="Enter the quantity of products"
          type="number"
          value={order?.quantity}
          onChange={handleChangeDataOrder}
          min={0}
          max={dataProductAtived.quantity_in_stock}
        />
        {
          dataProductAtived.quantity_in_stock !== 0 &&
          <span className="font-mono opacity-80">
            max: {dataProductAtived.quantity_in_stock}
          </span>
        }
      </div>

      <div className="flex flex-col">
        <label className="font-mono text-lg">Status</label>
        <select
          name="statusId"
          className="outline-none rounded-md p-1 bg-zinc-200 dark:bg-zinc-700 max-w-xs"
          onChange={handleChangeDataOrder}
        >
          <option value="" selected disabled>Select a status</option>
          {status.map(item => {
            if (item.id === 3) return
            return <option
              key={item.id}
              value={item.id}
            >
              {item.label}
            </option>
          })
          }
        </select>
      </div>

      <input
        type="submit"
        className="hidden"
      />
    </form>

    <div className="mt-6">
      <h4 className="text-base font-semibold mb-2">Obs:</h4>
      <table className="table-fixed w-full h-fit text-center">
        <thead className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
          <th className="p-2">Total price</th>
          <th className="p-2">Quantity of product in stock after</th>
        </thead>
        <tbody>
          {
            <tr
              className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700"
            >
              <td className="px-2 py-1">{useFormatMoney((order?.quantity || 0) * dataProductAtived.price)}</td>
              <td className="px-2 py-1">{dataProductAtived.quantity_in_stock - (order?.quantity || 0)}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}