import type { VercelResponse } from '@vercel/node'

export function sendError(res: VercelResponse, status: number, message: string) {
  res.status(status).json({ error: message })
}

export function sendServerError(res: VercelResponse, error: unknown) {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
}
