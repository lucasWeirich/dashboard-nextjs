"use client"

import { useEffect } from "react";

export function useLightDarkTheme() {
  useEffect(() => {
    const isDark = {
      localStorage: localStorage.theme === 'dark',
      window: !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    const isLight = localStorage.theme === 'light'
    const htmlClass = document.documentElement.classList

    if ((isDark.localStorage || isDark.window) && !isLight) {
      htmlClass.add('dark');
    } else {
      htmlClass.remove('dark');
    }
  }, [])
}

export function themeToggle() {
  let themeNow = 'light' as 'dark' | 'light'
  const html = document.documentElement
  html.classList.toggle('dark')

  if (html.className.includes('dark')) {
    themeNow = 'dark'
  } else {
    themeNow = 'light'
  }

  localStorage.theme = themeNow
}