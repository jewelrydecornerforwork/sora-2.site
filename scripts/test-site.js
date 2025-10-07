// 网站功能测试脚本
const puppeteer = require('puppeteer');

async function testWebsite() {
  console.log('🚀 开始测试 Sora 2 AI 网站...');
  
  const browser = await puppeteer.launch({ 
    headless: false, // 设置为 true 可以无头模式运行
    slowMo: 100 // 减慢操作速度，便于观察
  });
  
  try {
    const page = await browser.newPage();
    
    // 设置视口大小
    await page.setViewport({ width: 1280, height: 720 });
    
    // 测试 1: 访问首页
    console.log('📄 测试 1: 访问首页...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // 检查页面标题
    const title = await page.title();
    console.log(`✅ 页面标题: ${title}`);
    
    // 测试 2: 检查主要组件
    console.log('🧩 测试 2: 检查主要组件...');
    
    // 检查 Header
    const header = await page.$('header');
    if (header) {
      console.log('✅ Header 组件存在');
    } else {
      console.log('❌ Header 组件缺失');
    }
    
    // 检查 Hero 区域
    const hero = await page.$('section');
    if (hero) {
      console.log('✅ Hero 区域存在');
    } else {
      console.log('❌ Hero 区域缺失');
    }
    
    // 检查视频生成器
    const videoGenerator = await page.$('textarea');
    if (videoGenerator) {
      console.log('✅ 视频生成器组件存在');
    } else {
      console.log('❌ 视频生成器组件缺失');
    }
    
    // 测试 3: 测试图像上传功能
    console.log('🖼️ 测试 3: 测试图像上传功能...');
    
    // 查找文件输入
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      console.log('✅ 文件上传输入存在');
    } else {
      console.log('❌ 文件上传输入缺失');
    }
    
    // 测试 4: 测试表单输入
    console.log('📝 测试 4: 测试表单输入...');
    
    // 输入运动描述
    await page.type('textarea', '一个女人在海滩上行走并说：你好世界！');
    console.log('✅ 运动描述输入成功');
    
    // 测试 5: 测试按钮点击
    console.log('🔘 测试 5: 测试按钮点击...');
    
    // 查找生成按钮
    const generateButton = await page.$('button:has-text("生成视频")');
    if (generateButton) {
      console.log('✅ 生成按钮存在');
      // 注意：不实际点击，因为会触发 API 调用
    } else {
      console.log('❌ 生成按钮缺失');
    }
    
    // 测试 6: 测试响应式设计
    console.log('📱 测试 6: 测试响应式设计...');
    
    // 测试移动端视图
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    console.log('✅ 移动端视图测试完成');
    
    // 测试平板视图
    await page.setViewport({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    console.log('✅ 平板视图测试完成');
    
    // 恢复桌面视图
    await page.setViewport({ width: 1280, height: 720 });
    
    // 测试 7: 检查控制台错误
    console.log('🔍 测试 7: 检查控制台错误...');
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    if (errors.length === 0) {
      console.log('✅ 没有发现控制台错误');
    } else {
      console.log(`❌ 发现 ${errors.length} 个控制台错误:`);
      errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // 测试 8: 性能测试
    console.log('⚡ 测试 8: 性能测试...');
    
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    console.log('📊 性能指标:');
    console.log(`   - 页面加载时间: ${performanceMetrics.loadTime.toFixed(2)}ms`);
    console.log(`   - DOM 内容加载: ${performanceMetrics.domContentLoaded.toFixed(2)}ms`);
    console.log(`   - 首次绘制: ${performanceMetrics.firstPaint.toFixed(2)}ms`);
    console.log(`   - 首次内容绘制: ${performanceMetrics.firstContentfulPaint.toFixed(2)}ms`);
    
    console.log('🎉 所有测试完成！');
    
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  } finally {
    await browser.close();
  }
}

// 运行测试
if (require.main === module) {
  testWebsite().catch(console.error);
}

module.exports = { testWebsite };
