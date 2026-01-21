import { getPayload } from 'payload'
import config from '@payload-config'
import { promises as fs } from 'fs'
import path from 'path'

// Import seed data
import projectsData from './projects.json'
import pagesData from './pages.json'
import settingsData from './settings.json'

/**
 * Seed Projects
 */
async function seedProjects(dryRun: boolean = false) {
  console.log('\n📊 Seeding Projects...')

  if (dryRun) {
    console.log(`   Would create ${projectsData.length} projects`)
    projectsData.forEach((project) => {
      console.log(`   - ${project.title}`)
    })
    return
  }

  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0

  for (const projectData of projectsData) {
    try {
      // Check if project already exists
      const existing = await payload.find({
        collection: 'projects',
        where: {
          slug: {
            equals: projectData.slug,
          },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`   ⏭️  Skipped: ${projectData.title} (already exists)`)
        skipped++
        continue
      }

      // Create project
      await payload.create({
        collection: 'projects',
        data: projectData as any,
      })

      console.log(`   ✅ Created: ${projectData.title}`)
      created++
    } catch (error: any) {
      console.error(`   ❌ Error creating ${projectData.title}:`, error.message)
    }
  }

  console.log(`\n   Summary: ${created} created, ${skipped} skipped`)
}

/**
 * Seed Pages
 */
async function seedPages(dryRun: boolean = false) {
  console.log('\n📄 Seeding Pages...')

  if (dryRun) {
    console.log(`   Would create ${pagesData.length} pages`)
    pagesData.forEach((page) => {
      console.log(`   - ${page.title}`)
    })
    return
  }

  const payload = await getPayload({ config })

  let created = 0
  let skipped = 0

  for (const pageData of pagesData) {
    try {
      // Check if page already exists
      const existing = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: pageData.slug,
          },
        },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`   ⏭️  Skipped: ${pageData.title} (already exists)`)
        skipped++
        continue
      }

      // Create page
      await payload.create({
        collection: 'pages',
        data: pageData as any,
      })

      console.log(`   ✅ Created: ${pageData.title}`)
      created++
    } catch (error: any) {
      console.error(`   ❌ Error creating ${pageData.title}:`, error.message)
    }
  }

  console.log(`\n   Summary: ${created} created, ${skipped} skipped`)
}

/**
 * Seed Site Settings
 */
async function seedSettings(dryRun: boolean = false) {
  console.log('\n⚙️  Seeding Site Settings...')

  if (dryRun) {
    console.log('   Would update site settings')
    console.log(`   - Site Name: ${settingsData.siteName}`)
    console.log(`   - Tagline: ${settingsData.tagline}`)
    return
  }

  const payload = await getPayload({ config })

  try {
    // Site settings is a global, so we update it
    await payload.updateGlobal({
      slug: 'site-settings',
      data: settingsData as any,
    })

    console.log('   ✅ Settings updated successfully')
  } catch (error: any) {
    console.error('   ❌ Error updating settings:', error.message)
  }
}

/**
 * Clear all data (use with caution!)
 */
async function clearAll(confirm: boolean = false) {
  if (!confirm) {
    console.log('\n⚠️  WARNING: This will delete ALL data from the database!')
    console.log('   Run with --confirm flag to proceed')
    console.log('   Example: npm run seed:clear -- --confirm')
    return
  }

  console.log('\n🗑️  Clearing all data...')

  const payload = await getPayload({ config })

  // Clear projects
  try {
    const projects = await payload.find({
      collection: 'projects',
      limit: 1000,
    })

    for (const project of projects.docs) {
      await payload.delete({
        collection: 'projects',
        id: project.id,
      })
    }

    console.log(`   ✅ Deleted ${projects.docs.length} projects`)
  } catch (error: any) {
    console.error('   ❌ Error deleting projects:', error.message)
  }

  // Clear pages
  try {
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
    })

    for (const page of pages.docs) {
      await payload.delete({
        collection: 'pages',
        id: page.id,
      })
    }

    console.log(`   ✅ Deleted ${pages.docs.length} pages`)
  } catch (error: any) {
    console.error('   ❌ Error deleting pages:', error.message)
  }

  // Clear media
  try {
    const media = await payload.find({
      collection: 'media',
      limit: 1000,
    })

    for (const file of media.docs) {
      await payload.delete({
        collection: 'media',
        id: file.id,
      })
    }

    console.log(`   ✅ Deleted ${media.docs.length} media files`)
  } catch (error: any) {
    console.error('   ❌ Error deleting media:', error.message)
  }

  console.log('\n   🎉 Database cleared!')
}

/**
 * Seed Media (placeholder images)
 */
async function seedMedia(dryRun: boolean = false) {
  console.log('\n🖼️  Seeding Media...')

  if (dryRun) {
    console.log('   Would upload placeholder images')
    console.log('   Note: Actual images must be placed in src/lib/seed/images/')
    return
  }

  console.log('   ℹ️  Media seeding requires actual image files')
  console.log('   Place images in: src/lib/seed/images/')
  console.log('   Then upload via Payload admin panel')
}

/**
 * Main seed function
 */
async function seed() {
  console.log('🌱 Starting database seed...\n')

  // Parse command line arguments
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const projectsOnly = args.includes('--projects')
  const pagesOnly = args.includes('--pages')
  const settingsOnly = args.includes('--settings')
  const clearFlag = args.includes('--clear')
  const confirmFlag = args.includes('--confirm')

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n')
  }

  try {
    // Clear data if requested
    if (clearFlag) {
      await clearAll(confirmFlag)
      return
    }

    // Seed specific collections or all
    if (projectsOnly) {
      await seedProjects(dryRun)
    } else if (pagesOnly) {
      await seedPages(dryRun)
    } else if (settingsOnly) {
      await seedSettings(dryRun)
    } else {
      // Seed everything
      await seedProjects(dryRun)
      await seedPages(dryRun)
      await seedSettings(dryRun)
      await seedMedia(dryRun)
    }

    console.log('\n✨ Seeding complete!\n')

    if (!dryRun) {
      console.log('📝 Next steps:')
      console.log('   1. Visit http://localhost:3000/admin')
      console.log('   2. Login with your credentials')
      console.log('   3. View your seeded content')
      console.log('   4. Upload images via the Media collection\n')
    }
  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  }

  process.exit(0)
}

// Run seed if called directly
if (require.main === module) {
  seed()
}

export { seed, seedProjects, seedPages, seedSettings, seedMedia, clearAll }
