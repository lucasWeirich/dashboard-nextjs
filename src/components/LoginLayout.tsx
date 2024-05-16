"use client"

import React, { useState, useEffect } from 'react';
import { Inter } from 'next/font/google';
import { themeToggle } from '@/hooks/useLightDarkTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === 'complete') setLoading(false);
  }, []);

  themeToggle();

  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100`}>
        {loading ? null : (
          <>
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
        )}
      </body>
    </html>
  );
}