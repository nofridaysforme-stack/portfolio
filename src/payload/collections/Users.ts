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
    {
      name: 'firebaseUid',
      type: 'text',
      label: 'Firebase UID',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Firebase user ID - automatically set on login',
      },
      access: {
        // Only system can update Firebase UID
        update: () => false,
      },
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      label: 'Email Verified',
      defaultValue: false,
      admin: {
        readOnly: true,
        description: 'Firebase email verification status',
      },
      access: {
        // Only system can update email verification
        update: () => false,
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Last Login',
      admin: {
        readOnly: true,
        description: 'Last login timestamp',
        date: {
          displayFormat: 'MMM dd, yyyy h:mm a',
        },
      },
      access: {
        // Only system can update last login
        update: () => false,
      },
    },
  ],
  timestamps: true,
}

export default Users
