/** Generates a URL-safe local id for offline-created records (mirrors cuid shape loosely). */
export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).slice(2, 10)
  const time = Date.now().toString(36)
  return `${prefix}${time}${random}`
}

/** Generates a public share token — never expose the internal record id in a public URL. */
export function generatePublicToken(): string {
  return generateId('pt_')
}
