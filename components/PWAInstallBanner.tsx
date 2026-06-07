"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true)
      return
    }

    // Check if previously dismissed
    if (sessionStorage.getItem("pwa-banner-dismissed")) {
      setDismissed(true)
      return
    }

    // iOS detection
    const ua = navigator.userAgent
    if (/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)) {
      setIsIOS(true)
      return
    }

    // Android / Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    await prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === "accepted") setPrompt(null)
  }

  const handleDismiss = () => {
    sessionStorage.setItem("pwa-banner-dismissed", "1")
    setDismissed(true)
    setPrompt(null)
    setIsIOS(false)
  }

  if (isStandalone || dismissed) return null
  if (!prompt && !isIOS) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-2xl flex items-start gap-3">
        <div className="text-2xl shrink-0">📱</div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">Install the App</p>
          {isIOS ? (
            <p className="text-gray-400 text-xs mt-0.5">
              Tap <span className="text-white">Share</span> then{" "}
              <span className="text-white">"Add to Home Screen"</span> to install for free.
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">
              Install for free — works offline, no app store needed.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 shrink-0">
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Install
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="text-gray-500 text-xs px-3 py-1.5 rounded-lg hover:text-gray-300 transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
