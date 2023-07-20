"use client"

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LoadingInitial() {
  const [loadTimeoutReached , setLoadTimeoutReached ] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoadTimeoutReached(true)
    }, 5000)
  }, [])

  return <div className="w-full h-screen z-50 bg-zinc-900 text-zinc-50 flex items-center gap-4 justify-center fixed top-0 left-0">
    <div className="flex gap-2">
      <div className="flex flex-col gap-2 animate-bounce">
        <div className="w-8 h-11 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
        <div className="w-8 h-8 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
      </div>

      <div className="flex flex-col gap-2 animate-bounce">
        <div className="w-8 h-8 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
        <div className="w-8 h-11 border-4 border-purple-800 rounded-lg shadow-sm shadow-zinc-950" />
      </div>
    </div>

    {
      loadTimeoutReached && 
      <span className="absolute mt-52 animate-pulse text-zinc-200 transition-all">
        Oops! Charging is taking a while. Please refresh the page after a few seconds.
      </span>
    }

    <Link
      target="_blank"
      href="https://github.com/lucasWeirich"
      className="fixed bottom-5 text-base font-mono font-medium text-zinc-400 hover:text-purple-300"
    >
      {'<'} Lucas Weirich {'/>'}
    </Link>
  </div>
}