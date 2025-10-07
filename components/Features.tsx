'use client'

import { Monitor, Zap, Volume2, Clock, Brain, Image, Play } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: Monitor,
      title: '多分辨率支持',
      description: '生成 480p、720p 或 1080p 分辨率的视频。根据项目需求选择质量，处理时间 1-3 分钟。',
    },
    {
      icon: Zap,
      title: '运动控制',
      description: '基于文本提示将静态图像转换为动态视频，精确控制运动和动画效果。',
    },
    {
      icon: Volume2,
      title: '音频集成',
      description: '支持 WAV/MP3 格式的背景音乐。音频时长处理，自动截断和静音填充。',
    },
    {
      icon: Clock,
      title: '灵活时长',
      description: '生成 5 秒或 10 秒时长的视频。适合社交媒体、演示文稿或创意项目。',
    },
    {
      icon: Brain,
      title: '智能提示',
      description: '使用 LLM 技术的智能提示扩展。通过自动提示增强获得更好的结果。',
    },
    {
      icon: Image,
      title: '多格式支持',
      description: '支持 JPEG、JPG、PNG、BMP、WEBP 图像，最大 10MB。分辨率 360-2000 像素。',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            为什么选择 Sora 2 AI
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            专业的视频生成功能，支持运动控制、音频集成和多种分辨率选项
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* 示例展示 */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Sora 2 AI 社区精彩视频
          </h3>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            观看 Sora 2 AI 如何将您的想法转化为令人惊叹的现实 - 从概念到产品只需几秒钟
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 示例 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  完整的 Sora 2 AI 唇形同步转换流程
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">原始图像</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">视频提示</div>
                    <p className="text-sm text-gray-700 italic">
                      "一个女人在海滩上行走并说：'你听说了吗？Sora 2 现在可以在 sora2ai.io 上使用了！'"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AI 生成视频</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  尝试此风格
                </button>
              </div>
            </div>

            {/* 示例 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  完整的 Sora 2 AI 动画运动转换流程
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">原始图像</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">视频提示</div>
                    <p className="text-sm text-gray-700 italic">
                      "让它战斗"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AI 生成视频</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  尝试此风格
                </button>
              </div>
            </div>

            {/* 示例 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  完整的 Sora 2 AI 产品转换流程
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">原始图像</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">视频提示</div>
                    <p className="text-sm text-gray-700 italic">
                      "主体保持不变，但光影发生变化"
                    </p>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-2">AI 生成视频</div>
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  尝试此风格
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
              探索更多创作
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
