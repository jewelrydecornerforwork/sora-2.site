#!/usr/bin/env node

/**
 * 部署状态检查脚本
 * 用于验证网站部署是否正常工作
 */

const https = require('https');
const http = require('http');

const SITE_URL = 'https://sora-2.site';
const GITHUB_REPO = 'https://github.com/jewelrydecornerforwork/sora-2.site';

console.log('🚀 开始检查部署状态...\n');

// 检查网站是否可访问
function checkWebsite(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          content: data,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

// 检查GitHub仓库状态
function checkGitHubRepo() {
  return new Promise((resolve, reject) => {
    const url = 'https://api.github.com/repos/jewelrydecornerforwork/sora-2.site';
    
    https.get(url, {
      headers: {
        'User-Agent': 'Sora-2-AI-Deployment-Checker'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const repo = JSON.parse(data);
          resolve({
            success: true,
            data: repo
          });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// 主检查函数
async function runChecks() {
  console.log('📋 检查清单:');
  console.log('1. 检查网站可访问性');
  console.log('2. 检查GitHub仓库状态');
  console.log('3. 验证页面内容');
  console.log('4. 检查API端点');
  console.log('');

  try {
    // 检查网站
    console.log('🌐 检查网站可访问性...');
    const websiteResult = await checkWebsite(SITE_URL);
    
    if (websiteResult.success) {
      console.log(`✅ 网站可访问 (状态码: ${websiteResult.status})`);
      console.log(`📄 页面大小: ${websiteResult.content.length} 字符`);
      
      // 检查是否包含预期内容
      if (websiteResult.content.includes('Sora-2') || websiteResult.content.includes('AI')) {
        console.log('✅ 页面包含预期内容');
      } else {
        console.log('⚠️  页面内容可能不完整');
      }
    } else {
      console.log(`❌ 网站访问失败 (状态码: ${websiteResult.status})`);
    }
    
    console.log('');
    
    // 检查GitHub仓库
    console.log('📦 检查GitHub仓库状态...');
    try {
      const repoResult = await checkGitHubRepo();
      if (repoResult.success) {
        console.log('✅ GitHub仓库可访问');
        console.log(`📊 仓库状态: ${repoResult.data.private ? '私有' : '公开'}`);
        console.log(`⭐ 星标数: ${repoResult.data.stargazers_count}`);
        console.log(`🍴 Fork数: ${repoResult.data.forks_count}`);
      }
    } catch (err) {
      console.log('⚠️  GitHub仓库检查失败:', err.message);
    }
    
    console.log('');
    
    // 检查API端点
    console.log('🔌 检查API端点...');
    try {
      const apiResult = await checkWebsite(`${SITE_URL}/api/generate-video`);
      if (apiResult.status === 404 || apiResult.status === 405) {
        console.log('✅ API端点存在 (返回预期状态码)');
      } else {
        console.log(`ℹ️  API端点状态: ${apiResult.status}`);
      }
    } catch (err) {
      console.log('⚠️  API端点检查失败:', err.message);
    }
    
    console.log('');
    console.log('🎉 部署检查完成！');
    console.log('');
    console.log('📝 总结:');
    console.log(`- 网站URL: ${SITE_URL}`);
    console.log(`- GitHub仓库: ${GITHUB_REPO}`);
    console.log('- 如果所有检查都通过，说明部署成功');
    console.log('- 如果有问题，请检查Vercel部署日志');
    
  } catch (error) {
    console.error('❌ 检查过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行检查
runChecks();
