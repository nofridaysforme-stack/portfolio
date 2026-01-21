# Firebase Production Setup Guide

Complete guide for configuring Firebase for your portfolio production deployment, including Authentication, Storage, and security rules.

## Overview

Firebase provides:
- **Authentication**: Email/password auth for admin panel
- **Cloud Storage**: Media file storage for CMS uploads
- **Admin SDK**: Server-side authentication and user management
- **Security**: Built-in security rules and CORS configuration

---

## Prerequisites

- Google account
- Access to [Firebase Console](https://console.firebase.google.com/)
- Basic understanding of Firebase services

---

## Step-by-Step Setup

### 1. Create Production Project

#### Create New Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** or **Create a project**
3. **Step 1**: Enter project details
   - Project name: `portfolio-production` (or your choice)
   - Click **Continue**
4. **Step 2**: Google Analytics (Recommended)
   - Enable Google Analytics: **Yes**
   - Benefits:
     - User behavior tracking
     - Authentication analytics
     - Storage usage metrics
     - Free integration
   - Click **Continue**
5. **Step 3**: Configure Google Analytics
   - Use existing account or create new
   - Analytics location: Your country
   - Accept terms
   - Click **Create project**

⏱️ Project creation takes 30-60 seconds

#### Project Settings

1. Click **Project Overview** > **Project settings** (gear icon)
2. Note your **Project ID** (e.g., `portfolio-production-a1b2c`)
3. Configure project:
   - **Default GCP resource location**: Choose region closest to users
     - `us-central1` - Iowa (good for US)
     - `us-east1` - South Carolina (good for US East)
     - `europe-west1` - Belgium (good for Europe)
     - `asia-northeast1` - Tokyo (good for Asia)
   - Click **Done**

---

### 2. Enable Authentication

#### Set Up Email/Password Authentication

1. In Firebase Console sidebar, click **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. **Enable Email/Password**:
   - Click **Email/Password** provider
   - Enable first toggle: **Email/Password** ✅
   - Leave second toggle disabled: **Email link (passwordless sign-in)** ❌
   - Click **Save**

#### Configure Authentication Settings

1. Go to **Settings** tab (in Authentication)
2. **Authorized domains**:
   - Automatically includes: `localhost`, `*.firebaseapp.com`, `*.web.app`
   - Add your production domain:
     - Click **Add domain**
     - Enter: `yourportfolio.com`
     - Enter: `www.yourportfolio.com` (if using www)
     - Enter your Vercel preview domains: `*.vercel.app`
   - Click **Add**

3. **User account management**:
   - Email enumeration protection: **Enabled** (recommended)
   - Prevents attackers from discovering registered emails

4. **Password policy** (if available):
   - Minimum length: 8 characters
   - Requires uppercase: Yes
   - Requires lowercase: Yes
   - Requires numeric: Yes
   - Requires non-alphanumeric: Yes

#### Create First Admin User

1. Go to **Users** tab
2. Click **Add user**
3. Email: `admin@yourportfolio.com` (or your email)
4. Password: Create strong password (20+ characters)
5. User UID: Auto-generated
6. Click **Add user**

**Note**: This creates a Firebase auth user. The Payload CMS user will be created automatically on first login.

---

### 3. Get Firebase Client Config (Public)

#### Retrieve Web App Configuration

1. Go to **Project settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click web icon (`</>`) to add a web app
4. **Register app**:
   - App nickname: `Portfolio Production Web`
   - Firebase Hosting: **Do not check** (we're using Vercel)
   - Click **Register app**
5. Copy the Firebase configuration:

```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "portfolio-production-a1b2c.firebaseapp.com",
  projectId: "portfolio-production-a1b2c",
  storageBucket: "portfolio-production-a1b2c.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX" // Optional, if Analytics enabled
};
```

6. Click **Continue to console**

**Save these values** - you'll add them to Vercel environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

---

### 4. Generate Service Account Key (Private)

#### Create Service Account

1. Go to **Project settings** > **Service accounts** tab
2. You'll see: **Firebase Admin SDK**
3. Language: **Node.js** (selected by default)
4. Click **Generate new private key**
5. Confirm: **Generate key**
6. A JSON file downloads: `portfolio-production-a1b2c-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

**⚠️ CRITICAL**:
- Keep this file secure and private
- Never commit to git
- Never expose publicly
- Store in password manager or secure vault

#### Extract Service Account Values

Open the downloaded JSON file and extract:

```json
{
  "type": "service_account",
  "project_id": "portfolio-production-a1b2c",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@portfolio-production-a1b2c.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

**Save these values** for Vercel environment variables:
- `FIREBASE_PROJECT_ID` → `project_id`
- `FIREBASE_CLIENT_EMAIL` → `client_email`
- `FIREBASE_PRIVATE_KEY` → `private_key` (entire key, including header/footer)
- `FIREBASE_STORAGE_BUCKET` → from client config above

---

### 5. Configure Cloud Storage

#### Enable Cloud Storage

1. In Firebase Console sidebar, click **Storage**
2. Click **Get started**
3. **Secure rules**:
   - Start in production mode: **Select this** (we'll customize rules next)
   - Click **Next**
4. **Storage location**:
   - Choose same region as you selected for project (e.g., `us-central1`)
   - Click **Done**

⏱️ Takes 1-2 minutes to set up

#### Configure Storage Rules

1. Go to **Storage** > **Rules** tab
2. Replace default rules with:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // Media uploads from CMS
    match /media/{allPaths=**} {
      // Anyone can read (public images)
      allow read: if true;

      // Only authenticated admin users can write
      allow write: if request.auth != null
                   && request.auth.token.email != null;
    }

    // Project images
    match /projects/{projectId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Thumbnails
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Deny access to all other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **Publish**

#### Storage Rules Explained

- `allow read: if true` → Public read access (images visible to everyone)
- `allow write: if request.auth != null` → Only authenticated users can upload
- Separate paths for different content types
- Default deny for unlisted paths

---

### 6. Configure CORS for Storage

CORS (Cross-Origin Resource Sharing) allows your Vercel domain to upload files to Firebase Storage.

#### Option 1: Using Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Open **Cloud Shell** (terminal icon in top right)
4. Create CORS configuration file:

```bash
cat > cors.json << 'EOF'
[
  {
    "origin": ["https://yourportfolio.com", "https://www.yourportfolio.com", "https://*.vercel.app"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
EOF
```

5. Apply CORS configuration:

```bash
# Replace YOUR-PROJECT-ID with your Firebase project ID
gsutil cors set cors.json gs://portfolio-production-a1b2c.appspot.com
```

6. Verify CORS configuration:

```bash
gsutil cors get gs://portfolio-production-a1b2c.appspot.com
```

#### Option 2: Using gcloud CLI (Local)

If you have `gcloud` CLI installed locally:

```bash
# Install gcloud if needed
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project portfolio-production-a1b2c

# Create cors.json (same as above)

# Apply CORS
gsutil cors set cors.json gs://portfolio-production-a1b2c.appspot.com
```

#### Verify CORS Setup

Test CORS by uploading a file from your application. Check browser console for any CORS errors.

---

### 7. Set Up Usage Quotas and Monitoring

#### View Usage and Quotas

1. Go to **Usage and billing** (left sidebar)
2. View current usage:
   - **Authentication**: Active users
   - **Storage**: GB stored, GB downloaded
   - **Cloud Functions**: Invocations (if using)

#### Free Tier Limits (Spark Plan)

**Authentication**:
- Unlimited users
- 10k verifications/month for phone auth (not using)

**Storage**:
- 5 GB stored
- 1 GB/day download
- 20k uploads/day
- 50k downloads/day

**Good for**:
- Small to medium portfolio sites
- Development and testing
- Low to moderate traffic

#### Upgrade to Blaze Plan (Pay-as-you-go)

For production with higher traffic:

1. Go to **Usage and billing** > **Details & settings**
2. Click **Modify plan**
3. Select **Blaze plan**
4. Add billing information
5. Set budget alerts (recommended):
   - Budget amount: $10/month (or your limit)
   - Alert threshold: 50%, 90%, 100%
   - Email notifications

**Blaze Plan Pricing** (after free tier):
- Storage: $0.026/GB/month
- Downloads: $0.12/GB
- Uploads: $0.05/10k operations

**Budget Control**:
- Set up budget alerts in Google Cloud Console
- Monitor usage regularly
- Optimize file sizes (compress images)

---

### 8. Security Configuration

#### Enable App Check (Optional, Recommended)

App Check protects your Firebase resources from abuse:

1. Go to **App Check** (left sidebar)
2. Click **Get started**
3. Register your web app
4. Choose provider:
   - **reCAPTCHA v3** (easiest for web)
   - Click **Register**
5. Copy site key
6. Enable enforcement for services:
   - Authentication: **Not needed** (already protected)
   - Storage: **Enable** (recommended)

Add site key to environment variables:
```
NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY=your-site-key
```

#### Configure Security Rules Best Practices

**Authentication Rules**:
- ✅ Require email verification for sensitive actions
- ✅ Implement rate limiting
- ✅ Use strong password requirements
- ✅ Enable email enumeration protection

**Storage Rules**:
- ✅ Validate file types and sizes
- ✅ Scan for malware (Cloud Functions)
- ✅ Implement upload quotas per user
- ✅ Use unique file names to prevent overwrites

**Enhanced Storage Rules** (Optional):

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isImage() {
      return request.resource.contentType.matches('image/.*');
    }

    function isValidSize() {
      // Max 10MB
      return request.resource.size < 10 * 1024 * 1024;
    }

    match /media/{fileName} {
      allow read: if true;

      allow write: if isAuthenticated()
                   && isImage()
                   && isValidSize();
    }
  }
}
```

---

### 9. Monitoring and Analytics

#### Enable Performance Monitoring

1. Go to **Performance** (left sidebar)
2. Click **Get started**
3. Add SDK to your web app (optional, for client-side monitoring)

#### View Authentication Analytics

1. Go to **Authentication** > **Users** tab
2. View metrics:
   - Total users
   - Active users
   - Sign-in methods
   - User activity timeline

#### Set Up Alerts

1. Go to **Alerts** (in Project settings)
2. Configure alerts for:
   - **High storage usage**: >80% of quota
   - **High bandwidth**: >80% of quota
   - **Authentication failures**: Spike in failed sign-ins
   - **Budget alerts**: >$5 spent/month

---

## Add Environment Variables to Vercel

### Client-Side (Public) Variables

These are safe to expose in client-side code:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase config | `AIzaSyBXXXXXXX...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | From Firebase config | `project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | From Firebase config | `portfolio-production-a1b2c` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | From Firebase config | `project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase config | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase config | `1:123...:web:abc...` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | From Firebase config | `G-XXXXXXXXXX` |

### Server-Side (Private) Variables

These must be kept secret:

| Variable | Value | Important Notes |
|----------|-------|-----------------|
| `FIREBASE_PROJECT_ID` | From service account | Same as public project ID |
| `FIREBASE_CLIENT_EMAIL` | From service account | `firebase-adminsdk-...@....iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | From service account | **CRITICAL**: Copy entire key with line breaks! |
| `FIREBASE_STORAGE_BUCKET` | From Firebase config | Same as public storage bucket |

### How to Add FIREBASE_PRIVATE_KEY to Vercel

**IMPORTANT**: The private key must preserve line breaks.

#### Method 1: Via Vercel Dashboard (Recommended)

1. Open service account JSON file
2. Copy the entire `private_key` value, including:
   - `-----BEGIN PRIVATE KEY-----`
   - All the encoded key content
   - `-----END PRIVATE KEY-----`
3. In Vercel Dashboard:
   - Go to Settings > Environment Variables
   - Add `FIREBASE_PRIVATE_KEY`
   - Paste the key with **real line breaks** (not `\n`)
   - Should look like:
     ```
     -----BEGIN PRIVATE KEY-----
     MIIEvQIBADANBgkqhkiG9w0BAQE...
     ...multiple lines...
     -----END PRIVATE KEY-----
     ```
4. Select environments: Production, Preview
5. Click Save

#### Method 2: Via Vercel CLI

```bash
# Copy key to temporary file
cat > private-key.txt << 'EOF'
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
...your actual key content...
-----END PRIVATE KEY-----
EOF

# Add to Vercel (preserves line breaks)
vercel env add FIREBASE_PRIVATE_KEY production < private-key.txt

# Delete temporary file
rm private-key.txt
```

#### Common Mistakes

❌ **Wrong**: Copying with `\n` as literal text
❌ **Wrong**: Copying without header/footer
❌ **Wrong**: Removing line breaks
✅ **Correct**: Copying entire key with real line breaks preserved

---

## Testing Firebase Setup

### Test Authentication

1. Deploy to Vercel preview:
```bash
vercel
```

2. Navigate to `/admin/login`
3. Try logging in with admin credentials
4. Check for successful login and redirect

### Test Storage

1. Log in to admin panel
2. Try uploading an image in Media collection
3. Verify upload succeeds
4. Check image displays correctly
5. Verify image URL is accessible publicly

### Test Health Check

```bash
curl https://your-preview.vercel.app/api/health

# Check Firebase status in response
{
  "services": {
    "firebase": { "status": "healthy" }
  }
}
```

---

## Troubleshooting

### Authentication Issues

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solutions**:
- Check `NEXT_PUBLIC_FIREBASE_API_KEY` in Vercel
- Verify API key is correct in Firebase Console
- Ensure no extra spaces or quotes

**Error**: `Firebase: Error (auth/unauthorized-domain)`

**Solutions**:
- Add your domain to Authorized domains in Firebase Console
- Add `*.vercel.app` for preview deployments
- Wait 5-10 minutes for changes to propagate

**Error**: `Auth token verification failed`

**Solutions**:
- Check `FIREBASE_PRIVATE_KEY` has correct line breaks
- Verify service account has not been deleted
- Ensure `FIREBASE_PROJECT_ID` matches

### Storage Issues

**Error**: `CORS error when uploading file`

**Solutions**:
- Verify CORS configuration is applied
- Check domain is included in CORS origins
- Wait 10-15 minutes for CORS changes to propagate
- Try uploading with different tool (Postman) to isolate issue

**Error**: `Permission denied` when uploading

**Solutions**:
- Check Storage Rules allow authenticated writes
- Verify user is properly authenticated
- Check Auth token is being sent in request
- Review Storage Rules match patterns

**Error**: `Quota exceeded`

**Solutions**:
- Check usage in Firebase Console
- Upgrade to Blaze plan if needed
- Optimize file sizes (compress images)
- Delete unused files

---

## Maintenance

### Regular Tasks

**Weekly**:
- [ ] Monitor authentication analytics
- [ ] Check storage usage
- [ ] Review failed authentication attempts

**Monthly**:
- [ ] Audit authorized domains list
- [ ] Review storage rules
- [ ] Check for unused files to delete
- [ ] Review costs (if on Blaze plan)

**Quarterly**:
- [ ] Audit user accounts
- [ ] Update security rules if needed
- [ ] Review and optimize CORS settings
- [ ] Test backup/restore procedures

---

## Checklist

### Initial Setup
- [ ] Firebase production project created
- [ ] Google Analytics enabled
- [ ] Project region selected
- [ ] Email/Password authentication enabled
- [ ] First admin user created
- [ ] Authorized domains added

### Configuration
- [ ] Web app registered
- [ ] Client config copied
- [ ] Service account key generated and downloaded
- [ ] Cloud Storage enabled
- [ ] Storage rules configured
- [ ] CORS configuration applied

### Vercel Integration
- [ ] All public env vars added to Vercel
- [ ] All private env vars added to Vercel
- [ ] `FIREBASE_PRIVATE_KEY` formatted correctly with line breaks
- [ ] Environment variables set for Production and Preview

### Testing
- [ ] Preview deployment successful
- [ ] Admin login works
- [ ] File upload to Storage works
- [ ] Images display correctly
- [ ] Health check returns healthy Firebase status

### Security
- [ ] Storage rules tested and working
- [ ] Service account key stored securely
- [ ] Budget alerts configured (if on Blaze)
- [ ] App Check enabled (optional)

---

## Quick Reference

### Firebase Console URLs

- **Main Console**: https://console.firebase.google.com/
- **Project Overview**: `https://console.firebase.google.com/project/YOUR-PROJECT-ID/overview`
- **Authentication**: `https://console.firebase.google.com/project/YOUR-PROJECT-ID/authentication/users`
- **Storage**: `https://console.firebase.google.com/project/YOUR-PROJECT-ID/storage`
- **Usage**: `https://console.firebase.google.com/project/YOUR-PROJECT-ID/usage`

### Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)
- [Cloud Storage Guide](https://firebase.google.com/docs/storage/web/start)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [StackOverflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Support](https://firebase.google.com/support) (paid plans)

---

**Last Updated**: January 2026
**Version**: 1.0.0
