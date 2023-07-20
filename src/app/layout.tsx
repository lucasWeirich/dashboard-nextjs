"use client"

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LoadingInitial from './loadings/loadingInitial'
import { useState, useEffect } from 'react'
import SideBar from '@/components/SideBar'
import { useLightDarkTheme } from '@/hooks/useLightDarkTheme'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

        {!loading && <>
          <SideBar />
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
