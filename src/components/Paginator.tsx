import { useState } from "react";

interface PaginatorProps {
  pages: number
  totalItems: number
  onClickActived: (index: number) => void
}

export default function Paginator({ pages, totalItems, onClickActived }: PaginatorProps) {

  const [qtd, setQtd] = useState(new Array(pages).fill(null));
  const [actived, setActived] = useState(1);

  const handleClick = (index: number) => {
    onClickActived(index);
    setActived(index);
  }

  return <div className="flex justify-between items-center">
    <div className="flex items-center justify-center rounded-md w-fit overflow-hidden divide-x-[1px] divide-zinc-300 dark:divide-zinc-700 bg-zinc-200 dark:bg-zinc-800">
      {
        qtd.map((page, index) => {
          return < button
            key={index}
            onClick={() => handleClick(index)}
            className={`py-1 px-3 hover:bg-zinc-300 dark:hover:bg-zinc-700 ${actived === index && 'bg-zinc-300 dark:bg-zinc-700'}`}
            disabled={actived === index}
          >
            {index + 1}
          </button>
        })
      }
    </div >
    <span className="text-zinc-400 dark:text-zinc-600">
      ( total: {totalItems} items )
    </span>
  </div>
}