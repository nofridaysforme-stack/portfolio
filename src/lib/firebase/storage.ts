import { ref, uploadBytes, getDownloadURL, deleteObject, UploadResult } from 'firebase/storage'
import { storage } from './client'

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The path where the file should be stored
 * @returns The download URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path)
  const snapshot: UploadResult = await uploadBytes(storageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  return downloadURL
}

/**
 * Delete a file from Firebase Storage
 * @param path - The path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path)
  await deleteObject(storageRef)
}

/**
 * Get the download URL for a file
 * @param path - The path of the file
 * @returns The download URL
 */
export async function getFileURL(path: string): Promise<string> {
  const storageRef = ref(storage, path)
  return await getDownloadURL(storageRef)
}

/**
 * Generate a unique file path
 * @param fileName - The original file name
 * @param folder - The folder to store the file in
 * @returns A unique file path
 */
export function generateFilePath(fileName: string, folder: string = 'uploads'): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = fileName.split('.').pop()
  return `${folder}/${timestamp}-${randomString}.${extension}`
}
