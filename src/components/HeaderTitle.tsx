interface HeaderTitleProps {
  title: string
  label?: string
}

export default function HeaderTitle({ title, label }: HeaderTitleProps) {
  return <header className="flex flex-col gap-1 mb-14">
    <h2 className="text-[2rem] leading-tight font-mono font-bold">
      {title}
    </h2>
    {
      label &&
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
    }
  </header>
}