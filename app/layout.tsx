import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sora 2 AI - 专业图像转视频生成器',
  description: '使用 AI 技术将图像转换为专业视频，支持运动控制、音频集成和多分辨率输出。',
  keywords: 'AI视频生成,图像转视频,Sora,人工智能,视频制作',
  authors: [{ name: 'Sora 2 AI Team' }],
  openGraph: {
    title: 'Sora 2 AI - 专业图像转视频生成器',
    description: '使用 AI 技术将图像转换为专业视频',
    type: 'website',
    locale: 'zh_CN',
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

