"use client"

import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Paginator from "@/components/Paginator";
import { api } from "@/lib/api";
import Cookies from 'js-cookie'
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingDefault from "../loadings/loadingDefault";
import { useFormatDate } from "@/hooks/useFormatDate";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import Input from "@/components/Input";

interface OrderTable {
  id: string
  quantity: number
  value: number
  statusId: number
  createdAt: string
  updateStatusAt: string
  nameProduct: string
}

interface OrderStatus {
  id: number
  label: string
  color: string
}

export default function Orders() {
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState<OrderTable[][]>([[]])
  const [allOrders, setAllOrders] = useState<OrderTable[]>([])
  const [ordersStatus, setOrdersStatus] = useState<OrderStatus[]>([])
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

  async function getOrders() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const orders = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAllOrders(orders.data)
      paginationOrder(orders.data)
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

  const paginationOrder = (data: OrderTable[]) => {
    const qtdPages = Math.ceil((data).length / pagination.itemsPerPage);
    setPagination(prev => {
      return {
        ...prev,
        qtdPages: qtdPages,
        items: data.length
      }
    })
    const paginatedOrders = [];

    for (let i = 0; i < qtdPages; i++) {
      const start = i * pagination.itemsPerPage;
      const end = start + pagination.itemsPerPage;
      const group = data.slice(start, end);
      paginatedOrders.push(group);
    }

    setOrders(paginatedOrders)
  }

  const handleChangeFilter = () => {
    const newOrders = allOrders.filter((order: OrderTable) => {
      return order && order.nameProduct.toLowerCase().includes(filter);
    });

    setPagination(prev => {
      return {
        ...prev,
        pageActived: 0
      }
    })
    paginationOrder(newOrders)
  }

  useEffect(() => {
    handleChangeFilter()
  }, [filter])


  useEffect(() => {
    getOrdersStatus()
    getOrders()
  }, [])

  const handleClickViewOrder = (id: string) => {
    router.push(`/orders/details/${id}`);
  }

  const handleClickNewOrder = () => {
    router.push(`/orders/new`);
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

  const handleOpenSelectEdit = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    const select = e.currentTarget.querySelector('ul')

    if (!select) return
    closeSelectEditOpened()

    select.classList.remove('opacity-0', '-z-10')
    select.classList.add('z-10', 'opacity-1')
  }

  const closeSelectEditOpened = () => {
    const selects = document.querySelectorAll('.SelectEdit')

    selects.forEach(select => {
      select.classList.remove('z-10', 'opacity-1')
      select.classList.add('opacity-0', '-z-10')
    })
  }

  async function handleUpdateStatus(id: string, statusId: number) {
    const confirmed = confirm('Confirm update status?');

    if (!confirmed) return
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      if (id !== '' && statusId !== 0) {
        await api.put(`/order/${id}`,
          { statusId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

        toast.success('Status Updated!');
      }

      closeSelectEditOpened();
      getOrders();
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

  return <>
    <div className="grid grid-cols-2 items-end">
      <HeaderTitle
        title="Orders"
        label="Manage all available orders"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="New Order"
          variant="primary"
          onClick={handleClickNewOrder}
        />
      </div>
    </div>

    <div className="mb-10">
      <Input
        label="Filter"
        tagIdentity="search_order"
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search the order by product..."
      />
    </div>

    {
      orders[0] ?
        <table className="w-full text-sm text-left border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ">
          <thead className="text-xs uppercase p-10 border-b-2 border-zinc-200 dark:border-zinc-700">
            <th className="p-3 text-center">Product</th>
            <th className="p-3 text-center">Quantity</th>
            <th className="p-3 text-center">Value</th>
            <th className="p-3 text-center">Created</th>
            <th className="p-3 text-center">Updated Status</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Actions</th>
          </thead>
          <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-700">
            {
              orders[pagination.pageActived].map((order, index) => {
                return <tr
                  key={index}
                  className="hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  <td className="p-3 text-center">{order.nameProduct}</td>
                  <td className="p-3 text-center">{order.quantity} Units</td>
                  <td className="p-3 text-center">{formatedMoney(order.value)}</td>
                  <td className="p-3 text-center">{formatedDate(order.createdAt)}</td>
                  <td className="p-3 text-center">{formatedDate(order.updateStatusAt)}</td>
                  <td className="p-3 text-center relative">
                    <div
                      className="rounded-md py-1 px-4 max-w-[120px] text-center m-auto flex justify-center cursor-pointer text-white"
                      style={{ background: getStatusColor(order.statusId) }}
                      onClick={(e) => handleOpenSelectEdit(e)}
                    >
                      {getStatusText(order.statusId)}

                      <ul
                        className="SelectEdit opacity-0 absolute top-0 left-0 rounded-e-md rounded-s-md shadow-md shadow-zinc-200 dark:shadow-zinc-700 w-full text-center bg-zinc-100 dark:bg-zinc-800 -z-10 overflow-hidden"
                      >
                        {
                          ordersStatus.map(status => {
                            if (order.statusId !== 1 || status.id === 1) return
                            return <li
                              key={status.id}
                              value={status.id}
                              className="cursor-pointer py-1 hover:opacity-80"
                              style={{ background: status.color }}
                              onClick={() => handleUpdateStatus(order.id, status.id)}
                            >
                              {status.label}
                            </li>
                          })
                        }
                      </ul>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 items-center justify-center">
                      <Eye
                        size={20}
                        className="cursor-pointer m-auto text-zinc-400 group hover:text-purple-600 hover:scale-125 transition"
                        onClick={() => handleClickViewOrder(order.id)}
                      />
                    </div>
                  </td>
                </tr>
              })
            }
          </tbody>
        </table>
        :
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No orders found!</p>
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