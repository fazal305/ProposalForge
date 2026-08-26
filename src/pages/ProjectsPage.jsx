import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Field, Input, Textarea } from '@/components/FormField'
import { useClientsStore } from '@/stores/clientsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { projectSchema } from '@/schemas/project'
function AddProjectForm({ defaultClientId, onDone }) {
  const clients = useClientsStore((s) => s.clients)
  const addProject = useProjectsStore((s) => s.addProject)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      clientId: defaultClientId,
      status: 'ACTIVE',
    },
  })
  const onSubmit = (values) => {
    addProject({
      clientId: values.clientId,
      name: values.name,
      description: values.description || null,
      problemStatement: values.problemStatement || null,
      proposedSolution: values.proposedSolution || null,
      category: values.category || null,
      techStack: values.techStack
        ? values.techStack
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      estimatedTimeline: values.estimatedTimeline || null,
      budget: values.budget ?? null,
      status: values.status,
      notes: values.notes || null,
    })
    onDone()
  }
  if (clients.length === 0) {
    return (
      <Card className="p-[var(--spacing-lg)] mb-[var(--spacing-lg)]">
        <EmptyState
          title="Add a client first"
          description="Projects belong to a client — create one before starting a project."
          action={
            <Link to="/clients">
              <Button variant="primary">Add Client</Button>
            </Link>
          }
        />
      </Card>
    )
  }
  return (
    <Card className="p-[var(--spacing-lg)] mb-[var(--spacing-lg)]">
      <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-[var(--spacing-md)]">
        <Field label="Client" error={errors.clientId?.message}>
          <select
            {...register('clientId')}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)] text-[var(--color-text)]"
          >
            <option value="">Select a client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Project Name" error={errors.name?.message}>
          <Input {...register('name')} />
        </Field>
        <Field label="Category">
          <Input {...register('category')} placeholder="e.g. Web Development" />
        </Field>
        <Field label="Tech Stack" hint="Comma-separated">
          <Input {...register('techStack')} placeholder="React, Node.js, PostgreSQL" />
        </Field>
        <Field label="Estimated Timeline">
          <Input {...register('estimatedTimeline')} placeholder="e.g. 6-8 weeks" />
        </Field>
        <Field label="Budget (approx.)">
          <Input type="number" step="0.01" {...register('budget')} />
        </Field>
        <Field label="Description" hint="Optional">
          <Textarea {...register('description')} rows={2} />
        </Field>
        <Field label="Problem Statement" hint="What problem does this solve for the client?">
          <Textarea {...register('problemStatement')} rows={2} />
        </Field>
        <Field label="Proposed Solution" hint="Optional — refine later in the proposal">
          <Textarea {...register('proposedSolution')} rows={2} />
        </Field>
        <div className="sm:col-span-2 flex justify-end gap-[var(--spacing-xs)]">
          <Button type="button" variant="ghost" onClick={onDone}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            Create Project
          </Button>
        </div>
      </form>
    </Card>
  )
}
export function ProjectsPage() {
  const location = useLocation()
  const projects = useProjectsStore((s) => s.projects)
  const clients = useClientsStore((s) => s.clients)
  const [showForm, setShowForm] = useState(Boolean(location.state?.clientId))
  const clientLabel = (clientId) => {
    const c = clients.find((cl) => cl.id === clientId)
    return c ? c.company || c.name : 'Unknown client'
  }
  return (
    <div>
      <PageHeader
        title="Projects"
        description="Work items you're proposing for, one per client engagement."
        actions={
          !showForm && (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              New Project
            </Button>
          )
        }
      />

      {showForm && <AddProjectForm defaultClientId={location.state?.clientId} onDone={() => setShowForm(false)} />}

      {projects.length === 0 && !showForm ? (
        <Card>
          <EmptyState title="No projects yet" description="Create a project to start building a proposal." />
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-[var(--color-border)]">
            {projects.map((project) => (
              <li key={project.id}>
                <Link
                  to={`/projects/${project.id}`}
                  className="flex items-center justify-between gap-[var(--spacing-md)] px-[var(--spacing-lg)] py-[var(--spacing-sm)] hover:bg-[var(--color-background)] transition-colors duration-[var(--duration-fast)]"
                >
                  <div className="min-w-0">
                    <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">{project.name}</p>
                    <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
                      {clientLabel(project.clientId)}
                    </p>
                  </div>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-muted)] shrink-0">
                    {project.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
