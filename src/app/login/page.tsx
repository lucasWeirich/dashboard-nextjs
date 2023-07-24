"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import Cookie from 'js-cookie'
import LoadingForm from "../loadings/loadingForm"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleFormLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      login: formData.get('login'),
      password: formData.get('password'),
    }

    try {
      const loginResponse = await api.post('/login', data);
      const { token } = loginResponse.data

      Cookie.set('token', token, {
        expires: 60 * 60 * 2, // 2h in seconds
        path: '/'
      })

      router.push('/')
    } catch (err) {
      // Tratar erro de dados invalidos
      alert('Error - Dados Inválidos')
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return <>
    <form
      onSubmit={handleFormLogin}
      className="flex flex-col justify-center gap-4 m-auto max-w-xs h-full text-center"
    >
      <Input
        label="Login"
        tagIdentity="login"
        placeholder="login@email.com"
        required
        style={{ textAlign: 'center' }}
      />

      <Input
        type="password"
        label="Password"
        tagIdentity="password"
        placeholder="***********"
        autoComplete="off"
        required
        style={{ textAlign: 'center' }}
      />

      <div className="flex justify-center">
        <Button
          type="submit"
          variant="primary"
          label="Sign In"
        />
      </div>
    </form>

    {
      isLoading &&
      <LoadingForm />
    }
  </>
}