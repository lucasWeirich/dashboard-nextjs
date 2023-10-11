"use client"

import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Paginator from "@/components/Paginator";
import { api } from "@/lib/api";
import Cookies from 'js-cookie'
import { Trash2, Eye, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingDefault from "../loadings/loadingDefault";
import Input  from "@/components/Input";

interface ProductTable {
  id: string
  image: string
  name: string
  description: string
  price: number
  orders: number
}

export default function Produtcs() {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<ProductTable[][]>([[]])
  const [allProducts, setAllProducts] = useState<ProductTable[]>([])
  const [filter, setFilter] = useState('')
  const [pagination, setPagination] = useState({
    itemsPerPage: 10,
    pageActived: 0,
    qtdPages: 1,
    items: 0,
  })
  const router = useRouter();

  async function getProducts() {
    setIsLoading(true);
    const token = Cookies.get('token')

    try {
      const products = await api.get('/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setAllProducts(products.data)
      paginationProduct(products.data)
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
    getProducts()
  }, [])

  const handleClickViewProduct = (id: string) => {
    router.push(`/products/details/${id}`);
  }

  const handleClickEditProduct = (id: string) => {
    router.push(`/products/edit/${id}`);
  }

  const handleClickNewProduct = () => {
    router.push(`/products/new`);
  }

  const handleDeleteProduct = async (id: string) => {
    const confirmDelete = confirm('deseja deletar');

    if (!confirmDelete) return;

    setIsLoading(true);

    const token = Cookies.get('token')

    try {
      await api.delete(`/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      toast.success('Deleted product!')
      // Update list of products - new request
      getProducts()
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

  const paginationProduct = (data: ProductTable[]) => {
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

    setProducts(paginatedOrders)
  }

  const handleChangeFilter = () => {
    const newProduct = allProducts.filter((product: ProductTable) => {
      return product && product.name.toLowerCase().includes(filter);
    });

    setPagination(prev => {
      return {
        ...prev,
        pageActived: 0
      }
    })
    paginationProduct(newProduct)
  }

  useEffect(() => {
    handleChangeFilter()
  }, [filter])


  return <>
    <div className="flex justify-between gap-10">
      <HeaderTitle
        title="Products"
        label="Manage all available products"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="New Product"
          variant="primary"
          onClick={handleClickNewProduct}
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
      products[0] ?
        <table className="w-full text-sm text-left border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ">
          <thead className="text-xs uppercase p-10 border-b-2 border-zinc-200 dark:border-zinc-700">
            <th className="p-3 w-20"></th>
            <th className="p-3">Name</th>
            <th className="p-3">Description</th>
            <th className="p-3 text-center">Price</th>
            <th className="p-3 text-center">Orders</th>
            <th className="p-3 text-center">Actions</th>
          </thead>
          <tbody className="divide-y-2 divide-zinc-200 dark:divide-zinc-700">
            {
              products[pagination.pageActived].map((product, index) => (
                <tr
                  key={index}
                  className="hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  <td className="p-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={100}
                      height={100}
                    />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3 text-center">{product.price}</td>
                  <td className="p-3 text-center">{product.orders}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 items-center justify-center">
                      <Eye
                        size={20}
                        className="cursor-pointer m-auto text-zinc-400 group hover:text-purple-600 hover:scale-125 transition"
                        onClick={() => handleClickViewProduct(product.id)}
                      />

                      <Pencil
                        size={20}
                        className="cursor-pointer m-auto text-zinc-400 group hover:text-green-600 hover:scale-125 transition"
                        onClick={() => handleClickEditProduct(product.id)}
                      />

                      <Trash2
                        size={20}
                        className="cursor-pointer m-auto text-zinc-400 group hover:text-red-600 hover:scale-125 transition"
                        onClick={() => handleDeleteProduct(product.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        :
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No products found!</p>
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