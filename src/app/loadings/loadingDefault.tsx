import { CircleDashed } from "lucide-react";

export default function LoadingDefault() {
  return <div className="w-full h-screen z-50 bg-zinc-900/50 text-zinc-50 flex items-center justify-center fixed top-0 left-0">
    <div className="flex gap-2">
      <CircleDashed
        size={55}
        className="text-purple-700 animate-spin"
      />
    </div>
  </div>
}