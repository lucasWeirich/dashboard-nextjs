import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  tagIdentity: string
  modifiedType?: 'dolar'
  isValid?: boolean
  messageInvalid?: string
}

export default function Input({
  label,
  tagIdentity,
  isValid,
  modifiedType,
  messageInvalid,
  placeholder,
  ...props
}: InputProps) {
  return <div className={`flex flex-col relative ${props.disabled && 'opacity-20'}`}>
    <label
      htmlFor={tagIdentity}
      className={`font-mono text-lg`}
    >
      {label}
    </label>

    <div className="flex items-center gap-1 max-w-xs">
      {
        modifiedType === 'dolar' &&
        <span className="text-sm font-mono">
          R$
        </span>
      }

      <input
        {...props}
        id={tagIdentity}
        name={tagIdentity}
        placeholder={placeholder}
        className="text-sm bg-transparent outline-none w-full h-7 appearance-none border-b-2 border-zinc-500 focus:border-purple-500 transition-all"
      />
    </div>

    {
      (!isValid) &&
      <span className="text-[10px] tracking-widest font-mono text-red-400 absolute -bottom-4">
        {messageInvalid}
      </span>
    }
  </div >
}