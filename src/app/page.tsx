"use client"

import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Paginator from "@/components/Paginator";
import { api } from "@/lib/api";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingDefault from "./loadings/loadingDefault";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getUser } from "@/lib/auth";
import Card from "@/components/Card";
import Image from "next/image";
import Link from "next/link";
import ChartSales from "@/components/ChartSales";
import GaugeSales from "@/components/GaugeSales";

interface MetricsProps {
  orders: number
  totalSales: number
  allSales: number
}

interface TopSellingProductsProps {
  id: string
  image: string
  name: string
  price: number
  orders: number
}

export default function Panel() {
  const [isLoading, setIsLoading] = useState(false)
  const [metrics, setMetrics] = useState<MetricsProps>({ orders: 0, totalSales: 0, allSales: 0 })
  const [topSellingProducts, setTopSellingProducts] = useState<TopSellingProductsProps[]>([])

  const company = getUser()
  const router = useRouter();
  const formatedMoney = useFormatMoney;

  async function getMetrics() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const metrics = await api.get('/metrics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setMetrics(metrics.data)
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

  async function getTopSellingProducts() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const topSellingProducts = await api.get('/top-selling-products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setTopSellingProducts(topSellingProducts.data)
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
    getMetrics()
    getTopSellingProducts()
  }, [])

  const handleClickNewOrder = () => {
    router.push(`/orders/new`);
  }

  return <>
    <div className="flex justify-between gap-10">
      <HeaderTitle
        title={`Hello, ${company.name}!`}
        label="Check your results today"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="New Order"
          variant="primary"
          onClick={(handleClickNewOrder)}
        />
      </div>
    </div>

    <div className="grid grid-cols-3 gap-10 gap-y-10">
      <div className="h-fit col-span-2 grid grid-cols-3 gap-x-3 gap-y-5">
        <Card
          title="Orders"
          label="Total in orders today"
          value={metrics.orders}
        />
        <Card
          title="Sales"
          label="Total in sales today"
          value={metrics.totalSales}
          type="money"
        />
        <Card
          title="Accumulated"
          label="Total in sales"
          value={metrics.allSales}
          type="money"
        />

        <div className="col-span-3">
          <ChartSales />
        </div>
      </div>

      <div className="col-span-1 grid gap-5">
        <div className="rounded-md py-5 px-3 border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 hover:dark:bg-zinc-800 transition-all">
          <h3 className="text-center font-semibold">Daily sales goals</h3>

          <div className="mt-5 flex flex-col items-center gap-3">
            {
              <GaugeSales
                percentage={metrics.totalSales}
              />
            }

            <span>{formatedMoney(metrics.totalSales)} / {formatedMoney(company.sales_goal)}</span>
          </div>
        </div>

        <div className="rounded-md py-5 px-3 border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 hover:dark:bg-zinc-800 transition-all">
          <h3 className="text-center font-semibold">Top selling products</h3>

          <div className="mt-5 grid gap-3">
            {
              topSellingProducts.map((product, index) => (
                <Link
                  key={index}
                  href={`/products/details/${product.id}`}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <Image
                    src={product.image}
                    width={50}
                    height={50}
                    alt={product.name}
                    className="rounded-lg aspect-square object-cover"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium leading-4">{product.name}</h3>
                    <span className="text-xs opacity-80">{formatedMoney(product.price)}</span>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}