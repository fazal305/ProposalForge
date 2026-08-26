/**
 * The {{namespace.field}} variable system used across template sections and rendered
 * proposal content. `resolveVariables` is pure and framework-agnostic so it can run
 * identically in the browser preview and in the PDF renderer.
 */

export interface VariableContext {
  client: {
    name: string
    company?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
  }
  project: {
    name: string
    description?: string | null
    category?: string | null
    timeline?: string | null
  }
  developer: {
    name: string
    email: string
    phone?: string | null
    website?: string | null
    github?: string | null
    linkedin?: string | null
  }
  proposal: {
    number: string
    date: string
    validUntil?: string | null
    currency: string
    subtotal: string
    discount: string
    tax: string
    total: string
  }
}

export interface VariableGroup {
  groupLabel: string
  variables: { key: string; label: string }[]
}

export const VARIABLE_PICKER: VariableGroup[] = [
  {
    groupLabel: 'Client',
    variables: [
      { key: 'client.name', label: 'Client Name' },
      { key: 'client.company', label: 'Company' },
      { key: 'client.email', label: 'Client Email' },
      { key: 'client.phone', label: 'Client Phone' },
      { key: 'client.address', label: 'Client Address' },
    ],
  },
  {
    groupLabel: 'Project',
    variables: [
      { key: 'project.name', label: 'Project Name' },
      { key: 'project.description', label: 'Project Description' },
      { key: 'project.category', label: 'Project Category' },
      { key: 'project.timeline', label: 'Estimated Timeline' },
    ],
  },
  {
    groupLabel: 'Developer',
    variables: [
      { key: 'developer.name', label: 'Your Name' },
      { key: 'developer.email', label: 'Your Email' },
      { key: 'developer.phone', label: 'Your Phone' },
      { key: 'developer.website', label: 'Your Website' },
      { key: 'developer.github', label: 'Your GitHub' },
      { key: 'developer.linkedin', label: 'Your LinkedIn' },
    ],
  },
  {
    groupLabel: 'Proposal',
    variables: [
      { key: 'proposal.number', label: 'Proposal Number' },
      { key: 'proposal.date', label: 'Proposal Date' },
      { key: 'proposal.validUntil', label: 'Valid Until' },
      { key: 'proposal.subtotal', label: 'Subtotal' },
      { key: 'proposal.discount', label: 'Discount' },
      { key: 'proposal.tax', label: 'Tax' },
      { key: 'proposal.total', label: 'Total Price' },
    ],
  },
]

const VARIABLE_PATTERN = /\{\{\s*([\w]+)\.([\w]+)\s*\}\}/g

function getField(context: VariableContext, namespace: string, field: string): string {
  const group = (context as unknown as Record<string, Record<string, unknown>>)[namespace]
  const value = group?.[field]
  if (value === undefined || value === null || value === '') return `[${namespace}.${field}]`
  return String(value)
}

/** Replaces every {{namespace.field}} occurrence in `content` with a value from `context`. */
export function resolveVariables(content: string, context: VariableContext): string {
  return content.replace(VARIABLE_PATTERN, (_match, namespace: string, field: string) =>
    getField(context, namespace, field),
  )
}

/** Returns the set of variable keys ("client.name", ...) referenced in `content`. */
export function extractVariables(content: string): string[] {
  const found = new Set<string>()
  for (const match of content.matchAll(VARIABLE_PATTERN)) {
    found.add(`${match[1]}.${match[2]}`)
  }
  return [...found]
}
