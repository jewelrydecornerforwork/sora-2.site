'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'

export default function TestAPI() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult(null)

    try {
      // 创建一个测试图像文件
      const canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#4F46E5'
        ctx.fillRect(0, 0, 100, 100)
        ctx.fillStyle = 'white'
        ctx.font = '12px Arial'
        ctx.fillText('Test', 30, 50)
      }

      canvas.toBlob(async (blob) => {
        if (!blob) return

        const formData = new FormData()
        formData.append('image', blob, 'test-image.png')
        formData.append('prompt', '测试视频生成')
        formData.append('model', 'google-veo3')
        formData.append('resolution', '720p')
        formData.append('duration', '5')

        const response = await fetch('/api/generate-video', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        setResult(data)
        setLoading(false)
      }, 'image/png')
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : '未知错误' })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Sora-2 Ai API 测试页面
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={testAPI}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '测试中...' : '测试视频生成 API'}
          </button>

          {result && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                测试结果:
              </h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            使用说明:
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>点击"测试视频生成 API"按钮</li>
            <li>系统会自动创建一个测试图像</li>
            <li>发送请求到 /api/generate-video 端点</li>
            <li>查看返回的结果</li>
            <li>如果成功，返回演示视频 URL</li>
          </ol>
        </div>
      </div>
      </div>
    </div>
  )
}

