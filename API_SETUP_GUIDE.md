# API Configuration Guide

## 🚨 Current Issue: "Failed to fetch" Error

If you're seeing a **"Failed to fetch"** error when trying to generate videos, it means:

1. **No API keys are configured** in your `.env.local` file
2. **The server might not be running** on the correct port
3. **Network connectivity issues** between frontend and backend

---

## ✅ Quick Fix Solutions

### Solution 1: Use Demo Mode (No API Key Required)

The application has a built-in demo mode that works without any API keys. To ensure it works:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Check the server is running on the correct port:**
   - Open your browser to `http://localhost:3000` (or the port shown in terminal)
   - The demo mode should automatically activate when no API keys are configured

3. **Check browser console for errors:**
   - Press F12 in your browser
   - Look at the Console and Network tabs for detailed error messages

---

### Solution 2: Configure a FREE API Key (Recommended)

The easiest free option is **Hugging Face** (works for Image-to-Video):

#### Step 1: Get a Hugging Face API Token (FREE)

1. Go to https://huggingface.co/
2. Sign up for a free account
3. Go to https://huggingface.co/settings/tokens
4. Click "New token"
5. Give it a name (e.g., "sora-2-site")
6. Select "Read" permissions
7. Click "Generate token"
8. Copy the token (starts with `hf_`)

#### Step 2: Add to .env.local

1. Open `.env.local` file in your project root
2. Find the line with `# HF_API_TOKEN=`
3. Uncomment it and replace with your token:
   ```bash
   HF_API_TOKEN=hf_your_actual_token_here
   ```

#### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

### Solution 3: Use Paid API Services (For Production)

For better quality and more features, you can use these paid services:

#### Option A: Kie.ai (Text-to-Video & Image-to-Video)

1. Visit: https://kie.ai
2. Sign up and get your API key
3. Add to `.env.local`:
   ```bash
   KIE_API_KEY=kie_your_actual_api_key_here
   ```

**Pricing:** Check their website for current pricing

---

#### Option B: Replicate (Image-to-Video only)

1. Visit: https://replicate.com/account/api-tokens
2. Sign up and get your API token
3. Add to `.env.local`:
   ```bash
   REPLICATE_API_TOKEN=r8_your_actual_token_here
   ```

**Pricing:** Pay-as-you-go, check https://replicate.com/pricing

---

## 🔍 Troubleshooting Common Issues

### Issue 1: "Failed to fetch" Error

**Symptoms:**
- Red error message saying "Video generation failed: Failed to fetch"

**Solutions:**
1. **Check if the server is running:**
   ```bash
   # You should see output like:
   # ▲ Next.js 14.x.x
   # - Local: http://localhost:3000
   ```

2. **Check your browser console (F12):**
   - Look for CORS errors
   - Look for network errors
   - Check if the API endpoint is correct

3. **Verify .env.local configuration:**
   ```bash
   # Make sure the file exists:
   ls -la .env.local

   # Check its contents (hide sensitive data):
   cat .env.local | grep -v "API_KEY\|TOKEN"
   ```

4. **Clear cache and restart:**
   ```bash
   # Clear Next.js cache
   rm -rf .next

   # Restart server
   npm run dev
   ```

---

### Issue 2: API Returns Error

**Symptoms:**
- Error message with API details (e.g., "Kie API error: 401")

**Solutions:**
1. **Check API key validity:**
   - Make sure the API key is not expired
   - Verify you copied the entire key (no extra spaces)
   - Ensure the key has not been revoked

2. **Check API quota:**
   - Some APIs have free tier limits
   - Check your account dashboard for remaining quota

3. **Verify API key format:**
   - Kie.ai keys start with `kie_`
   - Replicate tokens start with `r8_`
   - Hugging Face tokens start with `hf_`

---

### Issue 3: Demo Video Not Working

**Symptoms:**
- Demo mode activates but video doesn't play

**Solutions:**
1. **Check if demo video files exist:**
   ```bash
   ls -la public/demo-video.mp4
   ls -la public/demo-image.jpg
   ```

2. **If files are missing, the demo mode will still show the interface but won't have actual media files**

---

## 📊 API Priority Order

The system tries APIs in this order:

### Text-to-Video:
1. Kie.ai (if configured)
2. Replicate (if configured)
3. Demo mode (if no APIs configured)

### Image-to-Video:
1. Kie.ai (if configured)
2. Replicate (if configured)
3. Hugging Face (if configured) ⭐ **FREE option**
4. Demo mode (if no APIs configured)

---

## 🔐 Security Best Practices

1. **Never commit .env.local to git:**
   ```bash
   # It should already be in .gitignore
   echo ".env.local" >> .gitignore
   ```

2. **Use different API keys for development and production**

3. **Rotate API keys regularly**

4. **Set up API rate limiting in production**

---

## 📝 Current Configuration Status

Check your current configuration:

```bash
# Run this command to see which APIs are configured
grep -E "^[^#].*API_KEY|^[^#].*TOKEN" .env.local
```

Expected output if configured:
```
KIE_API_KEY=kie_...
REPLICATE_API_TOKEN=r8_...
HF_API_TOKEN=hf_...
```

If you see nothing, no APIs are configured (demo mode will be used).

---

## 🆘 Still Having Issues?

1. **Check server logs:**
   - Look at the terminal where you ran `npm run dev`
   - Server-side errors will appear there

2. **Check browser console:**
   - Press F12 in your browser
   - Look for red error messages

3. **Verify environment variables are loaded:**
   - Add this temporarily to `app/api/generate-video/route.ts`:
   ```typescript
   console.log('Environment check:', {
     hasKieKey: !!process.env.KIE_API_KEY,
     hasReplicateToken: !!process.env.REPLICATE_API_TOKEN,
     hasHFToken: !!process.env.HF_API_TOKEN,
   })
   ```

4. **Test the API endpoint directly:**
   ```bash
   # Test with curl (requires an image file)
   curl -X POST http://localhost:3000/api/generate-video \
     -F "mode=text" \
     -F "textPrompt=A cat playing" \
     -F "model=google-veo3" \
     -F "resolution=standard" \
     -F "videoRatio=16:9" \
     -F "duration=5"
   ```

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Hugging Face API Docs](https://huggingface.co/docs/api-inference/index)
- [Replicate API Docs](https://replicate.com/docs)
- [Kie.ai Docs](https://kie.ai)

---

## ✨ Quick Start Command

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Edit .env.local and add your API keys
nano .env.local
# or
code .env.local

# 4. Start the development server
npm run dev

# 5. Open browser to http://localhost:3000
```

---

**Last Updated:** 2025-01-29
