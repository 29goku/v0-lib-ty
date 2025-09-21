// ...existing code...
"use client"

import React, { useState } from "react"

export default function ViewportToggle({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"auto" | "mobile" | "desktop">("auto")

  const wrapperClass = () => {
    if (mode === "mobile") return "mx-auto w-[412px] sm:w-[430px] shadow-2xl rounded-xl overflow-hidden"
    if (mode === "desktop") return "container mx-auto"
    return "w-full"
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50 flex items-center space-x-2">
        <button
          onClick={() => setMode("auto")}
          className={`px-2 py-1 rounded-md text-sm font-semibold ${mode === "auto" ? "bg-white text-black" : "bg-white/10 text-white"}`}
          aria-pressed={mode === "auto"}
        >
          Auto
        </button>
        <button
          onClick={() => setMode("mobile")}
          className={`px-2 py-1 rounded-md text-sm font-semibold ${mode === "mobile" ? "bg-white text-black" : "bg-white/10 text-white"}`}
          aria-pressed={mode === "mobile"}
        >
          Mobile
        </button>
        <button
          onClick={() => setMode("desktop")}
          className={`px-2 py-1 rounded-md text-sm font-semibold ${mode === "desktop" ? "bg-white text-black" : "bg-white/10 text-white"}`}
          aria-pressed={mode === "desktop"}
        >
          Desktop
        </button>
      </div>

      <div className={wrapperClass()}>{children}</div>
    </div>
  )
}

