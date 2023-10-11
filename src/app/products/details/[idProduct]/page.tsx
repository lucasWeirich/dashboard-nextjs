"use client"

import LoadingDefault from "@/app/loadings/loadingDefault";
import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import { useFormatDate } from "@/hooks/useFormatDate";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { api } from "@/lib/api";
import { dataProduct } from "@/types/product.types";
import Cookies from "js-cookie";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface OrderStatus {
  id: number
  label: string
  color: string
}

export default function ProductDetails() {
  const pathname = useParams()
  const { idProduct } = pathname;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  const [product, setProduct] = useState<dataProduct>();
  const [ordersStatus, setOrdersStatus] = useState<OrderStatus[]>([])

  const formatDate = useFormatDate;
  const formatMoney = useFormatMoney;

  async function getOrdersStatus() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const ordersStatus = await api.get('/orders_status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setOrdersStatus(ordersStatus.data)
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

  async function getProduct() {
    setIsLoading(true);

    const token = Cookies.get('token')

    try {
      const product = await api.get(`/product/${idProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProduct(product.data)
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
    getOrdersStatus();
    getProduct();
  }, [])

  const handleLinkEdit = () => {
    router.push(`/products/edit/${idProduct}`);
  }

  const statusTextCache = new Map();
  const getStatusText = (id: number) => {
    if (statusTextCache.has(id)) {
      return statusTextCache.get(id);
    }

    const status = ordersStatus.find((status) => status.id === id);

    if (status) {
      statusTextCache.set(id, status.label);
      return status.label;
    }

    return 'undefined';
  }

  const statusColorCache = new Map();
  const getStatusColor = (id: number) => {
    if (statusColorCache.has(id)) {
      return statusColorCache.get(id);
    }

    const status = ordersStatus.find((status) => status.id === id);

    if (status) {
      statusColorCache.set(id, status.color);
      return status.color;
    }

    return '#333';
  }

  const getSales = () => {
    return Number(product?.Order.filter(order => order.statusId === 2).length)
  }

  return <>
    <div className="flex justify-between gap-10">
      <HeaderTitle
        title={product?.name || 'Undefind'}
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="edit"
          variant="primary"
          onClick={handleLinkEdit}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-10">
      <div>
        <Image
          src={product?.image || ''}
          alt={product?.name || ''}
          width={300}
          height={300}
          className="mb-10"
        />

        <textarea
          className="w-full h-screen min-h-[100px] border-none outline-none resize-none p-2 bg-transparent text-inherit"
          readOnly
          value={product?.description}
        >
        </textarea>
      </div>

      <div className="flex gap-5 flex-col">
        <div>
          <h4 className="text-base font-semibold mb-2">Details:</h4>
          <table className="table-fixed w-full h-fit text-center">
            <tbody>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Price</th>
                <td className="px-2 py-1">{useFormatMoney(Number(product?.price))}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Quantity in stock</th>
                <td className="px-2 py-1">{product?.quantity_in_stock}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Registered</th>
                <td className="px-2 py-1">{formatDate(product?.createdAt || '')}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">{Number(product?.Order.length) > 1 ? 'Orders' : 'Order'}</th>
                <td className="px-2 py-1">{product?.Order.length}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Sales</th>
                <td className="px-2 py-1">{getSales()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {
          product?.Order[0] &&
          <div>
            <h4 className="text-base font-semibold mb-2">{product.Order.length > 1 ? 'Orders' : 'Order'}:</h4>
            <table className="table-fixed w-full h-fit text-center">
              <thead className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="p-2">Quantity</th>
                <th className="p-2">Value</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
              </thead>
              <tbody>
                {
                  product.Order.map((item, index) => (
                    <tr
                      key={index}
                      className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700"
                    >
                      <td className="px-2 py-1">{item.quantity}</td>
                      <td className="px-2 py-1">{formatMoney(item.value || 0)}</td>
                      <td className="px-2 py-1">{formatDate(item.createdAt || '')}</td>
                      <td
                        className="px-2 py-1"
                        style={{ background: getStatusColor(item.statusId) }}
                      >
                        {getStatusText(item.statusId)}
                      </td>
                    </tr>
                  )).reverse()
                }
              </tbody>
            </table>
          </div>
        }

        {
          product?.Sales[0] &&
          <div>
            <h4 className="text-base font-semibold mb-2">Sales:</h4>
            <table className="table-fixed w-full h-fit text-center">
              <thead className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="p-2">Quantity</th>
                <th className="p-2">Value</th>
                <th className="p-2">Date</th>
              </thead>
              <tbody>
                {
                  product.Sales.map((item, index) => (
                    <tr
                      key={index}
                      className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700"
                    >
                      <td className="px-2 py-1">{item.quantity}</td>
                      <td className="px-2 py-1">{formatMoney(item.value || 0)}</td>
                      <td className="px-2 py-1">{formatDate(item.createdAt || '')}</td>
                    </tr>
                  )).reverse()
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}