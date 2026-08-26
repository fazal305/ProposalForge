import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET
export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}
export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash)
}
export function signAuthToken(payload) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured — set it in your environment variables.')
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '30d',
  })
}
export function verifyAuthToken(token) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured — set it in your environment variables.')
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}
export const AUTH_COOKIE_NAME = 'proposalforge_session'
