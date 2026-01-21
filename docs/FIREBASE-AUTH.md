# Firebase Authentication Guide

Complete guide to Firebase Authentication integration with Payload CMS admin panel.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup](#setup)
- [Authentication Flow](#authentication-flow)
- [API Routes](#api-routes)
- [Security](#security)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Overview

The portfolio uses Firebase Authentication to secure the Payload CMS admin panel. This provides:

- ✅ Secure email/password authentication
- ✅ Session management with HTTP-only cookies
- ✅ Password reset flow
- ✅ Remember me functionality
- ✅ Protected admin routes
- ✅ Automatic user sync between Firebase and Payload

## Architecture

### Authentication Stack

```
┌─────────────┐
│   Client    │  (Login Page)
└──────┬──────┘
       │ Email/Password
       ▼
┌─────────────┐
│  Firebase   │  (Authentication)
│    Auth     │
└──────┬──────┘
       │ ID Token
       ▼
┌─────────────┐
│   API       │  (Token Exchange)
│  /api/auth  │
└──────┬──────┘
       │ Verify & Create Session
       ▼
┌─────────────┐
│   Payload   │  (CMS Session)
│    CMS      │
└─────────────┘
```

### File Structure

```
src/
├── lib/firebase/
│   ├── client.ts          # Firebase client initialization
│   ├── admin.ts           # Firebase Admin SDK
│   └── auth.ts            # Auth utilities
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx   # Custom login page
│   │   └── forgot-password/
│   │       └── page.tsx   # Password reset page
│   └── api/auth/
│       ├── firebase-exchange/
│       │   └── route.ts   # Token exchange endpoint
│       ├── verify/
│       │   └── route.ts   # Session verification
│       └── logout/
│           └── route.ts   # Logout endpoint
├── payload/collections/
│   └── Users.ts           # Updated with Firebase fields
└── middleware.ts          # Route protection
```

---

## Setup

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication → Email/Password
4. Get configuration from Project Settings

### 2. Environment Variables

Create `.env.local` with Firebase credentials:

```env
# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Firebase Admin (Secret - Server Side Only)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
# Or separate fields:
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Create Firebase Users

**Option A: Firebase Console**
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password

**Option B: Firebase CLI**
```bash
firebase auth:import users.json --project your-project-id
```

**Option C: Programmatically**
```typescript
import { signUp } from '@/lib/firebase/auth'

await signUp('admin@example.com', 'SecurePassword123!')
```

---

## Authentication Flow

### Login Flow

1. **User visits `/admin/login`**
   - Custom login page loads
   - User enters email/password

2. **Firebase Authentication**
   ```typescript
   // Client-side
   const userCredential = await signIn(email, password, rememberMe)
   const idToken = await userCredential.user.getIdToken()
   ```

3. **Token Exchange**
   ```typescript
   // POST /api/auth/firebase-exchange
   // Server verifies Firebase token
   const decodedToken = await adminAuth.verifyIdToken(idToken)
   ```

4. **Payload User Sync**
   - Find user by `firebaseUid`
   - Create user if doesn't exist
   - Update `lastLogin` timestamp
   - Generate Payload session token

5. **Session Creation**
   ```typescript
   // Set HTTP-only cookie
   Set-Cookie: payload-token=...; HttpOnly; Secure; SameSite=Strict
   ```

6. **Redirect to Admin**
   - User redirected to `/admin`
   - Middleware verifies session on each request

### Logout Flow

1. **User clicks logout**
2. **Firebase Sign Out**
   ```typescript
   await logOut()
   ```

3. **Payload Session Clear**
   ```typescript
   // POST /api/auth/logout
   // Clears payload-token cookie
   ```

4. **Redirect to Login**

### Password Reset Flow

1. **User visits `/admin/forgot-password`**
2. **Enter Email**
   ```typescript
   await sendPasswordReset(email)
   ```

3. **Firebase sends reset email**
4. **User clicks link in email**
5. **Firebase password reset page**
6. **User sets new password**
7. **Redirect to login**

---

## API Routes

### POST /api/auth/firebase-exchange

Exchange Firebase ID token for Payload session.

**Request:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI..."
}
```

**Response (Success):**
```json
{
  "token": "payload_session_token",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid token"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing token)
- `401` - Unauthorized (invalid/expired token)
- `500` - Server error

### GET /api/auth/verify

Verify current Payload session.

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Response (Unauthenticated):**
```json
{
  "authenticated": false
}
```

**Status Codes:**
- `200` - Authenticated
- `401` - Not authenticated

### POST /api/auth/logout

Clear Payload session.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes:**
- `200` - Success
- `500` - Server error

---

## Security

### Password Requirements

Enforced by `validatePassword()`:

- ✅ Minimum 8 characters
- ✅ At least one uppercase letter
- ✅ At least one lowercase letter
- ✅ At least one number
- ✅ At least one special character

### Session Security

**HTTP-Only Cookies:**
```typescript
Set-Cookie: payload-token=...; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000
```

- `HttpOnly` - Cannot be accessed by JavaScript
- `Secure` - Only sent over HTTPS
- `SameSite=Strict` - CSRF protection
- `Max-Age=2592000` - 30 days expiration

### Rate Limiting

Payload Users collection configuration:

```typescript
auth: {
  maxLoginAttempts: 5,
  lockTime: 600 * 1000, // 10 minutes
}
```

After 5 failed attempts, account is locked for 10 minutes.

### Protected Routes

Middleware protects `/admin/*` routes:

```typescript
// middleware.ts
export const config = {
  matcher: ['/admin/:path*'],
}
```

Unauthenticated requests redirect to `/admin/login`.

### Token Verification

Every request to protected routes:

1. Check for `payload-token` cookie
2. Verify with Payload: `GET /api/auth/verify`
3. If invalid, redirect to login and clear cookie

---

## Usage

### Login to Admin

1. Navigate to `/admin/login`
2. Enter email and password
3. Optionally check "Remember me"
4. Click "Sign In"
5. On success, redirected to `/admin`

### Password Reset

1. Navigate to `/admin/forgot-password`
2. Enter email address
3. Click "Send Reset Link"
4. Check email for reset link
5. Click link and set new password
6. Return to login page

### Programmatic Usage

**Check if Authenticated:**
```typescript
import { getCurrentUser } from '@/lib/firebase/auth'

const user = getCurrentUser()
if (user) {
  console.log('Authenticated:', user.email)
} else {
  console.log('Not authenticated')
}
```

**Get ID Token:**
```typescript
import { getIdToken } from '@/lib/firebase/auth'

const token = await getIdToken()
// Use token for API calls
```

**Listen to Auth State:**
```typescript
import { onAuthChange } from '@/lib/firebase/auth'

const unsubscribe = onAuthChange((user) => {
  if (user) {
    console.log('User signed in:', user.email)
  } else {
    console.log('User signed out')
  }
})

// Cleanup
unsubscribe()
```

---

## Troubleshooting

### Common Issues

**1. "No account found with this email"**

**Cause**: User doesn't exist in Firebase Authentication

**Solution**:
- Create user in Firebase Console
- Or use `signUp()` to register

**2. "Invalid token" or "Token expired"**

**Cause**: Firebase ID token expired (1 hour lifetime)

**Solution**:
- Login again to get fresh token
- Tokens auto-refresh on active sessions

**3. "Redirecting to login in loop"**

**Cause**: Cookie not being set or session invalid

**Solution**:
- Check browser allows cookies
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check middleware configuration
- Ensure API routes are not blocked

**4. "Firebase UID not syncing"**

**Cause**: API route or Users collection misconfigured

**Solution**:
- Check `/api/auth/firebase-exchange` is working
- Verify Users collection has `firebaseUid` field
- Check server logs for errors

**5. "Too many requests"**

**Cause**: Rate limiting after failed login attempts

**Solution**:
- Wait 10 minutes for account unlock
- Or reset in Firebase Console

### Debug Mode

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug', 'firebase:*')

// Check API responses
fetch('/api/auth/verify', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

### Check Environment Variables

```typescript
// In page or API route
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
})
```

---

## Testing

### Manual Testing Checklist

**Login Flow:**
- [ ] Navigate to `/admin/login`
- [ ] Enter valid credentials
- [ ] Successfully redirected to `/admin`
- [ ] Session persists on page refresh

**Remember Me:**
- [ ] Login with "Remember me" checked
- [ ] Close and reopen browser
- [ ] Still authenticated

**Logout:**
- [ ] Click logout in admin panel
- [ ] Redirected to login page
- [ ] Cannot access `/admin` without re-login

**Password Reset:**
- [ ] Navigate to `/admin/forgot-password`
- [ ] Enter email and submit
- [ ] Receive reset email
- [ ] Click link and reset password
- [ ] Login with new password

**Security:**
- [ ] Cannot access `/admin` without login
- [ ] Invalid token redirects to login
- [ ] After 5 failed attempts, account locks
- [ ] Session expires after inactivity

---

## Resources

### Firebase Documentation

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Security Rules](https://firebase.google.com/docs/rules)

### Payload CMS Documentation

- [Authentication](https://payloadcms.com/docs/authentication/overview)
- [Access Control](https://payloadcms.com/docs/access-control/overview)
- [Collections](https://payloadcms.com/docs/configuration/collections)

### Next.js Documentation

- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)

---

Last Updated: 2026-01-21
