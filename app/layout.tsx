import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sora-2 Ai - Professional Image to Video Generator | sora-2.site',
  description: 'Transform images into stunning videos with AI technology, featuring motion control and audio integration. Experience the most advanced image-to-video technology at sora-2.site.',
  keywords: 'AI video generation,image to video,Sora,artificial intelligence,video creation,sora-2.site',
  authors: [{ name: 'Sora-2 Ai Team' }],
  metadataBase: new URL('https://sora-2.site'),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'Sora-2 Ai - Professional Image to Video Generator',
    description: 'Transform images into stunning videos with AI technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sora-2.site',
    siteName: 'sora-2.site',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Sora-2 AI Video Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sora-2 Ai - Professional Image to Video Generator',
    description: 'Transform images into stunning videos with AI technology',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NDLZQ2HE5X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NDLZQ2HE5X');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}

