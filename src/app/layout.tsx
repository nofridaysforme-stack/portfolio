import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import { getSiteSettings } from '@/lib/payload/api'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { GSAPProvider } from '@/components/providers/GSAPProvider'
import { WebVitals, WebVitalsOverlay } from './_components/WebVitals'
import {
  ResponsiveIndicator,
  BreakpointTester,
  MobileSimulatorInfo,
} from './_components/ResponsiveIndicator'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

// Generate metadata from site settings
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title = settings?.seoDefaults?.metaTitle || settings?.siteName || 'Portfolio'
  const description =
    settings?.seoDefaults?.metaDescription ||
    'A modern portfolio showcasing creative development work'
  const ogImage = settings?.seoDefaults?.ogImage?.url

  return {
    title: {
      default: title,
      template: `%s | ${settings?.siteName || 'Portfolio'}`,
    },
    description,
    keywords: ['portfolio', 'web development', 'design', 'creative'],
    authors: [{ name: settings?.siteName || 'Portfolio' }],
    creator: settings?.siteName || 'Portfolio',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: settings?.siteName,
      title,
      description,
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(settings?.seoDefaults?.twitterHandle && {
        creator: `@${settings.seoDefaults.twitterHandle}`,
      }),
      ...(ogImage && {
        images: [ogImage],
      }),
    },
    ...(settings?.favicon?.url && {
      icons: {
        icon: settings.favicon.url,
        shortcut: settings.favicon.url,
        apple: settings.favicon.url,
      },
    }),
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteSettings = await getSiteSettings()
  const analytics = siteSettings?.analytics

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Google Analytics */}
        {analytics?.enableAnalytics && analytics?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${analytics.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}

        {/* Google Tag Manager */}
        {analytics?.enableAnalytics && analytics?.googleTagManagerId && (
          <>
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${analytics.googleTagManagerId}');
              `}
            </Script>
          </>
        )}

        {/* Facebook Pixel */}
        {analytics?.enableAnalytics && analytics?.facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${analytics.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className={inter.className}>
        <GSAPProvider>
          <Header siteSettings={siteSettings} />
          <main className="min-h-screen">{children}</main>
          <Footer siteSettings={siteSettings} />
        </GSAPProvider>

        {/* Web Vitals Tracking */}
        <WebVitals />
        {process.env.NODE_ENV === 'development' && <WebVitalsOverlay />}

        {/* Responsive Testing Utilities (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <ResponsiveIndicator />
            <BreakpointTester />
            <MobileSimulatorInfo />
          </>
        )}

        {/* Google Tag Manager (noscript) */}
        {analytics?.enableAnalytics && analytics?.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analytics.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
      </body>
    </html>
  )
}
