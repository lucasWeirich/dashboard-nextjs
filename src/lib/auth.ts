import jwtDecode from 'jwt-decode'
import { cookies } from "next/dist/client/components/headers"

interface User {
  sub: string
  name: string
  login: string
  sales_goal: number
  themeDark: boolean
}

export function getUser(): User {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: User = jwtDecode(token)

  return user
}