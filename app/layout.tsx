import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sora 2 AI - 专业图像转视频生成器 | sora-2.site',
  description: '使用 AI 技术将图像转换为专业视频，支持运动控制、音频集成和多分辨率输出。访问 sora-2.site 体验最先进的图像转视频技术。',
  keywords: 'AI视频生成,图像转视频,Sora,人工智能,视频制作,sora-2.site',
  authors: [{ name: 'Sora 2 AI Team' }],
  metadataBase: new URL('https://sora-2.site'),
  openGraph: {
    title: 'Sora 2 AI - 专业图像转视频生成器',
    description: '使用 AI 技术将图像转换为专业视频',
    type: 'website',
    locale: 'zh_CN',
    url: 'https://sora-2.site',
    siteName: 'sora-2.site',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sora 2 AI - 专业图像转视频生成器',
    description: '使用 AI 技术将图像转换为专业视频',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
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

