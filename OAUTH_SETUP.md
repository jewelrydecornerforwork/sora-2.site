# OAuth Setup Guide

This guide will help you configure Google and GitHub OAuth for your Sora-2 application.

## Google OAuth Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API for your project

### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Configure the OAuth consent screen if prompted:
   - Add app name: "Sora-2 AI"
   - Add your email
   - Add authorized domains (optional for development)

### Step 3: Configure Authorized Redirect URIs

Add the following redirect URI:
```
http://localhost:3001/api/auth/callback/google
```

For production, also add:
```
https://yourdomain.com/api/auth/callback/google
```

### Step 4: Get Your Credentials

After creating, you'll receive:
- **Client ID**: Copy this
- **Client Secret**: Copy this

### Step 5: Add to Environment Variables

In your `.env.local` file:
```bash
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

---

## GitHub OAuth Setup

### Step 1: Create OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**

### Step 2: Configure the OAuth App

Fill in the following information:

- **Application name**: `Sora-2 AI`
- **Homepage URL**: `http://localhost:3001` (or your domain)
- **Authorization callback URL**: `http://localhost:3001/api/auth/callback/github`

For production, use:
- **Homepage URL**: `https://yourdomain.com`
- **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`

### Step 3: Get Your Credentials

After creating the app:
- **Client ID**: Copy this (shown on the page)
- Click **Generate a new client secret**
- **Client Secret**: Copy this immediately (you won't see it again)

### Step 4: Add to Environment Variables

In your `.env.local` file:
```bash
GITHUB_ID=your-github-client-id-here
GITHUB_SECRET=your-github-client-secret-here
```

---

## Complete Environment Configuration

Your `.env.local` file should now have:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Other API Keys (optional)
KIE_API_KEY=kie_your_api_key_here
```

---

## Testing OAuth Login

### Step 1: Restart Your Development Server

After adding the environment variables, restart the server:
```bash
# Kill the current server (Ctrl+C)
npm run dev
```

### Step 2: Test Google Login

1. Visit `http://localhost:3001/login`
2. Click the "Google" button
3. You'll be redirected to Google's login page
4. After authorizing, you'll be redirected back to your app
5. You should be logged in with your Google account

### Step 3: Test GitHub Login

1. Visit `http://localhost:3001/login`
2. Click the "GitHub" button
3. You'll be redirected to GitHub's authorization page
4. After authorizing, you'll be redirected back to your app
5. You should be logged in with your GitHub account

---

## Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: The callback URL doesn't match what you configured.

**Solution**:
- Make sure the redirect URI in Google/GitHub matches exactly
- Check if you're using the correct port (3001 vs 3000)
- Include the protocol (`http://` or `https://`)

### "OAuth app not found" Error

**Problem**: Client ID or Secret is incorrect.

**Solution**:
- Double-check your `.env.local` file
- Make sure there are no extra spaces
- Restart your development server after changing env variables

### User Doesn't Have Credits After OAuth Login

**Problem**: OAuth users start with 0 credits.

**Solution**: This is handled automatically. New OAuth users get 100 credits on first login.

---

## Security Notes

### For Development

- Use `http://localhost:3001` for callback URLs
- NEXTAUTH_SECRET can be any random string

### For Production

1. Generate a secure NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

2. Update NEXTAUTH_URL to your production domain:
   ```bash
   NEXTAUTH_URL=https://sora-2.site
   ```

3. Update callback URLs in Google and GitHub to use your production domain

4. Never commit `.env.local` to version control (it's already in `.gitignore`)

---

## Support

If you need help:
- Check [NextAuth.js Documentation](https://next-auth.js.org/)
- Check [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- Check [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
