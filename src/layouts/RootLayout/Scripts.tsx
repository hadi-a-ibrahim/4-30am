import React from "react"
import Script from "next/script"
import { CONFIG } from "../../../site.config"

const Scripts: React.FC = () => {
  const gaOn = !!CONFIG?.googleAnalytics?.enable
  const id = CONFIG?.googleAnalytics?.config?.measurementId || ""

  return (
    <>
      {gaOn && id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${id}');
            `}
          </Script>
        </>
      )}
    </>
  )
}

export default Scripts
