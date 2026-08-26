import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { useClientsStore } from '@/stores/clientsStore'
import { useProjectsStore } from '@/stores/projectsStore'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const client = useClientsStore((s) => s.clients.find((c) => c.id === id))
  const deleteClient = useClientsStore((s) => s.deleteClient)
  const projects = useProjectsStore((s) => s.projectsForClient(id ?? ''))

  if (!client) {
    return (
      <EmptyState
        title="Client not found"
        description="This client may have been deleted."
        action={
          <Link to="/clients">
            <Button variant="primary">Back to Clients</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={client.name}
        description={client.company ?? undefined}
        actions={
          <Button
            variant="danger"
            onClick={() => {
              if (confirm(`Delete ${client.name}? This does not delete their projects.`)) {
                deleteClient(client.id)
                navigate('/clients')
              }
            }}
          >
            Delete Client
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-[var(--spacing-lg)]">
        <Card className="p-[var(--spacing-lg)] lg:col-span-1 h-fit">
          <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">Contact Details</h2>
          <dl className="space-y-[var(--spacing-xs)] text-[var(--text-sm)]">
            <div>
              <dt className="text-[var(--color-text-subtle)] text-[var(--text-xs)]">Email</dt>
              <dd className="text-[var(--color-text)]">{client.email || '—'}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-subtle)] text-[var(--text-xs)]">Phone</dt>
              <dd className="text-[var(--color-text)]">{client.phone || '—'}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-text-subtle)] text-[var(--text-xs)]">Address</dt>
              <dd className="text-[var(--color-text)]">{client.address || '—'}</dd>
            </div>
            {client.notes && (
              <div>
                <dt className="text-[var(--color-text-subtle)] text-[var(--text-xs)]">Notes</dt>
                <dd className="text-[var(--color-text)] whitespace-pre-wrap">{client.notes}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Projects</h2>
            <Link to="/projects" state={{ clientId: client.id }}>
              <Button size="sm" variant="primary">
                New Project
              </Button>
            </Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState title="No projects yet" description="Create a project for this client to start a proposal." />
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link
                    to={`/projects/${project.id}`}
                    className="block px-[var(--spacing-lg)] py-[var(--spacing-sm)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                  >
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">{project.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">{project.status}</p>
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
