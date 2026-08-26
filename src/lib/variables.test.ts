import { describe, expect, it } from 'vitest'
import { extractVariables, resolveVariables, type VariableContext } from './variables'

const context: VariableContext = {
  client: { name: 'Jordan Blake', company: 'Demo Construction Ltd.' },
  project: { name: 'Company Website Rebuild' },
  developer: { name: 'Fazal Abbas', email: 'fazalabbas2002@gmail.com' },
  proposal: {
    number: 'Q-1000',
    date: 'August 26, 2026',
    currency: 'USD',
    subtotal: '$8,000.00',
    discount: '$0.00',
    tax: '$0.00',
    total: '$8,000.00',
  },
}

describe('resolveVariables', () => {
  it('replaces known variables with their values', () => {
    expect(resolveVariables('Hi {{client.name}}, total is {{proposal.total}}.', context)).toBe(
      'Hi Jordan Blake, total is $8,000.00.',
    )
  })
  it('falls back to a bracketed placeholder for missing values', () => {
    expect(resolveVariables('{{client.address}}', context)).toBe('[client.address]')
  })
  it('leaves plain text untouched', () => {
    expect(resolveVariables('No variables here.', context)).toBe('No variables here.')
  })
})

describe('extractVariables', () => {
  it('finds every unique variable referenced', () => {
    expect(extractVariables('{{client.name}} and {{client.name}} and {{project.name}}')).toEqual([
      'client.name',
      'project.name',
    ])
  })
  it('returns an empty array when none are present', () => {
    expect(extractVariables('plain text')).toEqual([])
  })
})
