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
import { useFormatDate } from "@/hooks/useFormatDate";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import Input from "@/components/Input";

interface SalesTable {
  id: string
  quantity: number
  value: number
  statusId: number
  createdAt: string
  updateStatusAt: string
  nameProduct: string
}

export default function Sales() {
  const [isLoading, setIsLoading] = useState(false)
  const [sales, setSales] = useState<SalesTable[][]>([[]])
  const [allSales, setAllSales] = useState<SalesTable[]>([])
  const [filter, setFilter] = useState('')
  const [pagination, setPagination] = useState({
    itemsPerPage: 10,
    pageActived: 0,
    qtdPages: 1,
    items: 0,
  })
  const router = useRouter();
  const formatedDate = useFormatDate;
  const formatedMoney = useFormatMoney;

  async function getSales() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const orders = await api.get('/sales', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAllSales(orders.data)
      paginationSales(orders.data)
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

  const paginationSales = (data: SalesTable[]) => {
    const qtdPages = Math.ceil((data).length / pagination.itemsPerPage);
    setPagination(prev => {
      return {
        ...prev,
        qtdPages: qtdPages,
        items: data.length
      }
    })
    const paginatedSales = [];

    for (let i = 0; i < qtdPages; i++) {
      const start = i * pagination.itemsPerPage;
      const end = start + pagination.itemsPerPage;
      const group = data.slice(start, end);
      paginatedSales.push(group);
    }

    setSales(paginatedSales)
  }

  const handleChangeFilter = () => {
    const newSales = allSales.filter((order: SalesTable) => {
      return order && order.nameProduct.toLowerCase().includes(filter);
    });

    setPagination(prev => {
      return {
        ...prev,
        pageActived: 0
      }
    })
    paginationSales(newSales)
  }

  useEffect(() => {
    handleChangeFilter()
  }, [filter])


  useEffect(() => {
    getSales()
  }, [])

  const handleClickNewOrder = () => {
    router.push(`/orders/new`);
  }

  return <>
    <div className="grid grid-cols-2 items-end">
      <HeaderTitle
        title="Sales"
        label="Manage all available sales"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="New Order"
          variant="primary"
          onClick={(handleClickNewOrder)}
        />
      </div>
    </div>

    <div className="mb-10">
      <Input
        label="Filter"
        tagIdentity="search_order"
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search the product..."
      />
    </div>
    
    {
      sales[0] ?
        <table className="w-full text-sm text-left border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ">
          <thead className="text-xs uppercase p-10 border-b-2 border-zinc-200 dark:border-zinc-700">
            <th className="p-3 text-center">Product</th>
            <th className="p-3 text-center">Quantity</th>
            <th className="p-3 text-center">Value</th>
            <th className="p-3 text-center">Created/Modified</th>
          </thead>
          <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-700">
            {
              sales[pagination.pageActived].map((sale, index) => {
                return <tr
                  key={index}
                  className="hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  <td className="p-3 text-center">{sale.nameProduct}</td>
                  <td className="p-3 text-center">{sale.quantity} Units</td>
                  <td className="p-3 text-center">{formatedMoney(sale.value)}</td>
                  <td className="p-3 text-center">{formatedDate(sale.createdAt)}</td>
                </tr>
              })
            }
          </tbody>
        </table>
        :
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No sales found!</p>
    }

    {
      pagination.qtdPages > 1 &&
      <div className="my-10">
        <Paginator
          pages={pagination.qtdPages}
          totalItems={pagination.items}
          onClickActived={(index: number) => setPagination(prev => {
            return { ...prev, pageActived: index }
          })}
        />
      </div>
    }
    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}