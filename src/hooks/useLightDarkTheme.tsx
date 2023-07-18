"use client"

import { useEffect } from "react";

export default function useLightDarkTheme() {
  useEffect(() => {
    const isDark = {
      localStorage: localStorage.theme === 'dark',
      window: !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    const isLight = localStorage.theme === 'light'

    if ((isDark.localStorage || isDark.window) && !isLight) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [])

  function themeToggle() {
    const html = document.documentElement
    html.classList.toggle('dark')
    
    if (html.className.includes('dark')) {
      localStorage.theme = 'dark'
    } else {
      localStorage.theme = 'light'
    }
  };

  return themeToggle
}