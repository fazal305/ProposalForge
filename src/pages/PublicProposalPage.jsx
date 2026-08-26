import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Textarea } from '@/components/FormField'
import { useProposalsStore } from '@/stores/proposalsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useClientsStore } from '@/stores/clientsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTemplatesStore } from '@/stores/templatesStore'
import { ProposalRenderer } from '@/features/proposals/ProposalRenderer'
import { PdfDownloadButton } from '@/features/proposals/PdfDownloadButton'
import { buildVariableContext } from '@/features/proposals/buildVariableContext'
import { DEFAULT_THEME } from '@/data/defaultTemplate'
export function PublicProposalPage() {
  const { token } = useParams()
  const proposal = useProposalsStore((s) => (token ? s.getProposalByPublicToken(token) : undefined))
  const markViewed = useProposalsStore((s) => s.markViewed)
  const recordApproval = useProposalsStore((s) => s.recordApproval)
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === proposal?.projectId))
  const client = useClientsStore((s) => s.clients.find((c) => c.id === project?.clientId))
  const profile = useSettingsStore((s) => s.profile)
  const template = useTemplatesStore((s) => s.templates.find((t) => t.id === proposal?.templateId))
  const [clientName, setClientName] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  useEffect(() => {
    if (proposal) markViewed(proposal.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proposal?.id])
  const context = useMemo(
    () => (proposal ? buildVariableContext(proposal, project, client, profile) : null),
    [proposal, project, client, profile],
  )
  if (!proposal || !context) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-[var(--spacing-md)]">
        <Card className="p-[var(--spacing-xl)] text-center max-w-sm">
          <p className="text-[var(--text-lg)] font-medium text-[var(--color-text)]">Proposal not found</p>
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-[var(--spacing-2xs)]">
            This link may be invalid or the proposal may have been removed.
          </p>
        </Card>
      </div>
    )
  }
  const theme = template?.theme ?? DEFAULT_THEME
  const alreadyDecided = proposal.approvals.length > 0
  const latestDecision = proposal.approvals[0]
  const submit = (d) => {
    if (!clientName.trim()) return
    recordApproval(proposal.id, d, clientName.trim(), comment.trim() || undefined)
    setSubmitted(true)
  }
  return (
    <div className="min-h-screen bg-[var(--color-background)] py-[var(--spacing-2xl)] px-[var(--spacing-md)]">
      <ProposalRenderer
        proposal={proposal}
        context={context}
        theme={theme}
        developerLogoDataUrl={profile.logoDataUrl}
      />

      <div className="max-w-[840px] mx-auto mt-[var(--spacing-lg)]">
        <Card className="p-[var(--spacing-lg)]">
          <div className="flex justify-end mb-[var(--spacing-md)]">
            <PdfDownloadButton proposal={proposal} context={context} theme={theme} />
          </div>

          {alreadyDecided || submitted ? (
            <div className="text-center py-[var(--spacing-md)]">
              <p className="text-[var(--text-base)] font-medium text-[var(--color-text)]">
                {latestDecision?.decision === 'APPROVED' && 'You approved this proposal.'}
                {latestDecision?.decision === 'REJECTED' && 'You rejected this proposal.'}
                {latestDecision?.decision === 'CHANGES_REQUESTED' && 'Your change request was sent.'}
                {!latestDecision && 'Thank you for your response.'}
              </p>
              <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-[var(--spacing-2xs)]">
                The developer has been notified and will follow up with you directly.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-[var(--text-base)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">
                Your Response
              </h2>
              <div className="space-y-[var(--spacing-sm)]">
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
                />
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Optional comment — e.g. what you'd like changed"
                  rows={3}
                  aria-label="Comment"
                />
                <div className="flex flex-wrap gap-[var(--spacing-sm)]">
                  <Button variant="primary" disabled={!clientName.trim()} onClick={() => submit('APPROVED')}>
                    Approve Proposal
                  </Button>
                  <Button variant="secondary" disabled={!clientName.trim()} onClick={() => submit('CHANGES_REQUESTED')}>
                    Request Changes
                  </Button>
                  <Button variant="danger" disabled={!clientName.trim()} onClick={() => submit('REJECTED')}>
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
