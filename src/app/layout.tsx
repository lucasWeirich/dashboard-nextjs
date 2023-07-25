"use client"

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LoadingInitial from './loadings/loadingInitial'
import { useState, useEffect } from 'react'
import SideBar from '@/components/SideBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie';
import { getUser } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard in NextJS | Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const hasTokenCookie = !!Cookies.get('token');

  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  const [themeDark, setThemeDark] = useState<boolean>(false)

  async function getThemeNow() {
    if (isLoginPage)
      return setThemeDark(true)

    const { themeDark } = getUser()
    if (themeDark)
      setThemeDark(true)
    else
      setThemeDark(false)
  }

  useEffect(() => {
    getThemeNow()

    if (!hasTokenCookie && !isLoginPage)
      router.push('/')

    if (document.readyState === 'complete')
      setLoading(false);
  }, []);

  return (
    <html lang="en" className={`${themeDark ? 'dark' : ''}`}>
      <body className={`${inter.className} flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`}>
        {loading ? <LoadingInitial /> : null}

        {!loading && <>

          {!isLoginPage &&
            <SideBar />
          }

          <main className="overflow-x-auto w-full py-16 px-10">
            {children}
          </main>

          {/* ToastContainer precisa ficar dentro da verificação de loading para não interferir no loading */}
          <ToastContainer
            position="bottom-right"
            theme={localStorage.theme || 'dark'}
            autoClose={3000}
          />
        </>
        }
      </body>
    </html>
  )
}
