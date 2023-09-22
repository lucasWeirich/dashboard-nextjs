"use client"

import Button from "@/components/Button"
import Input from "@/components/Input"
import LoadingDefault from "../loadings/loadingDefault"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { getUser, setNewToken } from "@/lib/auth"
import { toast } from "react-toastify"

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

      setNewToken(token)

      router.push('/')
      const { name } = getUser()
      toast.success(`Welcome ${name}!`)
    } catch (err) {
      // Tratar erro de dados invalidos
      toast.error(`Dados Inválidos!`)
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
      <LoadingDefault />
    }
  </>
}