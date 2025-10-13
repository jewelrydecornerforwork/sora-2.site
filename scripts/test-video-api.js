#!/usr/bin/env node

/**
 * 测试免费视频生成 API
 * 
 * 使用方法:
 * 1. 确保已配置 .env.local 文件
 * 2. 运行: node scripts/test-video-api.js
 */

const fs = require('fs')
const path = require('path')

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

console.log('🧪 测试视频生成 API 配置\n')
console.log('='.repeat(50))

// 检查 Replicate API
const replicateToken = process.env.REPLICATE_API_TOKEN
if (replicateToken) {
  console.log('✅ Replicate API Token 已配置')
  console.log(`   Token 前缀: ${replicateToken.substring(0, 10)}...`)
  testReplicateAPI(replicateToken)
} else {
  console.log('❌ Replicate API Token 未配置')
  console.log('   请在 .env.local 中设置 REPLICATE_API_TOKEN')
}

console.log('')

// 检查 Hugging Face API
const hfToken = process.env.HF_API_TOKEN
if (hfToken) {
  console.log('✅ Hugging Face API Token 已配置')
  console.log(`   Token 前缀: ${hfToken.substring(0, 10)}...`)
  testHuggingFaceAPI(hfToken)
} else {
  console.log('❌ Hugging Face API Token 未配置')
  console.log('   请在 .env.local 中设置 HF_API_TOKEN')
}

console.log('')
console.log('='.repeat(50))

if (!replicateToken && !hfToken) {
  console.log('\n⚠️  未配置任何 API Token！')
  console.log('系统将运行在演示模式，无法生成真实的 AI 视频。')
  console.log('\n📖 请查看 FREE_API_SETUP.md 获取详细配置指南。')
} else {
  console.log('\n✅ API 配置检查完成！')
  console.log('\n💡 提示:')
  console.log('   - 优先使用 Replicate（质量最佳）')
  console.log('   - Hugging Face 作为免费备选')
  console.log('   - 如果两者都失败，会回退到演示模式')
}

console.log('')

// 测试 Replicate API
async function testReplicateAPI(token) {
  try {
    console.log('   正在测试 Replicate API 连接...')
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      console.log('   ✅ Replicate API 连接成功！')
      
      // 获取账户信息
      const data = await response.json()
      console.log(`   📊 已完成预测数: ${data.results?.length || 0}`)
    } else if (response.status === 401) {
      console.log('   ❌ Token 无效或已过期')
      console.log('   请在 https://replicate.com/account/api-tokens 重新生成')
    } else {
      console.log(`   ⚠️  API 响应异常: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.log(`   ❌ 测试失败: ${error.message}`)
  }
}

// 测试 Hugging Face API
async function testHuggingFaceAPI(token) {
  try {
    console.log('   正在测试 Hugging Face API 连接...')
    
    const response = await fetch('https://huggingface.co/api/whoami-v2', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('   ✅ Hugging Face API 连接成功！')
      console.log(`   👤 用户名: ${data.name || data.id}`)
    } else if (response.status === 401) {
      console.log('   ❌ Token 无效或已过期')
      console.log('   请在 https://huggingface.co/settings/tokens 重新生成')
    } else {
      console.log(`   ⚠️  API 响应异常: ${response.status} ${response.statusText}`)
    }
  } catch (error) {
    console.log(`   ❌ 测试失败: ${error.message}`)
  }
}

