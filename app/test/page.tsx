import { Header } from '@/components/Header'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>测试页面</h1>
        <p>如果您能看到这个页面，说明部署是正常的。</p>
        <p>当前时间: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}
