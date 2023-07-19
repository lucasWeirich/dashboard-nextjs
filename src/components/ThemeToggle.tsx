import { themeToggle } from "@/hooks/useLightDarkTheme";
import { SunMoon, Moon } from "lucide-react";

export default function ThemeToggle() {
  return <button
    onClick={themeToggle}
    className="rounded-full w-16 h-8 bg-purple-300 dark:bg-purple-800 flex items-center justify-between relative overflow-hidden"
  >
    <SunMoon
      className="dark:collapse absolute left-2 dark:left-5 transition-[position]"
    />
    <Moon
      className="collapse dark:visible absolute right-5 dark:right-1 transition-[position]"
    />
  </button>
}