import { useFormatMoney } from "@/hooks/useFormatMoney"

interface CardProps {
  title: string
  label: string
  value: number
  type?: 'money'
}

export default function Card(props: CardProps) {
  const formatMoney = useFormatMoney

  return <div className="rounded-md px-4 py-2 border-2 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 hover:dark:bg-zinc-800 transition-all">
    <div className="grid mb-3">
      <h3>{props.title}</h3>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">{props.label}</span>
    </div>

    <span>
      {
        props.type === 'money' ?
          formatMoney(props.value || 0)
          :
          props.value || 0
      }
    </span>
  </div>
}