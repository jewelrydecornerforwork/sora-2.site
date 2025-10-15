#!/usr/bin/env node

/**
 * 测试完整的视频生成流程
 */

const fs = require('fs')
const path = require('path')
const FormData = require('form-data')

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '.env.local') })

console.log('🧪 测试视频生成完整流程\n')

async function testVideoGeneration() {
  try {
    // 检查环境变量
    console.log('1️⃣ 检查环境变量...')
    const hasReplicate = !!process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN !== 'r8_...'
    const hasHF = !!process.env.HF_API_TOKEN && process.env.HF_API_TOKEN !== 'hf_...'

    console.log(`   Replicate Token: ${hasReplicate ? '✅ 已配置' : '❌ 未配置或无效'}`)
    console.log(`   Hugging Face Token: ${hasHF ? '✅ 已配置' : '❌ 未配置或无效'}`)

    if (!hasReplicate && !hasHF) {
      console.log('\n⚠️  没有有效的 API Token，将使用演示模式\n')
    }

    // 创建测试图片
    console.log('\n2️⃣ 准备测试图片...')

    // 使用一个简单的 1x1 像素的 PNG 图片（Base64）
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    const testImageBuffer = Buffer.from(testImageBase64, 'base64')
    const testImagePath = path.join(__dirname, 'test-image.png')
    fs.writeFileSync(testImagePath, testImageBuffer)
    console.log(`   ✅ 测试图片已创建: ${testImagePath}`)

    // 创建 FormData
    console.log('\n3️⃣ 准备请求数据...')
    const formData = new FormData()
    formData.append('image', fs.createReadStream(testImagePath))
    formData.append('prompt', 'A beautiful sunset over the ocean')
    formData.append('model', 'google-veo3')
    formData.append('resolution', '720p')
    formData.append('duration', '5')
    formData.append('isPublic', 'true')
    console.log('   ✅ FormData 已创建')

    // 发送请求
    console.log('\n4️⃣ 发送请求到 API...')
    console.log('   URL: http://localhost:3001/api/generate-video')

    const response = await fetch('http://localhost:3001/api/generate-video', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    })

    console.log(`\n5️⃣ 收到响应: ${response.status} ${response.statusText}`)

    const result = await response.json()
    console.log('\n📋 响应内容:')
    console.log(JSON.stringify(result, null, 2))

    // 清理测试文件
    fs.unlinkSync(testImagePath)
    console.log('\n✅ 测试完成，测试文件已清理')

    if (result.success) {
      console.log('\n🎉 视频生成成功！')
      if (result.isDemo) {
        console.log('⚠️  使用的是演示模式')
      } else {
        console.log('✅ 使用真实 AI API 生成')
      }
    } else {
      console.log('\n❌ 视频生成失败')
      console.log('错误信息:', result.error || result.message)
    }

  } catch (error) {
    console.error('\n❌ 测试过程中发生错误:')
    console.error(error.message)
    console.error(error.stack)
  }
}

// 等待服务器启动
setTimeout(() => {
  testVideoGeneration()
}, 2000)
