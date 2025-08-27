import type { Metadata } from "next"
import "./globals.css"
import localFont from 'next/font/local'
import Providers from "@/components/Providers"
import MainLayout from "@/components/layout/MainLayout"
import { GoogleAnalytics } from "@next/third-parties/google"
import Script from "next/script"

const myFont = localFont({
  src: './fonts/RedHatDisplay-VariableFont_wght.ttf',
  display: 'swap',
})


export const metadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_NAME}`,
    template: `%s | ${process.env.NEXT_PUBLIC_NAME}`
  },
  twitter: {
    card: 'summary_large_image'
  }
}

async function fetchIntegrations () {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations`, { next: { revalidate: 3600 } })
  return res.json()
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const integrations = await fetchIntegrations()

  return (
    <html lang="es" className={`${myFont.className}`}>
      <head>
        <link rel="icon" href={process.env.NEXT_PUBLIC_FAVICON} />
      </head>
      <body className="overflow-x-hidden">
        <Providers>
          <MainLayout>
            <main>{children}</main>
          </MainLayout>
        </Providers>
        {integrations?.googleAnalytics && (
          <GoogleAnalytics gaId={integrations.googleAnalytics} />
        )}
        {integrations?.apiPixelId && (
          <Script
            id="facebook-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${integrations.apiPixelId}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
