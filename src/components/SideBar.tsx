import { LayoutDashboard, LayoutPanelLeft, ShoppingBag, DollarSign, BarChartBig, Settings, Ban } from "lucide-react";
import Link from "next/link";

function LinkMenu({ link, label, icon }: {
  link: string
  label: string
  icon: string
}) {
  let iconLink = <Ban />

  switch (icon) {
    case 'LayoutPanelLeft':
      iconLink = <LayoutPanelLeft />
      break
    case 'ShoppingBag':
      iconLink = <ShoppingBag />
      break
    case 'DollarSign':
      iconLink = <DollarSign />
      break
    case 'BarChartBig':
      iconLink = <BarChartBig />
      break
    case 'Settings':
      iconLink = <Settings />
      break
    default:
      <Ban />
      break
  }

  return <Link
    href={link}
    className="flex flex-col items-center gap-1"
  >
    {iconLink}
    <span className="uppercase text-sm">{label}</span>
  </Link>
}

export default function SideBar() {
  return <nav className="w-[200px] min-w-[200px] h-full px-5 flex flex-col items-center py-10 bg-zinc-100 dark:bg-zinc-800">
    <Link href="/" className="w-full flex justify-center pb-4 border-b-2 border-zinc-300 dark:border-zinc-600">
      <LayoutDashboard size={55} className="text-purple-700 transition-colors hover:text-purple-600 active:-scale-[0.8]" />
    </Link>

    <div className="mt-14 flex flex-col gap-4">
      <LinkMenu
        link="/"
        label="painel"
        icon="LayoutPanelLeft"
      />
      <LinkMenu
        link="/"
        label="produtos"
        icon="ShoppingBag"
      />
      <LinkMenu
        link="/"
        label="vendas"
        icon="DollarSign"
      />
      <LinkMenu
        link="/"
        label="relatório"
        icon="DollarSign"
      />
      <LinkMenu
        link="/"
        label="configuracao"
        icon="Settings"
      />
    </div>
  </nav>
}