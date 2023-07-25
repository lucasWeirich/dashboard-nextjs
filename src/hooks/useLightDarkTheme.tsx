"use client"

import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import Cookie from "js-cookie";

export async function themeToggle() {
  const { sub } = getUser()

  const token = Cookie.get('token')

  const company = await api.patch(`company/theme/${sub}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  Cookie.set('token', company.data.token)
  
  const htmlClass = document.documentElement.classList
  htmlClass.toggle('dark')
}