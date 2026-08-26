import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export interface AuthTokenPayload {
  userId: string
  email: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signAuthToken(payload: AuthTokenPayload): string {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured — set it in your environment variables.')
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured — set it in your environment variables.')
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload
  } catch {
    return null
  }
}

export const AUTH_COOKIE_NAME = 'proposalforge_session'
