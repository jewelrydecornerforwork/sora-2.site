import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'
import GoogleAnalytics from '../components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sora-2 Ai - Professional Image to Video Generator | sora-2.site',
  description: 'Transform images into stunning videos with AI technology, featuring motion control and audio integration. Experience the most advanced image-to-video technology at sora-2.site.',
  keywords: 'AI video generation,image to video,Sora,artificial intelligence,video creation,sora-2.site',
  authors: [{ name: 'Sora-2 Ai Team' }],
  metadataBase: new URL('https://sora-2.site'),
  openGraph: {
    title: 'Sora-2 Ai - Professional Image to Video Generator',
    description: 'Transform images into stunning videos with AI technology',
    type: 'website',
    locale: 'en_US',
    url: 'https://sora-2.site',
    siteName: 'sora-2.site',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sora-2 Ai - Professional Image to Video Generator',
    description: 'Transform images into stunning videos with AI technology',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
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

