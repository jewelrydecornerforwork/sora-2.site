#!/bin/bash

echo "🔍 Sora-2.site Diagnostic Tool"
echo "================================"
echo ""

# Check if .env.local exists
echo "📁 Checking .env.local file..."
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    echo ""
    echo "📋 Configured API Keys:"
    grep -E "^[^#].*API_KEY|^[^#].*TOKEN" .env.local | sed 's/=.*/=***HIDDEN***/' || echo "⚠️  No API keys configured (Demo mode will be used)"
else
    echo "❌ .env.local not found!"
    echo "   Run: cp .env.example .env.local"
fi

echo ""
echo "================================"
echo ""

# Check if node_modules exists
echo "📦 Checking dependencies..."
if [ -d node_modules ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules not found!"
    echo "   Run: npm install"
fi

echo ""
echo "================================"
echo ""

# Check if Next.js is running
echo "🌐 Checking if server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
elif curl -s http://localhost:3001 > /dev/null; then
    echo "✅ Server is running on http://localhost:3001"
else
    echo "❌ Server is NOT running!"
    echo "   Run: npm run dev"
fi

echo ""
echo "================================"
echo ""

# Check Node version
echo "🔧 Environment Information:"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo ""
echo "================================"
echo ""

# Check if demo files exist
echo "🎬 Checking demo files..."
if [ -f public/demo-video.mp4 ]; then
    echo "✅ Demo video exists"
else
    echo "⚠️  Demo video not found at public/demo-video.mp4"
fi

if [ -f public/demo-image.jpg ]; then
    echo "✅ Demo image exists"
else
    echo "⚠️  Demo image not found at public/demo-image.jpg"
fi

echo ""
echo "================================"
echo ""

echo "💡 Next Steps:"
echo ""
echo "1. If server is not running:"
echo "   npm run dev"
echo ""
echo "2. If no API keys configured:"
echo "   - For FREE testing: Get Hugging Face token from https://huggingface.co/settings/tokens"
echo "   - Add to .env.local: HF_API_TOKEN=hf_your_token_here"
echo "   - Or use demo mode (no API key needed)"
echo ""
echo "3. If 'Failed to fetch' error:"
echo "   - Check browser console (F12) for detailed errors"
echo "   - Ensure server is running on correct port"
echo "   - Try clearing browser cache"
echo ""
echo "4. Read the full guide:"
echo "   cat API_SETUP_GUIDE.md"
echo ""
