import { CollectionConfig } from 'payload/types'
import path from 'path'
import {
  uploadToFirebaseWithRetry,
  deleteFromFirebaseWithRetry,
  generateFirebasePath,
  isFirebaseConfigured,
} from '@/lib/firebase/payload-storage-adapter'

const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'],
    group: 'Content',
    description: 'Upload and manage images. Files are stored in Firebase Storage for scalability.',
  },
  access: {
    read: () => true, // Public read access for media
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => {
      if (!user) return false
      return user.role === 'admin'
    },
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'], // Images only as per requirement
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 576,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    disableLocalStorage: false, // Keep local for image processing
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text',
      admin: {
        description: 'Describe the image for accessibility and SEO',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      admin: {
        description: 'Optional caption to display with the image',
      },
    },
    {
      name: 'firebaseUrl',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Firebase Storage public URL',
      },
    },
    {
      name: 'firebasePath',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only upload to Firebase on create or if file changed
        if (operation === 'create' || (operation === 'update' && doc.filename)) {
          // Check if Firebase is configured
          if (!isFirebaseConfigured()) {
            console.warn('Firebase is not configured. Skipping upload to Firebase Storage.')
            return doc
          }

          try {
            const localFilePath = path.join(process.cwd(), 'media', doc.filename)

            // Generate Firebase path
            const firebasePath = generateFirebasePath(doc.filename, 'portfolio-media')

            // Upload to Firebase with retry
            const result = await uploadToFirebaseWithRetry(
              localFilePath,
              firebasePath,
              {
                contentType: doc.mimeType,
                customMetadata: {
                  payloadId: doc.id,
                  alt: doc.alt || '',
                  originalFilename: doc.filename,
                },
              }
            )

            // Update document with Firebase URL and path
            await req.payload.update({
              collection: 'media',
              id: doc.id,
              data: {
                firebaseUrl: result.url,
                firebasePath: firebasePath,
              },
            })

            console.log(`Uploaded ${doc.filename} to Firebase: ${result.url}`)

            // Also upload size variants if they exist
            if (doc.sizes) {
              for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
                if (sizeData && typeof sizeData === 'object' && 'filename' in sizeData) {
                  const sizeFilePath = path.join(process.cwd(), 'media', sizeData.filename)
                  const sizeFirebasePath = generateFirebasePath(sizeData.filename, `portfolio-media/${sizeName}`)

                  await uploadToFirebaseWithRetry(
                    sizeFilePath,
                    sizeFirebasePath,
                    {
                      contentType: doc.mimeType,
                      customMetadata: {
                        payloadId: doc.id,
                        size: sizeName,
                      },
                    }
                  )

                  console.log(`Uploaded ${sizeName} variant to Firebase`)
                }
              }
            }
          } catch (error) {
            console.error('Error uploading to Firebase:', error)
            // Don't fail the upload if Firebase fails - file is still in local storage
          }
        }

        return doc
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Delete from Firebase Storage
        if (!isFirebaseConfigured()) {
          console.warn('Firebase is not configured. Skipping deletion from Firebase Storage.')
          return doc
        }

        try {
          if (doc.firebasePath) {
            await deleteFromFirebaseWithRetry(doc.firebasePath)
            console.log(`Deleted ${doc.firebasePath} from Firebase`)
          }

          // Delete size variants
          if (doc.sizes) {
            for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
              if (sizeData && typeof sizeData === 'object' && 'filename' in sizeData) {
                const sizeFirebasePath = `portfolio-media/${sizeName}/${sizeData.filename}`
                try {
                  await deleteFromFirebaseWithRetry(sizeFirebasePath)
                  console.log(`Deleted ${sizeName} variant from Firebase`)
                } catch (error) {
                  console.warn(`Could not delete ${sizeName} variant:`, error)
                }
              }
            }
          }
        } catch (error) {
          console.error('Error deleting from Firebase:', error)
          // Don't fail if Firebase deletion fails
        }

        return doc
      },
    ],
  },
  timestamps: true,
}

export default Media
