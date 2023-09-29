"use client"

import LoadingDefault from "@/app/loadings/loadingDefault";
import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import { useFormatDate } from "@/hooks/useFormatDate";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { api } from "@/lib/api";
import { dataOrder } from "@/types/order.types";
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

export default function OrderDetails() {
  const pathname = useParams()
  const { idOrder } = pathname;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<dataOrder>();
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

  async function getOrder() {
    setIsLoading(true);

    const token = Cookies.get('token')

    try {
      const product = await api.get(`/order/${idOrder}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setOrder(product.data)
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
    getOrdersStatus()
    getOrder();
  }, [])

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

  return <>
    <HeaderTitle
      title="Order:"
      label={order?.id}
    />

    <div className="grid gap-10 max-w-3xl">
      <div className="flex gap-5 flex-col">
        <div>
          <h4 className="text-base font-semibold mb-2">Details:</h4>
          <table className="table-fixed w-full h-fit text-center">
            <tbody>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Order</th>
                <td className="px-2 py-1">{order?.id}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Quantity</th>
                <td className="px-2 py-1">{order?.quantity} Units</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Value</th>
                <td className="px-2 py-1">{formatMoney(Number(order?.value))}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Created/Modified</th>
                <td className="px-2 py-1">{formatDate(`${order?.createdAt}`)}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Status</th>
                <td
                  className="px-2 py-1"
                  style={{ background: getStatusColor(Number(order?.statusId)) }}
                >
                  {getStatusText(Number(order?.statusId))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="text-base font-semibold mb-2">Product:</h4>
          
          <Image
            src={order?.product?.image || ''}
            alt={order?.product?.name || ''}
            width={100}
            height={100}
            className="mb-5 mx-auto"
          />

          <table className="table-fixed w-full h-fit text-center">
            <tbody>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Name</th>
                <td className="px-2 py-1">{order?.product.name}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Price</th>
                <td className="px-2 py-1">{formatMoney(Number(order?.product.price))}</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Quantity in Stock</th>
                <td className="px-2 py-1">{order?.product.quantity_in_stock} Units</td>
              </tr>
              <tr className="text-sm border-2 border-zinc-200 dark:border-zinc-700 divide-x-2 divide-zinc-200 dark:divide-zinc-700">
                <th className="text-start p-2 bg-zinc-100 dark:bg-zinc-800">Created</th>
                <td className="px-2 py-1">{formatDate(`${order?.product.createdAt}`)}</td>
              </tr>
            </tbody>
          </table>

          <h4 className="text-base font-semibold mb-2 mt-5">Description of Product:</h4>
          <p>{order?.product.description}</p>
        </div>
      </div>
    </div>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}