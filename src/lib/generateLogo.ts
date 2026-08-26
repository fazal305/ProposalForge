/** Generates a simple original "initials mark" SVG logo as a data URL — no external assets. */
export function generateInitialsLogo(name: string, primaryColor: string, secondaryColor: string): string {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${primaryColor}" />
        <stop offset="1" stop-color="${secondaryColor}" />
      </linearGradient>
    </defs>
    <rect width="160" height="160" rx="28" fill="url(#g)" />
    <text x="80" y="98" font-family="Georgia, 'Source Serif 4', serif" font-size="64" font-weight="600" fill="white" text-anchor="middle">${initials}</text>
  </svg>`

  return `data:image/svg+xml;base64,${btoa(svg)}`
}
