import { LayoutDashboard, LayoutPanelLeft, ShoppingBag, DollarSign, BarChartBig, Settings, Ban, PackageOpen } from "lucide-react";
import Link from "next/link";

function LinkMenu({ link, label, children }: {
  link: string
  label: string
  children: React.ReactNode
}) {
  return <Link
    href={link}
    className="flex flex-col items-center gap-1 group"
  >
    {children}
    <span className="text-[12px] font-semibold tracking-[2px] transition-colors group-hover:text-violet-800">{label}</span>
  </Link>
}

export default function SideBar() {
  const stylesIconLinkMenu = {
    size: 30,
    class: "transition-colors group-hover:text-violet-800"
  }

  return <nav className="w-[200px] min-w-[200px] h-full px-5 flex flex-col items-center py-10 bg-zinc-100 dark:bg-zinc-800">
    <Link href="/" className="w-full flex justify-center pb-4 border-b-2 border-zinc-300 dark:border-zinc-600">
      <LayoutDashboard size={55} className="text-purple-700 transition-colors hover:text-purple-600 active:-scale-[0.8]" />
    </Link>

    <div className="mt-14 flex flex-col gap-4">


      <LinkMenu
        link="/"
        label="panel"
      >
        <LayoutPanelLeft
          size={stylesIconLinkMenu.size}
          className={"text-zinc-800 dark:text-zinc-50 transition-colors group-hover:text-violet-800"}
        />
      </LinkMenu>

      <LinkMenu
        link="/products"
        label="products">
        <ShoppingBag
          size={stylesIconLinkMenu.size}
          className={stylesIconLinkMenu.class}
        />
      </LinkMenu>
      
      <LinkMenu
        link="/orders"
        label="orders">
        <PackageOpen
          size={stylesIconLinkMenu.size}
          className={stylesIconLinkMenu.class}
        />
      </LinkMenu>

      <LinkMenu
        link="/sales"
        label="sales">
        <DollarSign
          size={stylesIconLinkMenu.size}
          className={stylesIconLinkMenu.class}
        />
      </LinkMenu>

      <LinkMenu
        link="/report"
        label="report">
        <BarChartBig
          size={stylesIconLinkMenu.size}
          className={stylesIconLinkMenu.class}
        />
      </LinkMenu>

      <LinkMenu
        link="/settings"
        label="settings">
        <Settings
          size={stylesIconLinkMenu.size}
          className={stylesIconLinkMenu.class}
        />
      </LinkMenu>
    </div>
  </nav>
}