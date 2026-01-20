import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Seed script to create the first admin user
 * Run with: npm run seed
 */
async function seed() {
  console.log('🌱 Starting seed process...')

  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    console.log('📦 Connected to Payload CMS')

    // Check if any users exist
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.totalDocs > 0) {
      console.log('⚠️  Users already exist. Skipping seed.')
      console.log(`   Found ${existingUsers.totalDocs} user(s) in the database.`)
      process.exit(0)
    }

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    const adminName = process.env.ADMIN_NAME || 'Jana Admin'

    console.log('👤 Creating admin user...')
    console.log(`   Email: ${adminEmail}`)

    const adminUser = await payload.create({
      collection: 'users',
      data: {
        email: adminEmail,
        password: adminPassword,
        name: adminName,
        role: 'admin',
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   ID: ${adminUser.id}`)
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Name: ${adminUser.name}`)
    console.log(`   Role: ${adminUser.role}`)
    console.log('')
    console.log('🎉 Seed completed successfully!')
    console.log('')
    console.log('📝 You can now login at: http://localhost:3000/admin')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('')
    console.log('⚠️  Remember to change the password after your first login!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error during seed:', error)
    process.exit(1)
  }
}

seed()
