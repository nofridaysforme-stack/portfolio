# Database Seeding Guide

Complete guide to seeding the Payload CMS database with sample content for development and testing.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Available Commands](#available-commands)
- [Seed Data](#seed-data)
- [Customization](#customization)
- [Images & Media](#images--media)
- [Troubleshooting](#troubleshooting)

---

## Overview

The seeding system populates your Payload CMS database with sample content including:

- **6 Sample Projects**: DTF Music Platform, Stem Splitter Pro, PayTrack, SayVows, AI Content Studio, FitnessPro
- **2 Sample Pages**: About and Contact pages with rich content blocks
- **Site Settings**: Default configuration with social links and SEO settings

### Why Seed Data?

- **Development**: Quickly set up a working site with realistic content
- **Testing**: Test features with actual data structures
- **Demo**: Show potential clients or stakeholders what the site looks like
- **Learning**: Understand the content model and structure

---

## Quick Start

### 1. Initial Setup

Make sure your development environment is running:

```bash
# Start development server
npm run dev
```

### 2. Seed the Database

Run the seed command:

```bash
npm run seed
```

You'll see output like:

```
🌱 Starting database seed...

📊 Seeding Projects...
   ✅ Created: DTF Music Platform
   ✅ Created: Stem Splitter Pro
   ✅ Created: PayTrack - Time & Expense Tracker
   ✅ Created: SayVows - Wedding CRM
   ✅ Created: AI Content Studio
   ✅ Created: FitnessPro - Personal Training Platform

   Summary: 6 created, 0 skipped

📄 Seeding Pages...
   ✅ Created: About
   ✅ Created: Contact

   Summary: 2 created, 0 skipped

⚙️  Seeding Site Settings...
   ✅ Settings updated successfully

✨ Seeding complete!

📝 Next steps:
   1. Visit http://localhost:3000/admin
   2. Login with your credentials
   3. View your seeded content
   4. Upload images via the Media collection
```

### 3. View the Content

1. Go to `http://localhost:3000/admin`
2. Login with your admin credentials
3. Navigate to Collections → Projects
4. See your 6 sample projects!

---

## Available Commands

### Seed All Data

```bash
npm run seed
```

Seeds projects, pages, and site settings.

### Seed Specific Collections

```bash
# Seed only projects
npm run seed:projects

# Seed only pages
npm run seed:pages

# Seed only settings
npm run seed:settings
```

### Dry Run Mode

Preview what would be created without making changes:

```bash
npm run seed:dry-run
```

Output:

```
🔍 DRY RUN MODE - No changes will be made

📊 Seeding Projects...
   Would create 6 projects
   - DTF Music Platform
   - Stem Splitter Pro
   - PayTrack - Time & Expense Tracker
   ...
```

### Clear Database

**⚠️ WARNING: This deletes ALL data!**

```bash
# Preview what would be deleted
npm run seed:clear

# Actually delete (requires --confirm flag)
npm run seed:clear -- --confirm
```

### Combine Flags

```bash
# Dry run for specific collection
npm run seed:projects -- --dry-run

# Clear and reseed
npm run seed:clear -- --confirm && npm run seed
```

---

## Seed Data

### Projects

**Location**: `src/lib/seed/projects.json`

**Sample Projects**:

1. **DTF Music Platform** (Featured)
   - Music streaming and collaboration
   - Tech: Next.js, Node.js, WebRTC, PostgreSQL
   - 50,000+ users, 2M+ streams

2. **Stem Splitter Pro** (Featured)
   - AI-powered audio separation
   - Tech: Python, PyTorch, Electron, React
   - 100,000+ downloads

3. **PayTrack** (Featured)
   - Time tracking and invoicing
   - Tech: React, Next.js, MongoDB, Stripe
   - 25,000+ users, $10M+ processed

4. **SayVows**
   - Wedding planning CRM
   - Tech: Vue.js, Laravel, MySQL
   - 5,000+ planners, 50,000+ weddings

5. **AI Content Studio**
   - AI content generation
   - Tech: React, Next.js, Python, GPT-4
   - 1M+ pieces generated

6. **FitnessPro**
   - Personal training platform
   - Tech: React Native, Node.js, MongoDB
   - 15,000+ trainers, 200,000+ clients

**Data Structure**:

```json
{
  "title": "Project Name",
  "slug": "project-slug",
  "excerpt": "Short description for cards",
  "description": "Full project description",
  "category": "web-app | desktop-app | mobile-app",
  "status": "published | draft",
  "featured": true | false,
  "technologies": ["Tech1", "Tech2"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/...",
  "metrics": {
    "users": "50,000+",
    "performance": "99.9% uptime",
    "engagement": "High"
  },
  "overview": "Project overview paragraph",
  "challenge": "Problem statement",
  "solution": "How you solved it",
  "features": ["Feature 1", "Feature 2"],
  "results": ["Result 1", "Result 2"],
  "testimonials": [
    {
      "author": "Name",
      "role": "Title",
      "content": "Quote"
    }
  ]
}
```

### Pages

**Location**: `src/lib/seed/pages.json`

**Sample Pages**:

1. **About Page** (`/about`)
   - Personal introduction
   - Technical expertise
   - Work philosophy
   - Beyond code section
   - CTA block

2. **Contact Page** (`/contact`)
   - Contact information
   - Project inquiry guidelines
   - Availability status
   - FAQs
   - Email CTA

**Block Types Used**:
- `hero` - Page header with heading and CTA
- `richText` - HTML content blocks
- `cta` - Call-to-action sections

### Site Settings

**Location**: `src/lib/seed/settings.json`

**Includes**:
- Site name and tagline
- Contact information (email, phone, location)
- Social media links (GitHub, LinkedIn, Twitter, Dribbble)
- SEO defaults (meta title, description, Twitter handle)
- Analytics configuration (disabled by default)

---

## Customization

### Modify Existing Projects

Edit `src/lib/seed/projects.json`:

```json
{
  "title": "Your Project Name",
  "slug": "your-project-slug",
  "excerpt": "Brief description",
  "description": "Full description...",
  "technologies": ["React", "Node.js", "PostgreSQL"],
  ...
}
```

### Add New Projects

Add a new object to the projects array:

```json
[
  {
    "title": "New Project",
    "slug": "new-project",
    "excerpt": "...",
    "description": "...",
    "category": "web-app",
    "status": "published",
    "featured": false,
    "technologies": ["Tech Stack"],
    "liveUrl": "",
    "githubUrl": "",
    "metrics": {},
    "overview": "...",
    "challenge": "...",
    "solution": "...",
    "features": [],
    "results": [],
    "testimonials": []
  },
  ...existing projects
]
```

### Update Pages

Edit `src/lib/seed/pages.json`:

```json
{
  "title": "New Page",
  "slug": "new-page",
  "status": "published",
  "layout": [
    {
      "blockType": "hero",
      "heading": "Page Title",
      "subheading": "Subtitle",
      ...
    },
    {
      "blockType": "richText",
      "content": "<h2>Section</h2><p>Content...</p>"
    }
  ]
}
```

### Change Site Settings

Edit `src/lib/seed/settings.json`:

```json
{
  "siteName": "Your Name",
  "tagline": "Your Tagline",
  "contactInfo": {
    "email": "you@example.com",
    "phone": "+1 (555) 555-5555",
    "location": "Your City"
  },
  "socialLinks": [
    {
      "platform": "github",
      "url": "https://github.com/yourusername",
      "displayText": "GitHub"
    }
  ],
  ...
}
```

---

## Images & Media

### Image Requirements

The seed data references images but doesn't include actual image files. You'll need to upload images manually or add them programmatically.

**Required Images**:

**Project Featured Images** (16:9 ratio, 1600x900px):
- DTF Music Platform
- Stem Splitter Pro
- PayTrack
- SayVows
- AI Content Studio
- FitnessPro

**Site Assets**:
- Logo (200x60px, PNG)
- OG Image (1200x630px, JPEG)
- Favicon (512x512px, PNG)

### Manual Upload

1. Go to `http://localhost:3000/admin/collections/media`
2. Click "Create New Media"
3. Upload each image
4. Note the media ID from the URL
5. Edit project → Add Featured Image → Select uploaded media

### Image Sources

**Free Stock Photos**:
- [Unsplash](https://unsplash.com/)
- [Pexels](https://pexels.com/)
- [Pixabay](https://pixabay.com/)

**Illustrations**:
- [unDraw](https://undraw.co/)
- [Storyset](https://storyset.com/)

**Optimization Tools**:
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [ImageOptim](https://imageoptim.com/)

### Placeholder Images

For development, you can use placeholder services:

- `https://via.placeholder.com/1600x900`
- `https://placehold.co/1600x900`
- `https://picsum.photos/1600/900`

---

## Troubleshooting

### Common Issues

**1. "Collection not found" Error**

**Cause**: Payload collections not properly configured

**Solution**:
```bash
# Generate types
npm run generate:types

# Restart dev server
npm run dev
```

**2. "Duplicate key error" on Slug**

**Cause**: Project with same slug already exists

**Solution**:
```bash
# Option A: Clear database first
npm run seed:clear -- --confirm
npm run seed

# Option B: Change slug in JSON file

# Option C: Delete specific project in admin panel
```

**3. Seeding Hangs or Times Out**

**Cause**: Database connection issues or server not running

**Solution**:
```bash
# Make sure dev server is running
npm run dev

# Check MongoDB connection in .env
MONGODB_URI=mongodb://localhost:27017/portfolio

# Test connection
mongosh mongodb://localhost:27017/portfolio
```

**4. No Output or Silent Failure**

**Cause**: TypeScript compilation errors

**Solution**:
```bash
# Check for syntax errors
npx tsc --noEmit

# Run with verbose logging
tsx src/lib/seed/migrate.ts
```

**5. "Cannot find module" Error**

**Cause**: Missing dependencies or incorrect import paths

**Solution**:
```bash
# Install dependencies
npm install

# Check tsconfig paths
```

---

## Development Workflow

### Recommended Workflow

**1. Initial Setup** (First time):
```bash
npm run seed
```

**2. Reset & Reseed** (Clean slate):
```bash
npm run seed:clear -- --confirm
npm run seed
```

**3. Update Specific Collection**:
```bash
# Made changes to projects.json
npm run seed:projects
```

**4. Preview Changes**:
```bash
# See what would change
npm run seed:dry-run
```

### Iterative Development

When developing new features:

1. **Test with Real Data**: Use seeded projects
2. **Modify as Needed**: Edit JSON files
3. **Reseed**: `npm run seed:projects`
4. **Verify**: Check admin panel and frontend

### Before Committing

```bash
# Verify seed scripts work
npm run seed:dry-run

# Test full seed
npm run seed:clear -- --confirm
npm run seed
```

---

## Advanced Usage

### Programmatic Seeding

Import and use seed functions in your code:

```typescript
import { seedProjects, seedPages, seedSettings } from '@/lib/seed/migrate'

async function customSeed() {
  await seedProjects()
  await seedPages()
  await seedSettings()
}
```

### Custom Seed Scripts

Create `src/lib/seed/custom.ts`:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export async function seedCustomData() {
  const payload = await getPayload({ config })

  // Your custom seeding logic
  const project = await payload.create({
    collection: 'projects',
    data: {
      title: 'Custom Project',
      slug: 'custom-project',
      // ...
    },
  })

  console.log('Created:', project.title)
}
```

Run it:
```bash
tsx src/lib/seed/custom.ts
```

### Conditional Seeding

Seed different data based on environment:

```typescript
const isDevelopment = process.env.NODE_ENV === 'development'
const isStaging = process.env.NODE_ENV === 'staging'

if (isDevelopment) {
  // Seed test data
  await seedProjects()
} else if (isStaging) {
  // Seed demo data
  await seedDemoProjects()
}
```

---

## Production Considerations

### DO NOT Run Seeds in Production

Seeds are for development only. Never run:
- `npm run seed` in production
- `npm run seed:clear` in production

### Production Data Import

For production, use proper data migration:

**Option 1: Manual Entry**
- Enter content via admin panel
- More control and accuracy

**Option 2: Payload Import/Export**
```bash
# Export from staging
payload export --collection projects --output projects.json

# Import to production
payload import --collection projects --input projects.json
```

**Option 3: Database Dump**
```bash
# MongoDB dump
mongodump --uri="mongodb://..." --out=./backup

# MongoDB restore
mongorestore --uri="mongodb://..." ./backup
```

---

## Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Sample Project Data](./src/lib/seed/projects.json)
- [Seeding Best Practices](https://payloadcms.com/docs/admin/overview)

---

Last Updated: 2026-01-21
