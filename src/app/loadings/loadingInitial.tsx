import Link from "next/link";

export default function LoadingInitial() {
  return <div className="w-full h-screen z-50 bg-zinc-900 text-zinc-50 flex items-center justify-center fixed">
    <div className="flex gap-2 hover:border-white">
      <div className="flex flex-col gap-2 animate-bounce">
        <div className="w-8 h-11 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
        <div className="w-8 h-8 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
      </div>

      <div className="flex flex-col gap-2 animate-bounce">
        <div className="w-8 h-8 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
        <div className="w-8 h-11 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
      </div>
    </div>

    <Link
      target="_blank"
      href="https://github.com/lucasWeirich"
      className="fixed bottom-5 text-base font-mono font-medium text-zinc-400 hover:text-purple-300"
    >
      {'<'} Lucas Weirich {'/>'}
    </Link>
  </div>
}