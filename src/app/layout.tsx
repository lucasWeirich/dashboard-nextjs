"use client"

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LoadingInitial from './loadings/loadingInitial'
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from 'react'
import SideBar from '@/components/SideBar'
import { useLightDarkTheme } from '@/hooks/useLightDarkTheme'
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === 'complete')
      setLoading(false);
  }, []);

  useLightDarkTheme()

  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`}>
        {loading ? <LoadingInitial /> : null}
        <ToastContainer
          position="bottom-right"
          theme={localStorage.theme || 'dark'}
          autoClose={3000}
        />

        <SideBar />
        <main className="overflow-x-auto w-full py-16 px-10">
          {children}
        </main>
      </body>
    </html>
  )
}
