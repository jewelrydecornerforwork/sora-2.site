// API Connection Test Script
require('dotenv').config();

const API_KEY = process.env.COMET_API_KEY;
const API_URL = 'https://api.cometapi.com/v1/chat/completions';

async function testCometAPI() {
  console.log('🔍 Testing CometAPI connection...\n');
  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'NOT FOUND');
  console.log('API URL:', API_URL);
  console.log('\n' + '='.repeat(50) + '\n');

  try {
    console.log('📡 Sending test request...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sora-2',
        stream: false,
        messages: [
          {
            role: 'user',
            content: 'A beautiful sunset over the ocean'
          }
        ]
      }),
    });

    console.log('📊 Response Status:', response.status, response.statusText);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('\n❌ API Error:');
      console.error('Status:', response.status);
      console.error('Response:', errorText);

      // Common error diagnosis
      if (response.status === 401) {
        console.log('\n💡 Diagnosis: Invalid API key or authentication failed');
      } else if (response.status === 429) {
        console.log('\n💡 Diagnosis: Rate limit exceeded');
      } else if (response.status === 500 || response.status === 502 || response.status === 503) {
        console.log('\n💡 Diagnosis: CometAPI server error - try again later');
      }
      return;
    }

    const result = await response.json();
    console.log('\n✅ API Response:');
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('\n❌ Connection Error:');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);

    if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Diagnosis: Network connection failed');
      console.log('Possible causes:');
      console.log('  - VPN blocking the connection');
      console.log('  - Firewall blocking outbound requests');
      console.log('  - CometAPI server unreachable from your location');
      console.log('  - DNS resolution failed');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Diagnosis: Request timeout');
      console.log('Possible causes:');
      console.log('  - Slow network connection');
      console.log('  - CometAPI server overloaded');
    }
  }
}

testCometAPI();
