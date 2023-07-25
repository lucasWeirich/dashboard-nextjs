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
  Cookie.set('token', token, {
    path: '/',
    expires: 60 * 60 * 2 // 2h
  })
}