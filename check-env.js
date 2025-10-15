require('dotenv').config({ path: '.env.local' })

console.log('环境变量检查：\n')
console.log('KIE_API_KEY:', process.env.KIE_API_KEY)
console.log('REPLICATE_API_TOKEN:', process.env.REPLICATE_API_TOKEN)
console.log('HF_API_TOKEN:', process.env.HF_API_TOKEN)

console.log('\n验证逻辑测试：')

const kieApiKey = process.env.KIE_API_KEY
const replicateToken = process.env.REPLICATE_API_TOKEN
const hfToken = process.env.HF_API_TOKEN

const hasKieKey = kieApiKey && kieApiKey !== 'kie_...' && !kieApiKey.includes('...')
const hasReplicateToken = replicateToken && replicateToken !== 'r8_...' && !replicateToken.includes('...')
const hasHFToken = hfToken && hfToken !== 'hf_...' && !hfToken.includes('...')

console.log('hasKieKey:', hasKieKey)
console.log('hasReplicateToken:', hasReplicateToken)
console.log('hasHFToken:', hasHFToken)

console.log('\n详细信息：')
console.log('Kie API Key 长度:', kieApiKey?.length || 0)
console.log('Replicate Token 长度:', replicateToken?.length || 0)
console.log('HF Token 长度:', hfToken?.length || 0)

console.log('\nAPI 优先级：')
if (hasKieKey) {
  console.log('✅ 将使用 Kie.ai Sora 2 API（优先）')
} else if (hasReplicateToken) {
  console.log('✅ 将使用 Replicate API（备选）')
} else if (hasHFToken) {
  console.log('✅ 将使用 Hugging Face API（免费备选）')
} else {
  console.log('⚠️  将使用演示模式（无有效 API）')
}
