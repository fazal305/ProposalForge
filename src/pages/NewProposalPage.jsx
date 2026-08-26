import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field } from '@/components/FormField'
import { EmptyState } from '@/components/EmptyState'
import { useProjectsStore } from '@/stores/projectsStore'
import { useClientsStore } from '@/stores/clientsStore'
import { useTemplatesStore } from '@/stores/templatesStore'
import { useProposalsStore } from '@/stores/proposalsStore'
import { useSettingsStore } from '@/stores/settingsStore'
export function NewProposalPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const projects = useProjectsStore((s) => s.projects)
  const clients = useClientsStore((s) => s.clients)
  const templates = useTemplatesStore((s) => s.templates)
  const createProposal = useProposalsStore((s) => s.createProposal)
  const consumeProposalNumber = useSettingsStore((s) => s.consumeProposalNumber)
  const currency = useSettingsStore((s) => s.profile.currency)
  const defaultPricingMode = useSettingsStore((s) => s.profile.defaultPricingMode)
  const [projectId, setProjectId] = useState(location.state?.projectId ?? '')
  const [templateId, setTemplateId] = useState(templates.find((t) => t.isDefault)?.id ?? templates[0]?.id ?? '')
  const clientLabel = (clientId) => {
    const c = clients.find((cl) => cl.id === clientId)
    return c ? c.company || c.name : ''
  }
  if (projects.length === 0) {
    return (
      <EmptyState
        title="Create a project first"
        description="Proposals are built for a specific project."
        action={
          <Link to="/projects">
            <Button variant="primary">New Project</Button>
          </Link>
        }
      />
    )
  }
  const handleCreate = () => {
    if (!projectId || !templateId) return
    const template = templates.find((t) => t.id === templateId)
    const proposal = createProposal(
      {
        projectId,
        templateId,
        currency,
        pricingMode: defaultPricingMode,
        sections: template.sections
          .filter((s) => s.enabled)
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((s) => ({
            sectionKey: s.key,
            title: s.title,
            contentMd: s.contentMd,
            orderIndex: s.orderIndex,
          })),
      },
      consumeProposalNumber(),
    )
    navigate(`/proposals/${proposal.id}/edit`)
  }
  return (
    <div>
      <PageHeader
        title="New Proposal"
        description="Pick a project and starting template — you'll customize everything next."
      />
      <Card className="p-[var(--spacing-lg)] max-w-xl space-y-[var(--spacing-md)]">
        <Field label="Project">
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
          >
            <option value="">Select a project…</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {clientLabel(p.clientId)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Template">
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-[var(--spacing-xs)]">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!projectId || !templateId} onClick={handleCreate}>
            Create Proposal
          </Button>
        </div>
      </Card>
    </div>
  )
}
