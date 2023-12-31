"use client"

import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Input from "@/components/Input";
import ThemeToggle from "@/components/ThemeToggle";
import { ChangeEvent, FormEvent, useState } from "react";
import LoadingDefault from "../loadings/loadingDefault";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { getUser, setNewToken } from "@/lib/auth";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface SettingsDataProps {
  name: string
  sales_goal: number
}
interface SettingsDataIsValidProps {
  name: boolean
  sales_goal: boolean
}

const validationRule = {
  name: 10, // Number
  sales_goal: 100    // Number
}

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const company = getUser()

  const router = useRouter();

  const [dataForm, setDataForm] = useState<SettingsDataProps>({
    name: company.name,
    sales_goal: company.sales_goal
  })
  const [isValidInputs, setIsValidInputs] = useState<SettingsDataIsValidProps>({
    name: company.name.length > validationRule.name,
    sales_goal: company.sales_goal >= validationRule.sales_goal
  });

  async function handleFormSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const token = Cookies.get('token')

    try {
      const companyUpdate = await api.put(`company/${company.sub}`,
        dataForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setNewToken(companyUpdate.data.token)
      toast.success('Updated settings!')
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

  function handleDataInput(e: ChangeEvent<HTMLInputElement>) {
    const { name, type, value } = e.target

    setDataForm(prev => {
      const newData = {
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }
      validationInputs(newData, name as keyof SettingsDataProps)
      return newData
    })
  }

  function validationInputs(data: SettingsDataProps, name: keyof SettingsDataProps) {
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
  }

  return <>
    <HeaderTitle
      title="Settings"
      label="Configure application settings"
    />

    <form
      onSubmit={handleFormSettings}
      className="flex flex-col gap-10"
    >
      <Input
        label="Company Name"
        tagIdentity="name"
        placeholder="Company Happy"
        autoComplete="off"
        required
        isValid={isValidInputs.name}
        messageInvalid="Company name must be at least 10 characters!"
        value={dataForm.name}
        onChange={handleDataInput}
      />

      <Input
        type="number"
        modifiedType="dolar"
        label="Sales Goal"
        tagIdentity="sales_goal"
        placeholder="0,00"
        autoComplete="off"
        required
        isValid={isValidInputs.sales_goal}
        messageInvalid="Company goal must be at least $100.00"
        value={dataForm.sales_goal}
        onChange={handleDataInput}
      />

      <Input
        type="password"
        label="New password   ( Option being developed )"
        tagIdentity="new_password"
        placeholder="*********"
        autoComplete="off"
        disabled
      />

      <div>
        <Button
          type="submit"
          variant="primary"
          label="Save"
          disabled={!(isValidInputs.name && isValidInputs.sales_goal)}
        />
      </div>
    </form>

    <div className="mt-14 border-t-2 border-zinc-200 dark:border-zinc-800">
      <h3 className="my-5 text-[1.5rem] leading-tight font-mono font-bold first-letter:uppercase lowercase">
        Appearance
      </h3>

      <div className="flex items-start flex-col gap-2">
        <ThemeToggle />
      </div>
    </div>

    {
      isLoading &&
      <LoadingDefault />
    }
  </>
}