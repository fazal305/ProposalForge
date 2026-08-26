import { PROPOSAL_STATUS_LABEL, type ProposalStatus } from '@/types'

const DOT_COLOR: Record<ProposalStatus, string> = {
  DRAFT: 'var(--status-draft)',
  SENT: 'var(--status-sent)',
  VIEWED: 'var(--status-viewed)',
  CHANGES_REQUESTED: 'var(--status-changes)',
  APPROVED: 'var(--status-approved)',
  REJECTED: 'var(--status-rejected)',
  EXPIRED: 'var(--status-expired)',
  ARCHIVED: 'var(--status-archived)',
}

export function StatusBadge({ status }: { status: ProposalStatus }) {
  return (
    <span
      className="inline-flex items-center gap-[var(--spacing-2xs)] rounded-[var(--radius-full)] border px-[var(--spacing-sm)] py-[var(--spacing-3xs)] text-[var(--text-xs)] font-medium"
      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: DOT_COLOR[status] }} aria-hidden />
      {PROPOSAL_STATUS_LABEL[status]}
    </span>
  )
}
