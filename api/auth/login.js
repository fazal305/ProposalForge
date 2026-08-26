import { z } from 'zod'
import { prisma } from '../_lib/db.js'
import { signAuthToken, verifyPassword, AUTH_COOKIE_NAME } from '../_lib/auth.js'
import { sendError, sendServerError } from '../_lib/errors.js'

/**
 * Single-user (ADMIN/OWNER) login. ProposalForge is a solo freelancer's workspace, not
 * a multi-tenant product, so there is no signup/roles system beyond this one account.
 */

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
export default async function handler(req, res) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) return sendError(res, 400, 'Email and password are required')
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    })
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return sendError(res, 401, 'Invalid email or password')
    }
    const token = signAuthToken({
      userId: user.id,
      email: user.email,
    })
    res.setHeader(
      'Set-Cookie',
      `${AUTH_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`,
    )
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    sendServerError(res, error)
  }
}
