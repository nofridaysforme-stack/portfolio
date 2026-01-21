import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth'
import { auth } from './client'

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @param rememberMe - Whether to persist session
 */
export async function signIn(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<UserCredential> {
  // Set persistence based on rememberMe
  await setPersistence(
    auth,
    rememberMe ? browserLocalPersistence : browserSessionPersistence
  )

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

/**
 * Get current user's ID token
 * @param forceRefresh - Force token refresh
 */
export async function getIdToken(forceRefresh: boolean = false): Promise<string | null> {
  const user = getCurrentUser()
  if (!user) return null

  return user.getIdToken(forceRefresh)
}

/**
 * Send password reset email
 * @param email - User email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email)
}

/**
 * Send email verification to current user
 */
export async function sendVerificationEmail(): Promise<void> {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('No user is currently signed in')
  }

  return sendEmailVerification(user)
}

/**
 * Update user profile
 * @param displayName - User display name
 * @param photoURL - User photo URL
 */
export async function updateUserProfile(
  displayName?: string,
  photoURL?: string
): Promise<void> {
  const user = getCurrentUser()
  if (!user) {
    throw new Error('No user is currently signed in')
  }

  return updateProfile(user, { displayName, photoURL })
}

/**
 * Check if user's email is verified
 */
export function isEmailVerified(): boolean {
  const user = getCurrentUser()
  return user?.emailVerified ?? false
}

/**
 * Exchange Firebase ID token for Payload session
 * Creates or updates Payload user and returns session token
 * @param idToken - Firebase ID token
 */
export async function exchangeFirebaseTokenForPayloadSession(
  idToken: string
): Promise<{ token: string; user: any }> {
  const response = await fetch('/api/auth/firebase-exchange', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to exchange token')
  }

  return response.json()
}

/**
 * Verify user session with Payload
 */
export async function verifyPayloadSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify', {
      credentials: 'include',
    })
    return response.ok
  } catch (error) {
    return false
  }
}

/**
 * Login to Payload admin with Firebase credentials
 * Combines Firebase auth with Payload session creation
 */
export async function loginToAdmin(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<{ user: any; token: string }> {
  // Step 1: Authenticate with Firebase
  const userCredential = await signIn(email, password, rememberMe)

  // Step 2: Get Firebase ID token
  const idToken = await userCredential.user.getIdToken()

  // Step 3: Exchange for Payload session
  const { token, user } = await exchangeFirebaseTokenForPayloadSession(idToken)

  return { user, token }
}

/**
 * Logout from admin panel
 */
export async function logoutFromAdmin(): Promise<void> {
  // Sign out from Firebase
  await logOut()

  // Clear Payload session
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })
}

/**
 * Auth error messages mapper
 */
export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid email or password.',
  }

  return errorMessages[errorCode] || 'An error occurred. Please try again.'
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Export types
export type { User, UserCredential }
