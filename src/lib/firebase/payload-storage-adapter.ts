import { adminStorage } from './admin'
import path from 'path'
import fs from 'fs'

export interface FirebaseUploadResult {
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
}

/**
 * Upload a file to Firebase Storage from server (using Admin SDK)
 * @param file - Buffer or file path to upload
 * @param destinationPath - Path in Firebase Storage
 * @param metadata - Optional metadata for the file
 * @returns Public URL and file metadata
 */
export async function uploadToFirebase(
  file: Buffer | string,
  destinationPath: string,
  metadata?: {
    contentType?: string
    customMetadata?: Record<string, string>
  }
): Promise<FirebaseUploadResult> {
  const bucket = adminStorage().bucket()
  const fileRef = bucket.file(destinationPath)

  try {
    // Upload the file
    let fileBuffer: Buffer

    if (typeof file === 'string') {
      // If file is a path, read it
      fileBuffer = await fs.promises.readFile(file)
    } else {
      fileBuffer = file
    }

    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: metadata?.contentType,
        metadata: metadata?.customMetadata,
      },
      public: true, // Make file publicly accessible
      resumable: false, // Faster for smaller files
    })

    // Make the file public
    await fileRef.makePublic()

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destinationPath}`

    // Get file metadata
    const [fileMetadata] = await fileRef.getMetadata()

    return {
      url: publicUrl,
      filename: path.basename(destinationPath),
      mimeType: fileMetadata.contentType || 'application/octet-stream',
      filesize: parseInt(fileMetadata.size || '0', 10),
    }
  } catch (error) {
    console.error('Error uploading to Firebase:', error)
    throw new Error(`Failed to upload file to Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Upload with retry logic
 * @param file - Buffer or file path
 * @param destinationPath - Path in Firebase
 * @param metadata - File metadata
 * @param maxRetries - Maximum retry attempts
 * @returns Upload result
 */
export async function uploadToFirebaseWithRetry(
  file: Buffer | string,
  destinationPath: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> },
  maxRetries: number = 3
): Promise<FirebaseUploadResult> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToFirebase(file, destinationPath, metadata)
    } catch (error) {
      lastError = error as Error
      console.warn(`Upload attempt ${attempt} failed:`, error)

      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(
    `Failed to upload after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
  )
}

/**
 * Delete a file from Firebase Storage
 * @param filePath - Path to the file in Firebase Storage
 */
export async function deleteFromFirebase(filePath: string): Promise<void> {
  const bucket = adminStorage().bucket()
  const fileRef = bucket.file(filePath)

  try {
    const [exists] = await fileRef.exists()

    if (exists) {
      await fileRef.delete()
      console.log(`Deleted file from Firebase: ${filePath}`)
    } else {
      console.warn(`File not found in Firebase: ${filePath}`)
    }
  } catch (error) {
    console.error('Error deleting from Firebase:', error)
    throw new Error(`Failed to delete file from Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete with retry logic
 * @param filePath - Path to file
 * @param maxRetries - Maximum retry attempts
 */
export async function deleteFromFirebaseWithRetry(
  filePath: string,
  maxRetries: number = 3
): Promise<void> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await deleteFromFirebase(filePath)
      return
    } catch (error) {
      lastError = error as Error
      console.warn(`Delete attempt ${attempt} failed:`, error)

      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(
    `Failed to delete after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`
  )
}

/**
 * Get public URL for a file in Firebase Storage
 * @param filePath - Path to the file
 * @returns Public URL
 */
export function getPublicUrl(filePath: string): string {
  const bucket = adminStorage().bucket()
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`
}

/**
 * Generate a unique file path for Firebase Storage
 * @param originalFilename - Original filename
 * @param folder - Folder to store in (default: 'media')
 * @returns Unique path
 */
export function generateFirebasePath(
  originalFilename: string,
  folder: string = 'media'
): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = path.extname(originalFilename)
  const nameWithoutExt = path.basename(originalFilename, extension)
  const sanitized = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()

  return `${folder}/${timestamp}-${randomString}-${sanitized}${extension}`
}

/**
 * Check if Firebase is properly configured
 * @returns True if configured, false otherwise
 */
export function isFirebaseConfigured(): boolean {
  return !!(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
    process.env.FIREBASE_STORAGE_BUCKET
  )
}
