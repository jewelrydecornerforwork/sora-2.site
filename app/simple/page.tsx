import { Header } from '@/components/Header'

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>简单测试页面</h1>
        <p>如果您能看到这个页面，说明部署是正常的。</p>
        <p>当前时间: {new Date().toLocaleString()}</p>
        <p>这是一个非常简单的页面，没有任何复杂的组件。</p>
      </div>
    </div>
  )
}
