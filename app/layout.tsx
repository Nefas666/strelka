import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { IubendaScript } from "@/components/iubenda-script"
import { IubendaCookieBanner } from "@/components/iubenda-cookie-banner"

const gtMechanikMono = localFont({
  src: [
    { path: "../public/font/GT-Mechanik-Mono-Light-Trial.woff2", weight: "300", style: "normal" },
    { path: "../public/font/GT-Mechanik-Mono-Regular-Trial.woff2", weight: "400", style: "normal" },
    { path: "../public/font/GT-Mechanik-Mono-Medium-Trial.woff2", weight: "500", style: "normal" },
    { path: "../public/font/GT-Mechanik-Mono-Bold-Trial.woff2", weight: "700", style: "normal" },
    { path: "../public/font/GT-Mechanik-Mono-Regular-Oblique-Trial.woff2", weight: "400", style: "italic" },
    { path: "../public/font/GT-Mechanik-Mono-Bold-Oblique-Trial.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-gt-mono",
  display: "swap",
  fallback: ["monospace"],
})

const gtMechanikMonoLight = localFont({
  src: [
    { path: "../public/font/GT-Mechanik-Mono-Light-Trial.woff2", weight: "300", style: "normal" },
    { path: "../public/font/GT-Mechanik-Mono-Light-Oblique-Trial.woff2", weight: "300", style: "italic" },
  ],
  variable: "--font-gt-mono-light",
  display: "swap",
  fallback: ["monospace"],
})

export const metadata: Metadata = {
  title: "Strelka - Web Designer & Developer",
  description: "Proietta la tua attività nel mondo digitale",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-icon.png" }],
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" suppressHydrationWarning className={`${gtMechanikMono.variable} ${gtMechanikMonoLight.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        <IubendaScript />
        <IubendaCookieBanner />
        <Analytics />
      </body>
    </html>
  )
}
