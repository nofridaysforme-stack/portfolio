# Seed Data

This directory contains seed data and migration utilities for populating the Payload CMS with sample content.

## Files

- `projects.json` - Sample project data (6 projects)
- `pages.json` - Sample pages (About, Contact)
- `settings.json` - Default site settings
- `migrate.ts` - Migration script for seeding the database
- `images/` - Directory for placeholder images (create manually)

## Image Requirements

### Project Images

For best results, place the following images in `src/lib/seed/images/`:

**Featured Images** (16:9 ratio):
- `dtf-music.jpg` - 1600x900px
- `stem-splitter.jpg` - 1600x900px
- `paytrack.jpg` - 1600x900px
- `sayvows.jpg` - 1600x900px
- `ai-content-studio.jpg` - 1600x900px
- `fitnesspro.jpg` - 1600x900px

**Gallery Images** (optional, 4:3 ratio):
- `dtf-music-gallery-1.jpg` - 1200x900px
- `dtf-music-gallery-2.jpg` - 1200x900px
- etc.

**Site Assets**:
- `logo.png` - 200x60px (transparent background)
- `og-image.jpg` - 1200x630px (Open Graph image)
- `favicon.png` - 512x512px

### Image Formats

- **Preferred**: JPEG for photos, PNG for logos/graphics
- **Quality**: 85% compression for web
- **Optimization**: Use tools like TinyPNG or Squoosh before uploading

### Recommended Image Sources

- [Unsplash](https://unsplash.com/) - Free high-quality photos
- [Pexels](https://pexels.com/) - Free stock photos
- [unDraw](https://undraw.co/) - Free illustrations
- [Hero Patterns](https://heropatterns.com/) - Background patterns

## Usage

### Seed All Data

```bash
npm run seed
```

This will seed:
- 6 sample projects
- 2 pages (About, Contact)
- Site settings

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
npm run seed -- --dry-run
```

### Clear Database

**⚠️ WARNING: This deletes ALL data!**

```bash
# Preview what would be deleted
npm run seed:clear

# Actually delete everything (requires confirmation)
npm run seed:clear -- --confirm
```

## Manual Image Upload

After seeding the data:

1. Visit `http://localhost:3000/admin/collections/media`
2. Click "Create New Media"
3. Upload images for each project
4. Note the media IDs
5. Edit projects to link images:
   - Go to Projects collection
   - Edit each project
   - Add Featured Image
   - Add Gallery images (optional)

## Customization

### Modify Seed Data

Edit the JSON files to customize the seed data:

**projects.json**:
- Change project titles, descriptions, technologies
- Update URLs to point to real sites
- Modify categories and metrics

**pages.json**:
- Customize About page content
- Update contact information
- Add new pages

**settings.json**:
- Change site name and tagline
- Update social media links
- Configure SEO defaults
- Add analytics IDs

### Add New Projects

Add a new project object to `projects.json`:

```json
{
  "title": "My New Project",
  "slug": "my-new-project",
  "excerpt": "Short description",
  "description": "Full description...",
  "category": "web-app",
  "status": "published",
  "featured": false,
  "technologies": ["React", "Node.js"],
  "liveUrl": "https://example.com",
  "githubUrl": "",
  "metrics": {
    "users": "1,000+",
    "performance": "Fast",
    "satisfaction": "High"
  },
  "overview": "...",
  "challenge": "...",
  "solution": "...",
  "features": ["Feature 1", "Feature 2"],
  "results": ["Result 1", "Result 2"],
  "testimonials": []
}
```

### Create Custom Seeds

Create your own seed script:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

async function customSeed() {
  const payload = await getPayload({ config })

  // Your custom seeding logic
  await payload.create({
    collection: 'projects',
    data: {
      // Your data
    },
  })
}
```

## Troubleshooting

### "Collection not found"

Make sure Payload is properly configured and the collections exist. Run:

```bash
npm run build:payload
```

### "Duplicate key error"

A document with the same slug already exists. Options:
1. Clear the database first: `npm run seed:clear -- --confirm`
2. Change the slug in the JSON file
3. Delete the existing document via admin panel

### "Permission denied"

Make sure you're authenticated with an admin user in Payload.

### Images not showing

1. Verify images are uploaded to the Media collection
2. Check that projects reference the correct media IDs
3. Ensure Firebase Storage is configured correctly

## Development Workflow

Recommended workflow for development:

1. **Fresh Start**:
   ```bash
   npm run seed:clear -- --confirm  # Clear old data
   npm run seed                      # Seed new data
   ```

2. **Iterative Development**:
   ```bash
   npm run seed:projects  # Update just projects
   ```

3. **Preview Changes**:
   ```bash
   npm run seed -- --dry-run  # See what would change
   ```

## Production Use

**DO NOT** run seed scripts in production! These are for development and demo purposes only.

For production:
1. Enter content manually via admin panel
2. Import/export using Payload's built-in tools
3. Use proper database migrations

## Additional Resources

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Seeding Best Practices](https://payloadcms.com/docs/admin/seeding)
- [MongoDB Import/Export](https://www.mongodb.com/docs/database-tools/)

---

Last Updated: 2026-01-21
