import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'
import { sendError, sendServerError } from '../_lib/errors'

/**
 * AI Quote Assistant — proxies a structured suggestion request to OpenRouter.
 * The API key stays server-side (OPENROUTER_API_KEY); the frontend never sees it.
 * Not wired into the UI in this build (skipped per project scope — see README);
 * this is the architecture the feature would call once enabled with a real key.
 * Every returned item must remain user-editable and is never auto-applied to a proposal.
 */

const requestSchema = z.object({ description: z.string().min(1) })

const responseItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  estimatedPrice: z.number().nonnegative(),
})
const responseSchema = z.object({ items: z.array(responseItemSchema) })

const SYSTEM_PROMPT =
  'You are a software project scoping assistant. Given a plain-language project description, ' +
  'return a JSON object of the shape {"items":[{"name","description","estimatedPrice"}]} ' +
  'breaking the project into billable line items with rough USD price estimates. ' +
  'Return ONLY the JSON object, no other text.'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return sendError(res, 405, 'Method not allowed')

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return sendError(res, 503, 'AI Quote Assistant is not configured. Set OPENROUTER_API_KEY to enable it.')
  }

  const parsed = requestSchema.safeParse(req.body)
  if (!parsed.success) return sendError(res, 400, 'Missing project description')

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-haiku',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: parsed.data.description },
        ],
      }),
    })

    if (!response.ok) return sendError(res, 502, 'AI provider request failed. Please try again.')

    const body = (await response.json()) as { choices?: { message?: { content?: string } }[] }
    const raw = body.choices?.[0]?.message?.content
    if (!raw) return sendError(res, 502, 'AI provider returned an empty response.')

    let json: unknown
    try {
      json = JSON.parse(raw)
    } catch {
      return sendError(res, 502, 'AI provider returned unparseable output.')
    }

    const validated = responseSchema.safeParse(json)
    if (!validated.success) return sendError(res, 502, 'AI provider output did not match the expected format.')

    res.status(200).json(validated.data)
  } catch (error) {
    sendServerError(res, error)
  }
}
