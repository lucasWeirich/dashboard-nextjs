"use client"

import Button from "@/components/Button";
import HeaderTitle from "@/components/HeaderTitle";
import Input from "@/components/Input";
import ThemeToggle from "@/components/ThemeToggle";
import { ChangeEvent, FormEvent, useState } from "react";
import LoadingForm from "../loadings/loadingForm";
import { toast } from "react-toastify";

interface SettingsDataProps {
  company_name: string
  sales_goal: string
}
interface SettingsDataIsValidProps {
  company_name: boolean
  sales_goal: boolean
}

const validationRule = {
  company_name: 10, // Number
  sales_goal: 100    // Number
}

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false)
  const db_settings = JSON.parse(localStorage.getItem('settingsDashboard') || '{"company_name": "", "sales_goal": ""}') as SettingsDataProps
  const [dataForm, setDataForm] = useState<SettingsDataProps>({
    company_name: db_settings.company_name,
    sales_goal: db_settings.sales_goal
  })
  const [isValidInputs, setIsValidInputs] = useState<SettingsDataIsValidProps>({
    company_name: db_settings.company_name.length > validationRule.company_name,
    sales_goal: Number(db_settings.sales_goal) >= validationRule.sales_goal
  });

  function handleFormSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isValidInputs.company_name && isValidInputs.sales_goal) {
        localStorage.setItem('settingsDashboard', JSON.stringify(dataForm))
        toast.success("Updated settings!")

      } else {
        toast.error("Error!")
      }
    } catch (err) {
      toast.error(`An error occurred while saving settings.`);
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
    const validateInput = Number(data[name].length || data[name]);

    setIsValidInputs(prev => {
      const newValidate = {
        ...prev,
        [name]: name === 'sales_goal' ?
          validateInput >= validationRule.sales_goal
          :
          validateInput > validationRule.company_name
      }
      return newValidate
    })
  }

  return <>
    <HeaderTitle
      title="settings"
      label="Configure application settings"
    />

    <form
      onSubmit={handleFormSettings}
      className="flex flex-col gap-10"
    >
      <Input
        label="Company Name"
        tagIdentity="company_name"
        placeholder="Company Happy"
        autoComplete="off"
        required
        isValid={isValidInputs.company_name}
        messageInvalid="Company name must be at least 10 characters!"
        value={dataForm.company_name}
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

      <div className="">
        <Button
          type="submit"
          variant="primary"
          label="Save"
          disabled={!(isValidInputs.company_name && isValidInputs.sales_goal)}
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
      <LoadingForm />
    }
  </>
}