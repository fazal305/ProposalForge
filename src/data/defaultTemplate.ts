import { generateId } from '@/lib/id'
import { DEFAULT_PROCESS_PHASES } from './defaultProcess'
import { DEFAULT_TERMS, LEGAL_REVIEW_NOTE } from './defaultTerms'
import type { ProposalTheme, TemplateSection } from '@/types'

export const DEFAULT_THEME: ProposalTheme = {
  primaryColor: '#1f4d3d',
  secondaryColor: '#b98a4e',
  fontHeading: 'Source Serif 4',
  fontBody: 'Inter',
  spacing: 'comfortable',
  radius: 'soft',
  headerStyle: 'centered',
  logoUrl: null,
}

function section(
  templateId: string,
  key: string,
  title: string,
  type: 'STATIC' | 'DYNAMIC',
  contentMd: string,
  orderIndex: number,
): TemplateSection {
  return { id: generateId('sec_'), templateId, key, title, type, contentMd, orderIndex, enabled: true }
}

/** Builds the seeded "Software Development Proposal" master template for a new user. */
export function buildDefaultSoftwareTemplate(templateId: string): TemplateSection[] {
  const processMd = DEFAULT_PROCESS_PHASES.map((p) => `**${p.title}**\n${p.contentMd}`).join('\n\n')
  const communication = DEFAULT_TERMS.find((t) => t.key === 'communication_policy')!
  const termsMd = DEFAULT_TERMS.filter((t) => t.key !== 'communication_policy')
    .map((t) => `**${t.title}**\n${t.contentMd}`)
    .join('\n\n')

  return [
    section(templateId, 'cover', 'Cover', 'DYNAMIC', '# Software Development Proposal\n\nPrepared for {{client.company}}\nBy {{developer.name}}\n\nProposal {{proposal.number}} · {{proposal.date}}', 0),
    section(templateId, 'project_overview', 'Project Overview', 'DYNAMIC', '{{project.description}}', 1),
    section(templateId, 'problem_statement', 'The Problem', 'DYNAMIC', '[Describe the problem this project solves for {{client.company}}.]', 2),
    section(templateId, 'proposed_solution', 'Proposed Solution', 'DYNAMIC', '[Describe the proposed solution and approach.]', 3),
    section(templateId, 'scope_of_work', 'Scope of Work', 'DYNAMIC', 'The scope below outlines everything included in this engagement.', 4),
    section(templateId, 'deliverables', 'Deliverables', 'DYNAMIC', 'All items marked as included in the Scope of Work above will be delivered as functioning, tested software.', 5),
    section(templateId, 'timeline_milestones', 'Timeline & Milestones', 'DYNAMIC', 'Estimated project timeline: {{project.timeline}}', 6),
    section(templateId, 'investment_pricing', 'Investment', 'DYNAMIC', 'Total investment for this project: {{proposal.total}} {{proposal.currency}}', 7),
    section(templateId, 'payment_schedule', 'Payment Schedule', 'DYNAMIC', 'Payment is split across the milestones below.', 8),
    section(templateId, 'development_process', 'Development Process', 'STATIC', processMd, 9),
    section(templateId, 'communication', 'Communication', 'STATIC', communication.contentMd, 10),
    section(
      templateId,
      'about_developer',
      'About the Developer',
      'STATIC',
      '**{{developer.name}}**\n[YOUR BIO]\n\nPortfolio: {{developer.website}} · GitHub: {{developer.github}} · LinkedIn: {{developer.linkedin}}',
      11,
    ),
    section(templateId, 'terms_conditions', 'Terms & Conditions', 'STATIC', `${termsMd}\n\n_${LEGAL_REVIEW_NOTE}_`, 12),
  ]
}
