# Production Deployment Guide

Complete guide for deploying your portfolio to production on Vercel with MongoDB Atlas, Firebase, and all required services.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
  - [MongoDB Atlas](#mongodb-atlas)
  - [Firebase Production](#firebase-production)
  - [AWS S3 (Optional)](#aws-s3-optional)
  - [Resend (Optional)](#resend-optional)
- [Vercel Deployment](#vercel-deployment)
  - [Initial Setup](#initial-setup)
  - [Environment Variables](#environment-variables)
  - [Deploy](#deploy)
- [Post-Deployment](#post-deployment)
  - [Database Seeding](#database-seeding)
  - [Create Admin User](#create-admin-user)
  - [Health Check](#health-check)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Rollback Procedures](#rollback-procedures)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying to production, ensure you have:

- ✅ Vercel account ([sign up](https://vercel.com/signup))
- ✅ MongoDB Atlas account ([sign up](https://www.mongodb.com/cloud/atlas/register))
- ✅ Firebase project ([create project](https://console.firebase.google.com/))
- ✅ Domain name (optional but recommended)
- ✅ GitHub account (for CI/CD)
- ✅ Vercel CLI installed: `npm install -g vercel`

---

## Environment Setup

### MongoDB Atlas

#### 1. Create Production Cluster

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Build a Database"** or create new cluster
3. Choose cluster tier:
   - **Development**: M0 Free (limited features)
   - **Production**: M2+ (recommended for production)
4. Select cloud provider and region (choose closest to your users)
5. Cluster name: `portfolio-production`
6. Click **"Create Cluster"** (takes 5-10 minutes)

#### 2. Configure Database Access

1. Go to **"Database Access"** in sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `portfolio_admin` (or your choice)
5. Password: Generate a strong password (save it securely!)
6. Database User Privileges: **Atlas admin** or **Read and write to any database**
7. Click **"Add User"**

#### 3. Configure Network Access

1. Go to **"Network Access"** in sidebar
2. Click **"Add IP Address"**
3. For production:
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Or add specific Vercel IP ranges if known
4. Click **"Confirm"**

#### 4. Get Connection String

1. Go to **"Database"** in sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials
7. Add database name before the `?`:
   ```
   mongodb+srv://portfolio_admin:yourpassword@cluster.mongodb.net/portfolio_production?retryWrites=true&w=majority
   ```

#### 5. Database Indexes (Optional but Recommended)

After first deployment, create indexes for better performance:

```javascript
// In MongoDB Atlas > Collections > Create Index

// Projects collection
{ slug: 1 }  // unique
{ status: 1, featured: 1 }
{ category: 1 }
{ createdAt: -1 }

// Pages collection
{ slug: 1 }  // unique
{ status: 1 }

// Users collection
{ email: 1 }  // unique
{ firebaseUid: 1 }  // unique
```

---

### Firebase Production

#### 1. Create Production Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Project name: `your-portfolio-prod` (or your choice)
4. Enable Google Analytics: **Yes** (recommended)
5. Click **"Create project"**

#### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on Email/Password
   - Enable the first toggle (Email/Password)
   - Click **"Save"**

#### 3. Configure Storage (for media uploads)

1. In Firebase Console, go to **Storage**
2. Click **"Get started"**
3. Choose **"Start in production mode"**
4. Select storage location (choose closest to your users)
5. Click **"Done"**

#### 4. Update Storage Rules

Go to **Storage > Rules** and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images
    match /media/{allPaths=**} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Only authenticated users can write
    }

    // Protect other paths
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

#### 5. Configure CORS

Add CORS configuration to allow uploads from your domain:

1. Install Google Cloud SDK or use Cloud Shell
2. Create `cors.json`:

```json
[
  {
    "origin": ["https://yourportfolio.com", "https://www.yourportfolio.com"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

3. Run:
```bash
gsutil cors set cors.json gs://your-bucket-name.appspot.com
```

#### 6. Get Firebase Config (Public)

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click web icon (`</>`) to add a web app
4. App nickname: `Portfolio Production`
5. **Do not** enable Firebase Hosting
6. Click **"Register app"**
7. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-portfolio-prod.firebaseapp.com",
  projectId: "your-portfolio-prod",
  storageBucket: "your-portfolio-prod.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123...",
  measurementId: "G-..." // optional
};
```

Save these values - you'll add them to Vercel environment variables.

#### 7. Generate Service Account Key (Private)

1. Go to **Project Settings > Service accounts**
2. Click **"Generate new private key"**
3. Click **"Generate key"** (downloads JSON file)
4. **IMPORTANT**: Keep this file secure! Never commit to git
5. Open the JSON file and extract these values:
   - `project_id`
   - `private_key`
   - `client_email`

---

### AWS S3 (Optional)

If you want to use S3 for media storage instead of Firebase:

#### 1. Create S3 Bucket

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Go to **S3**
3. Click **"Create bucket"**
4. Bucket name: `your-portfolio-media` (must be globally unique)
5. Region: Choose closest to your users
6. Block Public Access: **Uncheck** (we need public read access for images)
7. Click **"Create bucket"**

#### 2. Configure Bucket Policy

1. Go to your bucket > **Permissions** > **Bucket policy**
2. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-portfolio-media/*"
    }
  ]
}
```

#### 3. Create IAM User

1. Go to **IAM** > **Users**
2. Click **"Add users"**
3. Username: `portfolio-s3-uploader`
4. Access type: **Programmatic access**
5. Permissions: **Attach existing policies directly**
6. Select: **AmazonS3FullAccess** (or create custom policy)
7. Click **"Create user"**
8. **IMPORTANT**: Save the Access Key ID and Secret Access Key

---

### Resend (Optional)

For sending transactional emails (contact form, notifications):

1. Sign up at [Resend](https://resend.com/signup)
2. Verify your domain or use `onboarding@resend.dev` for testing
3. Go to **API Keys**
4. Click **"Create API Key"**
5. Name: `Portfolio Production`
6. Permissions: **Sending access**
7. Click **"Create"**
8. **IMPORTANT**: Copy the API key (shown only once)

---

## Vercel Deployment

### Initial Setup

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Link Project to Vercel

```bash
# Login to Vercel
vercel login

# Link project (in project root)
vercel link

# Follow prompts:
# - Set up and deploy? No (we'll configure first)
# - Which scope? Your account
# - Link to existing project? No
# - Project name? your-portfolio (or your choice)
# - In which directory is your code? ./
```

This creates `.vercel` directory with project settings.

#### 3. Get Vercel Project IDs (for GitHub Actions)

```bash
# Get project ID
cat .vercel/project.json
```

Save the `projectId` and `orgId` - you'll need them for GitHub Actions.

---

### Environment Variables

#### Option 1: Via Vercel Dashboard (Recommended)

1. Go to your project on [Vercel](https://vercel.com/dashboard)
2. Click **Settings** > **Environment Variables**
3. Add each variable below:

**General**

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_SERVER_URL` | `https://yourportfolio.com` | Production, Preview, Development |

**Payload CMS**

| Variable | Value | Environment |
|----------|-------|-------------|
| `PAYLOAD_SECRET` | Generate: `openssl rand -base64 32` | Production, Preview |
| `DATABASE_URI` | Your MongoDB Atlas connection string | Production, Preview |

**Firebase (Public - Client Side)**

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase config | All |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | From Firebase config | All |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | From Firebase config | All |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | From Firebase config | All |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | From Firebase config | All |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | From Firebase config | All |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | From Firebase config (optional) | All |

**Firebase (Private - Server Side)**

| Variable | Value | Environment |
|----------|-------|-------------|
| `FIREBASE_PROJECT_ID` | From service account JSON | Production, Preview |
| `FIREBASE_CLIENT_EMAIL` | From service account JSON | Production, Preview |
| `FIREBASE_PRIVATE_KEY` | From service account JSON | Production, Preview |
| `FIREBASE_STORAGE_BUCKET` | From Firebase config | Production, Preview |

**IMPORTANT for FIREBASE_PRIVATE_KEY**:
- Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- In Vercel, paste it with actual line breaks (not `\n`)
- Should look like:
  ```
  -----BEGIN PRIVATE KEY-----
  MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSj...
  ...multiple lines...
  -----END PRIVATE KEY-----
  ```

**AWS S3 (Optional)**

| Variable | Value | Environment |
|----------|-------|-------------|
| `S3_BUCKET` | Your S3 bucket name | Production, Preview |
| `S3_REGION` | Your S3 region | Production, Preview |
| `S3_ACCESS_KEY_ID` | AWS Access Key | Production, Preview |
| `S3_SECRET_ACCESS_KEY` | AWS Secret Key | Production, Preview |

**Resend (Optional)**

| Variable | Value | Environment |
|----------|-------|-------------|
| `RESEND_API_KEY` | Your Resend API key | Production, Preview |
| `EMAIL_FROM` | `noreply@yourportfolio.com` | Production, Preview |
| `EMAIL_TO` | Your email address | Production, Preview |

#### Option 2: Via Vercel CLI

```bash
# Set production environment variables
vercel env add PAYLOAD_SECRET production
vercel env add DATABASE_URI production
vercel env add FIREBASE_PROJECT_ID production
# ... etc for all variables

# Set preview environment variables
vercel env add PAYLOAD_SECRET preview
# ... etc
```

---

### Deploy

#### First Deployment (Preview)

Deploy to preview environment to test:

```bash
# Deploy to preview
vercel

# Or use npm script
npm run deploy:preview
```

This deploys to a preview URL like `https://your-portfolio-abc123.vercel.app`

**Test your preview deployment:**
1. Visit the preview URL
2. Check homepage loads
3. Test projects page
4. Try admin login at `/admin/login`
5. Check health endpoint: `/api/health`

#### Production Deployment

Once preview is tested and working:

```bash
# Deploy to production
vercel --prod

# Or use npm script
npm run deploy
```

This deploys to your production domain.

#### Custom Domain

1. Go to Vercel Dashboard > Your Project > **Settings** > **Domains**
2. Add your domain: `yourportfolio.com`
3. Follow DNS configuration instructions:
   - Add A record: `76.76.21.21`
   - Or CNAME record: `cname.vercel-dns.com`
4. Vercel automatically provisions SSL certificate

---

## Post-Deployment

### Database Seeding

After first deployment, seed your database with sample content:

#### 1. Via Vercel CLI

```bash
# SSH into Vercel deployment
vercel env pull .env.production.local

# Run seed script locally (connects to production DB)
npm run seed
```

#### 2. Via Custom Script

Create a temporary API route `/api/seed/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

export async function POST(request: Request) {
  // Add authentication check here!
  const { password } = await request.json()

  if (password !== process.env.SEED_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Run seed functions
  // ...

  return NextResponse.json({ success: true })
}
```

Then call via:
```bash
curl -X POST https://yourportfolio.com/api/seed \
  -H "Content-Type: application/json" \
  -d '{"password":"your-seed-password"}'
```

**IMPORTANT**: Delete this route after seeding!

---

### Create Admin User

#### Via Firebase Console

1. Go to Firebase Console > **Authentication**
2. Click **"Add user"**
3. Email: `your-admin-email@example.com`
4. Password: Create a strong password
5. Click **"Add user"**
6. Visit `https://yourportfolio.com/admin/login`
7. Log in with your credentials

The Payload user will be automatically created on first login.

#### Via API (if needed)

```bash
# Create user via Payload API
curl -X POST https://yourportfolio.com/api/users/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-secure-password",
    "role": "admin"
  }'
```

---

### Health Check

Verify deployment is working:

```bash
# Check health endpoint
curl https://yourportfolio.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-21T12:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "0.1.0",
  "services": {
    "database": { "status": "healthy", "responseTime": 45 },
    "payload": { "status": "healthy", "responseTime": 45 },
    "firebase": { "status": "healthy", "responseTime": 0 }
  },
  "responseTime": 50
}
```

---

## CI/CD with GitHub Actions

Automated deployment via GitHub Actions is already configured in `.github/workflows/deploy.yml`.

### Setup GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `VERCEL_TOKEN` | Vercel API token | [Vercel Account Settings](https://vercel.com/account/tokens) > Create Token |
| `VERCEL_ORG_ID` | Your Vercel org ID | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your project ID | From `.vercel/project.json` |
| `PAYLOAD_SECRET` | Same as Vercel env var | Generate with `openssl rand -base64 32` |
| `DATABASE_URI` | Same as Vercel env var | MongoDB Atlas connection string |
| `NEXT_PUBLIC_SERVER_URL` | Production URL | `https://yourportfolio.com` |

### How CI/CD Works

**On Pull Request:**
1. Runs lint and type check
2. Runs build check
3. Deploys to preview environment
4. Comments PR with preview URL

**On Push to `develop`:**
1. Runs lint and type check
2. Runs build check
3. Deploys to staging environment

**On Push to `main`:**
1. Runs lint and type check
2. Runs build check
3. Deploys to production
4. Creates deployment summary

### Manual Workflow Trigger

You can also trigger deployments manually:

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Vercel** workflow
3. Click **Run workflow**
4. Choose branch and environment

---

## Monitoring & Maintenance

### Vercel Analytics

1. Go to Vercel Dashboard > Your Project > **Analytics**
2. Enable Vercel Analytics (free tier available)
3. View:
   - Real User Metrics (Web Vitals)
   - Page views
   - Top pages
   - Visitor locations

### Uptime Monitoring

Use a service like:
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

Configure to ping `/api/health` every 5 minutes.

### Error Tracking (Optional)

#### Sentry Setup

1. Sign up at [Sentry](https://sentry.io/)
2. Create new project (Next.js)
3. Install SDK:
```bash
npm install @sentry/nextjs
```

4. Initialize:
```bash
npx @sentry/wizard@latest -i nextjs
```

5. Add environment variable to Vercel:
```
SENTRY_DSN=your-sentry-dsn
```

### Database Backups

#### MongoDB Atlas Backups

1. Go to MongoDB Atlas > **Backup**
2. Enable **Cloud Backups** (available on M2+ clusters)
3. Configure:
   - Retention period: 7 days (or more)
   - Snapshot frequency: Daily
   - Restore point: Continuous

#### Manual Backup

```bash
# Export entire database
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/portfolio_production" --out=./backup-$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/portfolio_production" ./backup-20240121
```

### Log Monitoring

View logs in Vercel Dashboard:
1. Go to your project > **Deployments**
2. Click on a deployment
3. Click **Logs** tab

Filter by:
- Time range
- Log level (info, error, warn)
- Function/route

---

## Rollback Procedures

### Quick Rollback via Vercel Dashboard

1. Go to Vercel Dashboard > Your Project > **Deployments**
2. Find the last working deployment
3. Click **•••** > **Promote to Production**
4. Confirm rollback

This instantly reverts to the previous deployment.

### Rollback via CLI

```bash
# List recent deployments
vercel ls

# Promote specific deployment to production
vercel promote <deployment-url> --prod
```

### Rollback via GitHub

If using CI/CD:

1. Revert the problematic commit:
```bash
git revert <commit-hash>
git push origin main
```

2. GitHub Actions automatically deploys the reverted version

### Database Rollback

If database changes caused issues:

```bash
# Restore from backup
mongorestore --uri="your-connection-string" --drop ./backup-folder
```

**IMPORTANT**: Test in preview environment first!

---

## Troubleshooting

### Common Issues

#### Build Fails on Vercel

**Error**: `Module not found` or `Cannot find module`

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build:prod
```

#### Database Connection Fails

**Error**: `MongoServerError: Authentication failed`

**Solutions**:
1. Check `DATABASE_URI` in Vercel environment variables
2. Verify MongoDB Atlas user credentials
3. Check IP whitelist in MongoDB Atlas (should be `0.0.0.0/0`)
4. Ensure database user has correct permissions

#### Firebase Authentication Not Working

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solutions**:
1. Check all `NEXT_PUBLIC_FIREBASE_*` variables in Vercel
2. Verify Firebase project is in production mode
3. Check authorized domains in Firebase Console > Authentication > Settings
4. Add your Vercel domain to authorized domains

#### Admin Panel 403 Forbidden

**Error**: 403 when accessing `/admin`

**Solutions**:
1. Check middleware is not blocking requests
2. Verify `payload-token` cookie is being set
3. Check Firebase service account credentials
4. Test authentication flow in preview environment

#### Images Not Loading

**Error**: Images return 404 or fail to load

**Solutions**:
1. Check Firebase Storage rules allow public read
2. Verify `FIREBASE_STORAGE_BUCKET` environment variable
3. Check CORS configuration on Firebase Storage
4. Verify image URLs in database are correct

#### Slow Performance

**Solutions**:
1. Enable Vercel Analytics to identify slow pages
2. Check database query performance (add indexes)
3. Review Next.js bundle size:
   ```bash
   ANALYZE=true npm run build
   ```
4. Optimize images (use Next.js Image component)
5. Enable ISR for dynamic pages

### Getting Help

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Payload CMS Documentation](https://payloadcms.com/docs)
3. Check [Next.js Documentation](https://nextjs.org/docs)
4. Check deployment logs in Vercel Dashboard
5. Check browser console for client-side errors
6. Check `/api/health` endpoint for service status

### Debug Mode

Enable debug logging:

1. Add to Vercel environment variables:
```
DEBUG=payload:*
NODE_OPTIONS=--inspect
```

2. View detailed logs in Vercel Dashboard

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to git
- ✅ Use different secrets for production/preview/development
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use Vercel's encrypted environment variables
- ✅ Limit access to production environment variables

### Database

- ✅ Use strong passwords (20+ characters)
- ✅ Enable MongoDB Atlas encryption at rest
- ✅ Regular backups (daily minimum)
- ✅ Monitor for unusual access patterns
- ✅ Keep MongoDB driver updated

### Authentication

- ✅ Enforce strong password requirements (already configured)
- ✅ Enable Firebase email verification
- ✅ Monitor failed login attempts
- ✅ Use rate limiting on auth endpoints (already configured)
- ✅ Enable 2FA for admin accounts (Firebase)

### Headers

- ✅ Security headers configured (CSP, HSTS, etc.)
- ✅ CORS restricted to your domain
- ✅ No sensitive data in response headers
- ✅ Proper cache headers for static/dynamic content

---

## Checklist

### Pre-Deployment

- [ ] MongoDB Atlas production cluster created
- [ ] Database user and password configured
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string tested
- [ ] Firebase production project created
- [ ] Firebase Authentication enabled
- [ ] Firebase Storage configured with rules
- [ ] Firebase service account key generated
- [ ] All environment variables documented
- [ ] Domain name purchased (optional)

### Vercel Setup

- [ ] Vercel CLI installed
- [ ] Project linked to Vercel
- [ ] All environment variables added to Vercel
- [ ] `FIREBASE_PRIVATE_KEY` formatted correctly
- [ ] Preview deployment tested
- [ ] Health endpoint returns 200
- [ ] Admin login works

### Production Deployment

- [ ] Production deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Database seeded with initial content
- [ ] Admin user created in Firebase
- [ ] Admin panel accessible
- [ ] All pages load correctly
- [ ] Images display properly
- [ ] Forms work (contact, etc.)

### CI/CD Setup

- [ ] GitHub secrets added
- [ ] Workflow runs successfully
- [ ] PR previews working
- [ ] Production deploys on merge

### Monitoring

- [ ] Vercel Analytics enabled
- [ ] Uptime monitoring configured
- [ ] Error tracking configured (optional)
- [ ] Database backups enabled
- [ ] Log monitoring set up

### Security

- [ ] Security headers verified
- [ ] HTTPS enforced
- [ ] Admin panel protected
- [ ] API routes secured
- [ ] Rate limiting active
- [ ] Secrets rotated and secured

---

## Quick Commands Reference

```bash
# Local development
npm run dev

# Production build test
npm run build:prod

# Type check
npm run type-check

# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy

# Seed database
npm run seed

# Pull environment variables from Vercel
vercel env pull .env.local

# View production logs
vercel logs

# Check deployment status
vercel inspect <deployment-url>
```

---

## Support

For issues or questions:

1. Check this documentation
2. Review logs in Vercel Dashboard
3. Check `/api/health` endpoint
4. Consult official documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)
   - [Payload CMS Docs](https://payloadcms.com/docs)
   - [Firebase Docs](https://firebase.google.com/docs)

---

**Last Updated**: January 2026
**Version**: 1.0.0
