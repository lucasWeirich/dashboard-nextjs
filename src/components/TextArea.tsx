import { InputHTMLAttributes } from "react";

interface TextAreaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string
  tagIdentity: string
  modifiedType?: 'dolar'
  isValid?: boolean
  messageInvalid?: string
}

export default function TextArea({
  label,
  tagIdentity,
  isValid,
  modifiedType,
  messageInvalid,
  placeholder,
  ...props
}: TextAreaProps) {
  return <div className={`flex flex-col relative ${props.disabled && 'opacity-20'}`}>
    <label
      htmlFor={tagIdentity}
      className={`font-mono text-lg`}
    >
      {label}
    </label>

    <div className="flex items-center gap-1 border-b-2 border-zinc-500">
      {
        modifiedType === 'dolar' &&
        <span className="text-sm font-mono">
          R$
        </span>
      }

      <textarea
        {...props}
        id={tagIdentity}
        name={tagIdentity}
        placeholder={placeholder}
        className="text-sm bg-transparent outline-none w-full h-48 appearance-none focus:border-purple-500 transition-all"
      >
      </textarea>
    </div>

    {
      (!isValid) &&
      <span className="text-[10px] tracking-widest font-mono text-red-400 absolute -bottom-4">
        {messageInvalid}
      </span>
    }
  </div >
}