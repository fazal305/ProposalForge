import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { prisma } from '../_lib/db'
import { verifyAuthToken, AUTH_COOKIE_NAME } from '../_lib/auth'
import { sendError, sendServerError } from '../_lib/errors'

/**
 * Reference implementation of the Clients REST endpoint against the Prisma schema.
 * Requires DATABASE_URL — the shipped frontend uses local Zustand storage instead
 * (see README "Known Limitations"); wiring this in is a follow-up, not done here.
 */

const createClientSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

function getUserId(req: VercelRequest): string | null {
  const token = req.cookies?.[AUTH_COOKIE_NAME]
  if (!token) return null
  return verifyAuthToken(token)?.userId ?? null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req)
  if (!userId) return sendError(res, 401, 'Not authenticated')

  try {
    if (req.method === 'GET') {
      const clients = await prisma.client.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
      return res.status(200).json(clients)
    }

    if (req.method === 'POST') {
      const parsed = createClientSchema.safeParse(req.body)
      if (!parsed.success) return sendError(res, 400, parsed.error.issues[0]?.message ?? 'Invalid input')
      const client = await prisma.client.create({ data: { ...parsed.data, userId } })
      return res.status(201).json(client)
    }

    return sendError(res, 405, 'Method not allowed')
  } catch (error) {
    sendServerError(res, error)
  }
}
