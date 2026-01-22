/**
 * Firebase Storage Adapter for Payload CMS
 *
 * This adapter integrates Firebase Storage with Payload CMS for media uploads.
 * Files are uploaded to Firebase Storage and URLs are stored in the database.
 */

import type { CollectionConfig } from 'payload/types'

/**
 * Firebase Storage Adapter for Payload CMS
 *
 * Note: For now, this uses local file storage as a fallback.
 * Firebase Storage integration requires @google-cloud/storage package.
 *
 * To enable Firebase Storage:
 * 1. Install: npm install @google-cloud/storage
 * 2. Ensure Firebase Admin credentials are configured in .env
 * 3. Update this adapter to use Firebase Storage methods
 */
export const firebaseStorageAdapter = {
  /**
   * Upload file to storage
   */
  async uploadFile(file: any) {
    // TODO: Implement Firebase Storage upload
    // For now, return a placeholder response
    return {
      filename: file.filename,
      mimeType: file.mimeType,
      filesize: file.filesize,
    }
  },

  /**
   * Delete file from storage
   */
  async deleteFile(filename: string) {
    // TODO: Implement Firebase Storage delete
    return true
  },

  /**
   * Get file URL
   */
  getFileURL(filename: string): string {
    // For local development, return local URL
    if (process.env.NODE_ENV === 'development') {
      return `${process.env.NEXT_PUBLIC_APP_URL}/media/${filename}`
    }

    // For production, return Firebase Storage URL
    const bucket = process.env.FIREBASE_STORAGE_BUCKET
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(filename)}?alt=media`
  },
}

/**
 * Storage configuration for Payload collections
 */
export const storageConfig = {
  disableLocalStorage: false, // Keep local storage enabled for now

  // Firebase Storage configuration (optional)
  firebase: {
    bucket: process.env.FIREBASE_STORAGE_BUCKET,
    enabled: false, // Set to true when Firebase is fully configured
  },
}

export default firebaseStorageAdapter
