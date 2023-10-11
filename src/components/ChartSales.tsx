"use client"

import { api } from '@/lib/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Chart } from 'react-google-charts';
import { toast } from 'react-toastify';

const data = [
  ["Month", "Total Sales"],
  ["January", 1000],
  ["February", 1200],
  ["March", 800],
  ["April", 1500],
  ["May", 2000],
  ["June", 1800],
  ["July", 2200],
  ["August", 2500],
  ["September", 2100],
  ["October", 1900],
  ["November", 2300],
  ["December", 2800],
];

const options = {
  bars: "vertical",
};

interface AllSalesProps { }

export default function ChartSales() {
  const [isLoading, setIsLoading] = useState(false)
  const [sales, setSales] = useState<AllSalesProps[]>([["Month", "Total Sales"], ['not found', 0]])

  const router = useRouter();

  async function getMetricsSales() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const allSales = await api.get('/year-sales-metrics', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (allSales.data.allSales) {
        setSales([
          ["Month", "Total Sales"],
          ...allSales.data.allSales,
        ])
      }

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
    getMetricsSales();
  }, [])

  useEffect(() => {
    console.log(sales)
  }, [sales])

  return <>
    {
      isLoading ?
        <div className='min-h-[350px] w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'>
          loading...
        </div>
        :
        <Chart
          chartType="Line"
          width="100%"
          height="auto"
          className="min-h-[350px] bg-white rounded-xl p-2 overflow-hidden border-2 border-zinc-200 dark:border-zinc-700"
          data={sales}
          options={options}
        />
    }
  </>
}