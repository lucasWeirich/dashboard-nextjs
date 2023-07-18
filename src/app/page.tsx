"use client"

import useLightDarkTheme from "@/hooks/useLightDarkTheme"

export default function Home() {
  const themeToggle = useLightDarkTheme()

  return (
    <div className="">
      <h2>HOME</h2>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus consectetur eum laboriosam cupiditate velit reiciendis a explicabo veritatis quae aliquam sequi distinctio voluptate quisquam quas consequatur, quasi voluptas saepe doloribus.
      </p>

     <br /><br />
      <button onClick={themeToggle}>MUDAR THEME</button>
    </div>
  )
}
