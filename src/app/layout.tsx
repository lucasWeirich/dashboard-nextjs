"use client"

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LoadingInitial from './loadings/loadingInitial'
import { useState, useEffect } from 'react'

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

  return (
    <html lang="en">
      <body className={inter.className}>
        {loading ? <LoadingInitial /> : null}
        {children}
      </body>
    </html>
  )
}
