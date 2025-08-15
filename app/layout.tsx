import type React from "react"
import LanguageSelector from "@/components/LanguageSelector"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Leben in Deutschland Test – Offizielle Vorbereitung 2025",
  description:
    "Übe mit 310 offiziellen Fragen für den Leben in Deutschland Test 2025. Interaktive App mit Lernfortschritt, Erklärungen & Prüfungsmodus – kostenlos & mobilfreundlich.",
  keywords: [
    "Leben in Deutschland Test",
    "Einbürgerungstest",
    "Einbürgerung Deutschland",
    "Leben in Deutschland Fragen",
    "Testvorbereitung",
    "BAMF Fragenkatalog",
    "Staatsbürgerschaft Test",
    "Deutscher Einbürgerungstest",
    "Integrationskurs",
    "Leben in Deutschland 2025"
  ],
  authors: [{ name: "lebeninde.com" }],
  generator: "Leben in Deutschland Test Preparation App",
  metadataBase: new URL("https://lebeninde.com"),
  openGraph: {
    title: "Leben in Deutschland Test – Offizielle Vorbereitung 2025",
    description:
      "Übe alle 310 offiziellen Fragen des BAMF für den Leben in Deutschland Test 2025. Interaktiv, mobilfreundlich und kostenlos.",
    url: "https://lebeninde.com",
    siteName: "Leben in Deutschland",
    images: [
      {
        width: 1200,
        height: 630,
        alt: "Leben in Deutschland Test App"
      }
    ],
    locale: "de_DE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Leben in Deutschland Test – Offizielle Vorbereitung 2025",
    description:
      "Übe alle 310 offiziellen Fragen des BAMF für den Leben in Deutschland Test 2025. Interaktiv & kostenlos.",
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={GeistSans.className}>
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
          <LanguageSelector />
        </div>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
