"use client"

import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Paginator from "@/components/Paginator";
import { api } from "@/lib/api";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingDefault from "../loadings/loadingDefault";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getUser } from "@/lib/auth";
import Card from "@/components/Card";
import ChartAllSales from "@/components/ChartAllSales";

interface ReportProps {
  orders: number
  totalSales: number
  allSales: number
}

export default function Report() {
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<ReportProps>({ orders: 0, totalSales: 0, allSales: 0 })

  const company = getUser()
  const router = useRouter();
  const formatedMoney = useFormatMoney;

  async function getReport() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const report = await api.get('/report', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setReport(report.data)
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
    getReport()
  }, [])

  const handleClickNewOrder = () => {
    router.push(`/orders/new`);
  }

  return <>
    <div className="flex justify-between gap-10">
      <HeaderTitle
        title="Report"
        label="These are your sales reports"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="New Order"
          variant="primary"
          onClick={(handleClickNewOrder)}
        />
      </div>
    </div>

    <div className="grid gap-5">
      <div className="h-fit col-span-2 grid grid-cols-3 gap-x-3 gap-y-5">
        <Card
          title="Orders"
          label="Total in orders"
          value={report.orders}
        />
        <Card
          title="Sales"
          label="Total in sales"
          value={report.totalSales}
          type="money"
        />
        <Card
          title="Accumulated"
          label="Total in sales"
          value={report.allSales}
          type="money"
        />

        <div className="col-span-3">
          <ChartAllSales />
        </div>
      </div>
    </div>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}