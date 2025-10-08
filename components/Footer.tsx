'use client'

import Link from 'next/link'
import { Twitter, Github, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    quickLinks: [
      { name: '首页', href: '/' },
      { name: '仪表板', href: '/dashboard' },
      { name: '定价', href: '/pricing' },
      { name: '探索', href: '/explore' },
      { name: '历史', href: '/history' },
    ],
    support: [
      { name: '帮助中心', href: '/help' },
      { name: '联系支持', href: '/support' },
      { name: '状态页面', href: '/status' },
      { name: '社区论坛', href: '/community' },
    ],
    legal: [
      { name: '服务条款', href: '/terms' },
      { name: '隐私政策', href: '/privacy' },
      { name: '退款政策', href: '/refund' },
      { name: 'Cookie 政策', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Email', href: 'mailto:support@sora2ai.io', icon: Mail },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo 和描述 */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S2</span>
              </div>
              <span className="text-xl font-bold">Sora 2 AI</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              专业的 AI 图像转视频生成器，支持运动控制、音频集成和多分辨率输出。
              将您的创意想法转化为令人惊叹的视频内容。
            </p>
            
            {/* 社交媒体链接 */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 支持 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">支持</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 法律条款 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">法律条款</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部版权信息 */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
              <span>© {currentYear} sora2ai.io</span>
              <span>•</span>
              <span>保留所有权利</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <span>用</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>制作</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

