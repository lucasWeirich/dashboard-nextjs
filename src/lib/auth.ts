import jwtDecode from 'jwt-decode'
import Cookies from "js-cookie"
import Cookie from 'js-cookie'

interface User {
  sub: string
  name: string
  login: string
  sales_goal: number
  themeDark: boolean
}

export function getUser(): User {
  const token = Cookies.get('token')

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: User = jwtDecode(token)

  return user
}

export function setNewToken(token: string) {
  const currentDate = new Date()
  const expirationDate = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000); // Adicionando 2 horas em milissegundos

  Cookie.set('token', token, {
    path: '/',
    expires: expirationDate
  })
}