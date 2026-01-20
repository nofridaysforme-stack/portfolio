import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth'
import { auth } from './client'

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<UserCredential> {
  return await signInWithEmailAndPassword(auth, email, password)
}

/**
 * Create a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<UserCredential> {
  return await createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Sign out the current user
 */
export async function logOut(): Promise<void> {
  return await signOut(auth)
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
  return auth.currentUser
}
