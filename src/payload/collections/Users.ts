import { CollectionConfig } from 'payload/types'

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Enable email/password authentication
    tokenExpiration: 7200, // 2 hours
    verify: false, // Set to true if you want email verification
    maxLoginAttempts: 5,
    lockTime: 600 * 1000, // 10 minutes
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
    group: 'Admin',
  },
  access: {
    // Only admins can create new users
    create: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
    // Users can read their own profile, admins can read all
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // Users can update their own profile, admins can update all
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return {
        id: {
          equals: user.id,
        },
      }
    },
    // Only admins can delete users
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => {
          if (!user) return false
          return user.role === 'admin'
        },
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
    },
  ],
  timestamps: true,
}

export default Users
