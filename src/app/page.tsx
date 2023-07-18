"use client"

import useLightDarkTheme from "@/hooks/useLightDarkTheme"

export default function Home() {
  const themeToggle = useLightDarkTheme()

  return (
    <main className='h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100'>
      <h2>HOME</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus consectetur eum laboriosam cupiditate velit reiciendis a explicabo veritatis quae aliquam sequi distinctio voluptate quisquam quas consequatur, quasi voluptas saepe doloribus.
      </p>

      <button onClick={themeToggle}>MUDAR THEME</button>
    </main>
  )
}
