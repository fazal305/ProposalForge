import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/FormField'
import { useProposalsStore } from '@/stores/proposalsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useClientsStore } from '@/stores/clientsStore'
import { formatCurrency } from '@/lib/pricing'
import type { ProposalStatus } from '@/types'

const ALL_STATUSES: ProposalStatus[] = ['DRAFT', 'SENT', 'VIEWED', 'CHANGES_REQUESTED', 'APPROVED', 'REJECTED', 'EXPIRED', 'ARCHIVED']

export function ProposalsPage() {
  const proposals = useProposalsStore((s) => s.proposals)
  const projects = useProjectsStore((s) => s.projects)
  const clients = useClientsStore((s) => s.clients)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'ALL'>('ALL')

  const enriched = useMemo(
    () =>
      proposals.map((p) => {
        const project = projects.find((pr) => pr.id === p.projectId)
        const client = clients.find((c) => c.id === project?.clientId)
        return { proposal: p, projectName: project?.name ?? '', clientName: client?.company || client?.name || '' }
      }),
    [proposals, projects, clients],
  )

  const filtered = enriched.filter(({ proposal, projectName, clientName }) => {
    const matchesStatus = statusFilter === 'ALL' || proposal.status === statusFilter
    const q = query.trim().toLowerCase()
    const matchesQuery =
      q.length === 0 ||
      proposal.number.toLowerCase().includes(q) ||
      projectName.toLowerCase().includes(q) ||
      clientName.toLowerCase().includes(q)
    return matchesStatus && matchesQuery
  })

  return (
    <div>
      <PageHeader
        title="Proposals"
        description="Every proposal you've drafted, sent, or closed."
        actions={
          <Link to="/proposals/new">
            <Button variant="primary">New Proposal</Button>
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by number, client, or project…"
          aria-label="Search proposals"
          className="sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | 'ALL')}
          aria-label="Filter by status"
          className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
        >
          <option value="ALL">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="No proposals match" description="Try a different search or filter." />
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-[var(--color-border)]">
            {filtered.map(({ proposal, projectName, clientName }) => (
              <li key={proposal.id}>
                <Link
                  to={`/proposals/${proposal.id}/edit`}
                  className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                >
                  <div className="min-w-0">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
                      {proposal.number} · {projectName}
                    </p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">{clientName}</p>
                  </div>
                  <div className="flex items-center gap-[var(--spacing-md)] shrink-0">
                    <span className="text-[var(--text-sm)] text-[var(--color-text)]">{formatCurrency(proposal.total, proposal.currency)}</span>
                    <StatusBadge status={proposal.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
