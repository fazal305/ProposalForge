import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { StatusBadge } from '@/components/StatusBadge'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useClientsStore } from '@/stores/clientsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useSyncStore } from '@/stores/syncStore'
import { ScopeBuilder } from '@/features/proposals/ScopeBuilder'
import { PricingBuilder } from '@/features/proposals/PricingBuilder'
import { TimelineBuilder } from '@/features/proposals/TimelineBuilder'
import { PaymentScheduleBuilder } from '@/features/proposals/PaymentScheduleBuilder'
import { SectionsEditor } from '@/features/proposals/SectionsEditor'
import { buildVariableContext } from '@/features/proposals/buildVariableContext'
import { paymentSchedulePercentTotal } from '@/lib/pricing'
const TABS = ['Sections', 'Scope', 'Pricing', 'Timeline', 'Payment Schedule']
export function ProposalBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const proposal = useProposalsStore((s) => s.proposals.find((p) => p.id === id))
  const duplicateProposal = useProposalsStore((s) => s.duplicateProposal)
  const sendProposal = useProposalsStore((s) => s.sendProposal)
  const archiveProposal = useProposalsStore((s) => s.archiveProposal)
  const consumeProposalNumber = useSettingsStore((s) => s.consumeProposalNumber)
  const profile = useSettingsStore((s) => s.profile)
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === proposal?.projectId))
  const client = useClientsStore((s) => s.clients.find((c) => c.id === project?.clientId))
  const { setSaving, setSaved } = useSyncStore()
  const [tab, setTab] = useState('Sections')
  useEffect(() => {
    if (!proposal) return
    setSaving()
    const t = setTimeout(setSaved, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal])
  if (!proposal) {
    return (
      <EmptyState
        title="Proposal not found"
        action={
          <Link to="/proposals">
            <Button variant="primary">Back to Proposals</Button>
          </Link>
        }
      />
    )
  }
  const context = buildVariableContext(proposal, project, client, profile)
  const scheduleValid =
    proposal.paymentSchedules.length === 0 || paymentSchedulePercentTotal(proposal.paymentSchedules) === 100
  const canSend = proposal.pricingItems.length > 0 && scheduleValid
  return (
    <div>
      <PageHeader
        title={proposal.number}
        description={`${project?.name ?? ''}${client ? ` · ${client.company || client.name}` : ''}`}
        actions={
          <>
            <StatusBadge status={proposal.status} />
            <Link to={`/proposals/${proposal.id}/preview`}>
              <Button variant="secondary">Preview</Button>
            </Link>
            <Button
              variant="secondary"
              onClick={() => {
                const copy = duplicateProposal(proposal.id, consumeProposalNumber())
                if (copy) navigate(`/proposals/${copy.id}/edit`)
              }}
            >
              Duplicate
            </Button>
            {proposal.status === 'DRAFT' && (
              <Button
                variant="primary"
                disabled={!canSend}
                title={canSend ? undefined : 'Add at least one pricing item and a 100%-complete payment schedule first'}
                onClick={() => sendProposal(proposal.id)}
              >
                Send Proposal
              </Button>
            )}
            {proposal.status !== 'ARCHIVED' && (
              <Button variant="ghost" onClick={() => archiveProposal(proposal.id)}>
                Archive
              </Button>
            )}
          </>
        }
      />

      <div className="border-b border-[var(--color-border)] mb-[var(--spacing-lg)] overflow-x-auto">
        <nav className="flex gap-[var(--spacing-sm)]" role="tablist" aria-label="Proposal builder sections">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`px-[var(--spacing-sm)] py-[var(--spacing-sm)] text-[var(--text-sm)] font-medium border-b-2 transition-colors duration-[var(--duration-fast)] whitespace-nowrap ${tab === t ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      {tab === 'Sections' && <SectionsEditor proposalId={proposal.id} sections={proposal.sections} context={context} />}
      {tab === 'Scope' && <ScopeBuilder proposalId={proposal.id} scopeItems={proposal.scopeItems} />}
      {tab === 'Pricing' && <PricingBuilder proposal={proposal} />}
      {tab === 'Timeline' && <TimelineBuilder proposalId={proposal.id} milestones={proposal.milestones} />}
      {tab === 'Payment Schedule' && <PaymentScheduleBuilder proposal={proposal} />}
    </div>
  )
}
