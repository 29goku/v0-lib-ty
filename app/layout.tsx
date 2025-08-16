import React from "react"
import ChatWidgetClient from "../components/ChatWidgetClient";
import dynamic from 'next/dynamic';
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: {
    default: "Leben in Deutschland Test 2025 – 310 Offizielle Fragen & Vorbereitung",
    template: "%s | Leben in Deutschland Test"
  },
  description: "Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen. Interaktiv, mobilfreundlich und perfekt für den Einbürgerungstest. Bestehen Sie den Test mit unserer bewährten App!",
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
    "Leben in Deutschland 2025",
    "Einbürgerungstest online",
    "Deutschland Test üben",
    "Bürgertest Vorbereitung",
    "Einbürgerungstest Fragen",
    "Leben in Deutschland App",
    "Einbürgerungstest kostenlos",
    "Deutschland Test 2025",
    "Einbürgerungstest bestehen",
    "BAMF Test",
    "Einbürgerungstest Vorbereitung"
  ],
  authors: [{ name: "lebeninde.com", url: "https://lebeninde.com" }],
  creator: "Leben in Deutschland Test Team",
  publisher: "lebeninde.com",
  generator: "Next.js",
  applicationName: "Leben in Deutschland Test App",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL("https://lebeninde.com"),
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
      "en-US": "/en/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://lebeninde.com",
    title: "Leben in Deutschland Test 2025 – 310 Offizielle Fragen & Vorbereitung",
    description: "Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen. Interaktiv, mobilfreundlich und perfekt für den Einbürgerungstest.",
    siteName: "Leben in Deutschland Test",
    images: [
      {
        url: "https://lebeninde.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Leben in Deutschland Test 2025 - Offizielle Vorbereitung",
        type: "image/jpeg",
      },
      {
        url: "https://lebeninde.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Leben in Deutschland Test 2025 - Offizielle Vorbereitung",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leben in Deutschland Test 2025 – 310 Offizielle Fragen & Vorbereitung",
    description: "Kostenlose Vorbereitung für den Leben in Deutschland Test 2025 mit allen 310 offiziellen Fragen, Antworten und Erklärungen. Interaktiv & kostenlos.",
    images: ["https://lebeninde.com/twitter-image.jpg"],
    creator: "@lebeninde",
    site: "@lebeninde",
  },
  other: {
    "theme-color": "#4f46e5",
    "color-scheme": "dark",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Leben in Deutschland Test",
    "application-name": "Leben in Deutschland Test",
    "msapplication-TileColor": "#4f46e5",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Leben in Deutschland Test",
              "url": "https://lebeninde.com",
              "logo": "https://lebeninde.com/logo.png",
              "description": "Offizielle Vorbereitung für den Leben in Deutschland Test 2025",
              "sameAs": [
                "https://twitter.com/lebeninde",
                "https://facebook.com/lebeninde"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@lebeninde.com"
              }
            })
          }}
        />
        
        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Leben in Deutschland Test",
              "url": "https://lebeninde.com",
              "description": "Kostenlose Vorbereitung für den Leben in Deutschland Test 2025",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://lebeninde.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* Structured Data for WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Leben in Deutschland Test App",
              "url": "https://lebeninde.com",
              "description": "Interaktive App zur Vorbereitung auf den Leben in Deutschland Test",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR"
              }
            })
          }}
        />
      </head>
      <body className={GeistSans.className}>
        <Suspense fallback={null}>{children}</Suspense>
        <ChatWidgetClient />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
