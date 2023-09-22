"use client"

import LoadingDefault from "@/app/loadings/loadingDefault";
import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Input from "@/components/Input";
import TextArea from "@/components/TextArea";
import { api } from "@/lib/api";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

interface ProductNew {
  name: string
  description: string
  image: string
  price: number
  quantity_in_stock: number
}

interface SettingsDataIsValidProps {
  name: boolean
  description: boolean,
  image: boolean,
  price: boolean,
  quantity_in_stock: boolean
}

const validationRule = {
  name: 10, // Number string
  description: 100, // Number string
  image: 1, // verificar a possibilidade do boolean
  price: 1, // Number
  quantity_in_stock: 1 // Number
}

export default function ProductNew() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [coverUploadImage, setCoverUploadImage] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductNew | undefined>({
    name: '',
    description: '',
    image: 'https://www.alfatronic.com.br/loja/assets/images/404.png',
    price: 0,
    quantity_in_stock: 0
  });
  const [isValidInputs, setIsValidInputs] = useState<SettingsDataIsValidProps>({
    name: (product?.name.length || 0) > validationRule.name,
    description: (product?.description.length || 0) > validationRule.description,
    image: (product?.image.length || 0) > validationRule.image,
    price: (product?.price || 0) > validationRule.price,
    quantity_in_stock: (product?.quantity_in_stock || 0) > validationRule.quantity_in_stock,
  });

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
      if (!prev) return;
      const newValue = (name === 'price' || name === 'quantity_in_stock') ? Number(value) : value;

      let newProduct = {
        ...prev,
        [name]: newValue
      }

      return newProduct;
    })
  }

  const handleNewProduct = async (e?: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    if (e) e.preventDefault();

    const token = Cookies.get('token')

    try {
      const newProduct = await api.post(
        "/product",
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

      toast.success('Product Created!');
      router.push(`/products/details/${newProduct.data.id}`);
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

  /* function validationInputs(data: ProductNew, name: keyof SettingsDataProps) {
    const validateInput = String(data[name])

    setIsValidInputs(prev => {
      const newValidate = {
        ...prev,
        [name]: name === 'sales_goal' ?
          Number(validateInput) >= validationRule.sales_goal
          :
          validateInput.length > validationRule.name
      }
      return newValidate
    })
  } */

  return <>
    <div className="grid grid-cols-2 items-end">
      <HeaderTitle
        title="New Product"
      />

      <div className="mb-14 flex justify-end">
        <Button
          label="to create"
          variant="second"
          onClick={() => handleNewProduct()}
        />
      </div>
    </div>

    <form onSubmit={handleNewProduct} className="grid gap-4">
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