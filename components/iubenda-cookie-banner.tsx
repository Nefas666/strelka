"use client"

import Script from "next/script"

export function IubendaCookieBanner() {
  return (
    <Script
      id="iubenda-cookie-banner"
      src="//embeds.iubenda.com/widgets/8fec7486-fa42-4412-a153-2d082dc1725e.js"
      strategy="afterInteractive"
    />
  )
}
