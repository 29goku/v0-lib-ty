"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe } from "lucide-react"
import { useStore } from "@/lib/store"
import { type Language, languageNames, languageFlags } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"

export default function LanguageSelector() {
  const { language, setLanguage } = useStore()
  const [isOpen, setIsOpen] = useState(false)

  const languages: Language[] = ["en", "de", "es", "fr", "it", "tr", "ar", "ru", "zh"]

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600/50 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 backdrop-blur-sm"
      >
        <Globe className="w-4 h-4 mr-2" />
        <span className="mr-2">{languageFlags[language]}</span>
        {languageNames[language]}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 z-50"
          >
            <Card className="border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl min-w-48">
              <CardContent className="p-2">
                <div className="grid gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang)
                        setIsOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-3 ${
                        language === lang
                          ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30"
                          : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{languageFlags[lang]}</span>
                      <span className="font-medium">{languageNames[lang]}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  )
}
