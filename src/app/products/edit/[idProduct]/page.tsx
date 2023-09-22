"use client"

import LoadingDefault from "@/app/loadings/loadingDefault";
import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ProductEdit {
  name: string
  description: string
  image: string
  price: number
  quantity_in_stock: number
}

export default function ProductEdit() {
  const pathname = useParams();
  const { idProduct } = pathname;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<ProductEdit>();
  const [coverUploadImage, setCoverUploadImage] = useState<string | null>(null);
  const [nameLastProduct, setNameLastProduct] = useState('');

  async function getProduct() {
    setIsLoading(true);

    const token = Cookies.get('token')

    try {
      const product = await api.get(`/product/edit/${idProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setProduct(product.data);
      setNameLastProduct(product.data.name);
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
    getProduct();
  }, [])

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setCoverUploadImage(previewURL)
  }

  const handleChangeDataProduct = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProduct((prev) => {
      if (!prev) return;const newValue = (name === 'price' || name === 'quantity_in_stock') ? Number(value) : value;

      let newProduct = {
        ...prev,
        [name]: newValue
      }

      return newProduct;
    })
  }

  const handleUpdateProduct = async (e?: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    if (e) e.preventDefault();

    const token = Cookies.get('token')

    try {
      await api.put(
        `/product/${idProduct}`,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      toast.success('Product Update!');
      router.push('/products');
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

  return <>
    <div className="grid grid-cols-2 items-end">
      <HeaderTitle
        title={`Editing: ${nameLastProduct || 'Undefined'}`}
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="update"
          variant="second"
          onClick={() => handleUpdateProduct()}
        />
      </div>
    </div>

    <form onSubmit={handleUpdateProduct} className="grid gap-4">
      <div className="relative rounded-2xl overflow-hidden w-40 h-40 b-zinc-500">
        {/* UPLOAD OF IMAGE */}
        <Image
          src={coverUploadImage || product?.image || ''}
          alt={coverUploadImage || product?.image || ''}
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
        <input
          type="file"
          onChange={handleUploadImage}/* Ainda não atualiza */
          accept="image/*"
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <Input
        label="Name"
        tagIdentity="name"
        placeholder="Enter the name of the product"
        value={product?.name}
        onChange={handleChangeDataProduct}
      />

      <Input
        label="Price"
        tagIdentity="price"
        modifiedType="dolar"
        type="number"
        placeholder="0,00"
        value={product?.price}
        onChange={handleChangeDataProduct}
      />

      <Input
        label="Quantity in Stock"
        tagIdentity="quantity_in_stock"
        type="number"
        placeholder="99"
        value={product?.quantity_in_stock}
        onChange={handleChangeDataProduct}
      />

      <TextArea
        label="Description"
        tagIdentity="description"
        placeholder="Enter the product description"
        value={product?.description}
        onChange={handleChangeDataProduct}
      />

      <input
        type="submit"
        className="hidden"
      />
    </form>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}