# Firebase Storage Setup Guide

This guide will help you set up Firebase Storage for scalable media hosting in your portfolio CMS.

## Why Firebase Storage?

- **Scalability**: Handles unlimited file storage without server management
- **Global CDN**: Files are served from Google's CDN for fast worldwide delivery
- **Cost-effective**: Pay only for what you use, generous free tier
- **Automatic backups**: Built-in redundancy and reliability
- **Security**: Fine-grained access control with Firebase rules

## Prerequisites

1. A Google account
2. Node.js 18+ installed
3. Portfolio CMS already set up (MongoDB running)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "Jana Portfolio")
4. Disable Google Analytics (optional for portfolio)
5. Click "Create project"

## Step 2: Enable Firebase Storage

1. In your Firebase project, click "Storage" in the left sidebar
2. Click "Get started"
3. Choose "Start in production mode" (we'll configure rules later)
4. Select a Cloud Storage location (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

### Client-Side Configuration

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register app with a nickname (e.g., "Portfolio Web")
5. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "jana-portfolio.firebaseapp.com",
  projectId: "jana-portfolio",
  storageBucket: "jana-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
}
```

### Server-Side Configuration (Admin SDK)

1. In Firebase Console → Project settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Save the JSON file securely (don't commit to git!)

## Step 4: Configure Environment Variables

Update your `.env` file with Firebase credentials:

```bash
# Firebase Client Config (for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jana-portfolio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=jana-portfolio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jana-portfolio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Firebase Admin (Server-side only - keep secure!)
FIREBASE_ADMIN_PROJECT_ID=jana-portfolio
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@jana-portfolio.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEF...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=jana-portfolio.appspot.com
```

### Important Notes:

- **FIREBASE_ADMIN_PRIVATE_KEY**: Copy the entire `private_key` field from the JSON file
- Keep the quotes and newline characters (`\n`)
- Never commit this file to git (already in `.gitignore`)

## Step 5: Configure Firebase Storage Rules

1. In Firebase Console → Storage
2. Click "Rules" tab
3. Update rules to allow authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Portfolio media folder
    match /portfolio-media/{allPaths=**} {
      // Anyone can read
      allow read: if true;

      // Only authenticated users can write
      // (In production, verify with your backend)
      allow write: if request.auth != null;
    }
  }
}
```

4. Click "Publish"

## Step 6: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Access the admin panel: http://localhost:3000/admin

3. Go to "Content" → "Media"

4. Upload an image:
   - Click "Create New"
   - Choose an image file
   - Enter alt text
   - Save

5. Verify upload:
   - Check the Firebase Storage console
   - You should see files in `/portfolio-media/` folder
   - The Media document should have a `firebaseUrl` field

## How It Works

### Upload Flow

1. User uploads image via Payload admin panel
2. Payload processes image locally (creates size variants)
3. `afterChange` hook uploads original + variants to Firebase
4. Document updated with Firebase URL and path
5. Images served from Firebase CDN

### Delete Flow

1. User deletes media via admin panel
2. Payload deletes local files
3. `afterDelete` hook removes from Firebase
4. All size variants are also deleted

## Image Sizes Generated

The Media collection creates these variants:

- **thumbnail**: 400x300px - For admin panel and thumbnails
- **card**: 768x576px - For project cards and grids
- **feature**: 1920x1080px - For hero images and features

All variants are uploaded to Firebase Storage.

## Troubleshooting

### "Firebase is not configured" warning

**Solution**: Ensure all required environment variables are set:
```bash
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
FIREBASE_STORAGE_BUCKET
```

### Upload fails with permission error

**Solution**:
1. Check Firebase Storage rules allow writes
2. Verify service account has Storage Admin role
3. Check private key is correctly formatted in `.env`

### Images upload but URLs don't work

**Solution**:
1. Verify Storage rules allow public reads
2. Check bucket name matches in `.env`
3. Ensure files are set to public during upload

### Private key format errors

**Problem**: `Error parsing private key`

**Solution**:
- Copy the entire private key including headers
- Keep `\n` characters (don't remove them)
- Wrap in double quotes in `.env`
- Example:
```bash
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADA...\n-----END PRIVATE KEY-----\n"
```

## Production Considerations

### Security

1. **Never expose Admin SDK credentials** in client-side code
2. **Restrict Storage rules** to specific folders
3. **Enable CORS** if serving from different domain
4. **Set up monitoring** for unusual upload patterns

### Performance

1. **Use Firebase CDN URLs** for image serving
2. **Enable caching** headers
3. **Consider Cloud CDN** for even better performance
4. **Implement lazy loading** for images

### Cost Management

1. **Monitor storage usage** in Firebase Console
2. **Set up billing alerts** to avoid surprises
3. **Implement file size limits** (already done: images only)
4. **Clean up unused files** periodically

## Firebase Storage Free Tier

- **Storage**: 5GB
- **Downloads**: 1GB/day
- **Uploads**: 20K/day

This is generous for most portfolios. Monitor usage in Firebase Console.

## Next Steps

- ✅ Firebase Storage configured
- ✅ Media uploads working
- ⏭️ Build frontend to display images
- ⏭️ Add image optimization
- ⏭️ Implement lazy loading

## Additional Resources

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Pricing](https://firebase.google.com/pricing)
