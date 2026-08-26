import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { StatusBadge } from '@/components/StatusBadge'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useClientsStore } from '@/stores/clientsStore'
import { formatCurrency } from '@/lib/pricing'
const PIPELINE_STATUSES = ['DRAFT', 'SENT', 'VIEWED', 'APPROVED', 'REJECTED']
export function DashboardPage() {
  const proposals = useProposalsStore((s) => s.proposals)
  const projects = useProjectsStore((s) => s.projects)
  const clients = useClientsStore((s) => s.clients)
  const counts = PIPELINE_STATUSES.reduce((acc, status) => {
    acc[status] = proposals.filter((p) => p.status === status).length
    return acc
  }, {})
  const revenuePipeline = proposals
    .filter((p) => ['SENT', 'VIEWED'].includes(p.status))
    .reduce((sum, p) => sum + p.total, 0)
  const currency = proposals[0]?.currency ?? 'USD'
  const recent = [...proposals].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6)
  const clientName = (projectId) => {
    const project = projects.find((p) => p.id === projectId)
    const client = clients.find((c) => c.id === project?.clientId)
    return client?.company || client?.name || 'Unknown client'
  }
  const projectName = (projectId) => projects.find((p) => p.id === projectId)?.name ?? 'Untitled project'
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your proposal pipeline at a glance."
        actions={
          <Link to="/proposals/new">
            <Button variant="primary">New Proposal</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[var(--spacing-sm)] mb-[var(--spacing-xl)]">
        {PIPELINE_STATUSES.map((status) => (
          <Card key={status} className="p-[var(--spacing-md)]">
            <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
              <StatusBadge status={status} />
            </p>
            <p className="text-[var(--text-2xl)] font-semibold mt-[var(--spacing-xs)] text-[var(--color-text)]">
              {counts[status] ?? 0}
            </p>
          </Card>
        ))}
        <Card className="p-[var(--spacing-md)] col-span-2 sm:col-span-3 lg:col-span-1">
          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">Revenue Pipeline</p>
          <p className="text-[var(--text-2xl)] font-semibold mt-[var(--spacing-xs)] text-[var(--color-text)]">
            {formatCurrency(revenuePipeline, currency)}
          </p>
        </Card>
      </div>

      <Card>
        <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] border-b border-[var(--color-border)]">
          <h2 className="text-[var(--text-base)] font-semibold text-[var(--color-text)]">Recent Proposals</h2>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title="No proposals yet"
            description="Create a client and project, then build your first proposal from a template."
            action={
              <Link to="/proposals/new">
                <Button variant="primary">Create your first proposal</Button>
              </Link>
            }
          />
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {recent.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/proposals/${p.id}/edit`}
                  className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                >
                  <div className="min-w-0">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)] truncate">
                      {p.number} · {projectName(p.projectId)}
                    </p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] truncate">
                      {clientName(p.projectId)}
                    </p>
                  </div>
                  <div className="flex items-center gap-[var(--spacing-md)] shrink-0">
                    <span className="text-[var(--text-sm)] text-[var(--color-text)]">
                      {formatCurrency(p.total, p.currency)}
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
