#!/bin/bash
# Quick refresh script for development

echo "🧹 Clearing Next.js cache..."
rm -rf .next

echo "🔄 Restarting server..."
# Kill existing server
pkill -f "next dev"

# Start new server
npx next dev -H 0.0.0.0 -p 3000
