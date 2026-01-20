# Payload Collections

This directory contains all content collection definitions for the portfolio CMS.

## Available Collections

### Users
**Purpose**: User authentication and access management
**Admin Group**: Admin
**Fields**:
- Email (authentication)
- Name
- Role (admin, editor)

**Access Controls**:
- Admins can create/read/update/delete all users
- Users can read and update their own profile

---

### Media
**Purpose**: Image management with Firebase Storage integration
**Admin Group**: Content
**Fields**:
- File upload (images only)
- Alt text (required)
- Caption (optional)
- Firebase URL (auto-generated, read-only)
- Firebase path (auto-generated, hidden)

**Image Sizes**:
- Thumbnail: 400x300px - Admin thumbnails
- Card: 768x576px - Project cards
- Feature: 1920x1080px - Hero images

**Firebase Integration**:
- ✅ Automatic upload to Firebase Storage after local processing
- ✅ All image variants uploaded to Firebase CDN
- ✅ Automatic cleanup on deletion
- ✅ Retry logic with exponential backoff (3 attempts)
- ✅ Graceful fallback if Firebase not configured
- ✅ Public CDN URLs for fast global delivery

**Access Controls**:
- Public read access
- Authenticated users can upload/update
- Only admins can delete

**Hooks**:
- `afterChange`: Uploads image and all variants to Firebase Storage
- `afterDelete`: Removes image and all variants from Firebase Storage

**How It Works**:
1. User uploads image via admin panel
2. Payload processes locally and creates size variants
3. Hook uploads original + all variants to Firebase Storage
4. Document updated with Firebase public URL
5. Images served from Firebase CDN globally

---

### Projects
**Purpose**: Portfolio project showcase and case studies
**Admin Group**: Portfolio
**Fields**:

#### Basic Info
- **title** (text, required) - Project name
- **slug** (text, required, unique) - URL-friendly identifier (auto-generated)
- **summary** (textarea, required, 200 char max) - Brief description for cards
- **category** (select, required) - Project type:
  - Web Application
  - Mobile App
  - Design System
  - Music Production
  - AI/ML
  - Client Work
- **featured** (checkbox) - Show in homepage featured section
- **status** (select) - Draft or Published

#### Media
- **featuredImage** (upload, required) - Main project image
- **gallery** (array) - Additional project screenshots/images
  - Each with optional caption

#### Content
- **content** (rich text, required) - Full case study and project details
- **techStack** (array, required) - Technologies used
- **links** (group) - Project URLs:
  - Live URL
  - GitHub URL
  - External Case Study URL
- **metrics** (array) - Key project results
  - Label/value pairs (e.g., "Performance Improvement" / "50% faster")

#### Admin
- **displayOrder** (number) - Manual sorting (lower numbers first)

**Features**:
- ✅ Auto-generated slugs from title
- ✅ URL validation for all link fields
- ✅ Automatic timestamp tracking
- ✅ Rich text editor for detailed content
- ✅ Multiple image support with captions

**Access Controls**:
- Public can read published projects only
- Authenticated users can create/update/delete all projects
- Drafts are hidden from public

**Hooks**:
- `beforeValidate`: Auto-generate slug from title if not provided
- `beforeChange`: Update timestamp on every save

**Admin UI**:
- Default columns: title, category, featured, status, updatedAt
- Searchable fields: title, summary, category
- Status field in sidebar for easy access

---

## Adding New Collections

To add a new collection:

1. Create a new file in this directory (e.g., `Blog.ts`)
2. Define the collection configuration following the pattern above
3. Import it in `src/payload/payload.config.ts`
4. Add it to the `collections` array
5. Run `npm run generate:types` to update TypeScript types

## Field Types Reference

Common field types used in collections:

- `text` - Single line text input
- `textarea` - Multi-line text input
- `richText` - WYSIWYG editor
- `select` - Dropdown selection
- `checkbox` - Boolean toggle
- `number` - Numeric input
- `date` - Date picker
- `upload` - File/image upload with media relationship
- `array` - Repeatable field groups
- `group` - Grouped fields
- `relationship` - Reference to another collection

## Access Control Patterns

### Public Read, Auth Write
```typescript
access: {
  read: () => true,
  create: ({ req: { user } }) => !!user,
  update: ({ req: { user } }) => !!user,
  delete: ({ req: { user } }) => !!user,
}
```

### Conditional Read (e.g., published only)
```typescript
access: {
  read: ({ req: { user } }) => {
    if (user) return true
    return { status: { equals: 'published' } }
  },
}
```

### Admin Only
```typescript
access: {
  read: ({ req: { user } }) => user?.role === 'admin',
  create: ({ req: { user } }) => user?.role === 'admin',
  update: ({ req: { user } }) => user?.role === 'admin',
  delete: ({ req: { user } }) => user?.role === 'admin',
}
```

## Validation Examples

### URL Validation
```typescript
validate: (value) => {
  if (!value) return true
  try {
    new URL(value)
    return true
  } catch {
    return 'Please enter a valid URL'
  }
}
```

### Email Validation
```typescript
validate: (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Please enter a valid email'
}
```

## Hooks Examples

### Auto-generate Slug
```typescript
hooks: {
  beforeValidate: [
    ({ value, data }) => {
      if (!value && data?.title) {
        return slugify(data.title)
      }
      return value
    },
  ],
}
```

### Set Timestamp
```typescript
hooks: {
  beforeChange: [
    ({ data }) => {
      data.updatedAt = new Date().toISOString()
      return data
    },
  ],
}
```
