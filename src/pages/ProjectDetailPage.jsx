import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { useClientsStore } from '@/stores/clientsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useProposalsStore } from '@/stores/proposalsStore'
import { formatCurrency } from '@/lib/pricing'
export function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === id))
  const deleteProject = useProjectsStore((s) => s.deleteProject)
  const client = useClientsStore((s) => s.clients.find((c) => c.id === project?.clientId))
  const proposals = useProposalsStore((s) => s.proposalsForProject(id ?? ''))
  if (!project) {
    return (
      <EmptyState
        title="Project not found"
        action={
          <Link to="/projects">
            <Button variant="primary">Back to Projects</Button>
          </Link>
        }
      />
    )
  }
  return (
    <div>
      <PageHeader
        title={project.name}
        description={client ? `${client.name}${client.company ? ` · ${client.company}` : ''}` : undefined}
        actions={
          <>
            <Link
              to="/proposals/new"
              state={{
                projectId: project.id,
              }}
            >
              <Button variant="primary">New Proposal</Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm(`Delete project "${project.name}"?`)) {
                  deleteProject(project.id)
                  navigate('/projects')
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-[var(--spacing-lg)]">
        <Card className="p-[var(--spacing-lg)] lg:col-span-1 h-fit space-y-[var(--spacing-sm)] text-[var(--text-sm)]">
          <div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Status</p>
            <p className="text-[var(--color-text)]">{project.status}</p>
          </div>
          <div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Category</p>
            <p className="text-[var(--color-text)]">{project.category || '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Tech Stack</p>
            <p className="text-[var(--color-text)]">{project.techStack.length ? project.techStack.join(', ') : '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Timeline</p>
            <p className="text-[var(--color-text)]">{project.estimatedTimeline || '—'}</p>
          </div>
          <div>
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Budget</p>
            <p className="text-[var(--color-text)]">{project.budget ? formatCurrency(project.budget, 'USD') : '—'}</p>
          </div>
          {project.description && (
            <div>
              <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Description</p>
              <p className="text-[var(--color-text)] whitespace-pre-wrap">{project.description}</p>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] border-b border-[var(--color-border)]">
            <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Proposals</h2>
          </div>
          {proposals.length === 0 ? (
            <EmptyState
              title="No proposals yet"
              action={
                <Link
                  to="/proposals/new"
                  state={{
                    projectId: project.id,
                  }}
                >
                  <Button variant="primary">New Proposal</Button>
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {proposals.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/proposals/${p.id}/edit`}
                    className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                  >
                    <span className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">{p.number}</span>
                    <div className="flex items-center gap-[var(--spacing-md)]">
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
    </div>
  )
}
