import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant: 'primary' | 'second' | 'danger'
  label: string
}

export default function Button({ label, variant, ...props }: ButtonProps) {
  const variantsClasses = {
    primary: `bg-purple-600 dark:bg-purple-800 ${!props.disabled && "hover:bg-purple-700 dark:hover:bg-purple-600"}`,
    second: `bg-blue-500 dark:bg-blue-700 ${!props.disabled && "hover:bg-blue-600 dark:hover:bg-blue-600"}`,
    danger: `bg-red-500 dark:bg-red-700 ${!props.disabled && "hover:bg-red-600 dark:hover:bg-red-600"}`,
  }

  return <button
    {...props}
    className={`
        flex w-fit items-center text-white text-center h-9 px-7 rounded-lg lowercase text-lg tracking-[4px] disabled:opacity-60 transition-all
        ${!props.disabled && 'hover:skew-x-6 active:scale-[0.9]'}
        ${variantsClasses[variant]}
      `}
  >
    {label}
  </button>
}