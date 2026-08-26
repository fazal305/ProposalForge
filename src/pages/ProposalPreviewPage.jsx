import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
import { useProjectsStore } from '@/stores/projectsStore'
import { useClientsStore } from '@/stores/clientsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useTemplatesStore } from '@/stores/templatesStore'
import { ProposalRenderer } from '@/features/proposals/ProposalRenderer'
import { PdfDownloadButton } from '@/features/proposals/PdfDownloadButton'
import { buildVariableContext } from '@/features/proposals/buildVariableContext'
import { DEFAULT_THEME } from '@/data/defaultTemplate'
export function ProposalPreviewPage() {
  const { id } = useParams()
  const proposal = useProposalsStore((s) => s.proposals.find((p) => p.id === id))
  const project = useProjectsStore((s) => s.projects.find((p) => p.id === proposal?.projectId))
  const client = useClientsStore((s) => s.clients.find((c) => c.id === project?.clientId))
  const profile = useSettingsStore((s) => s.profile)
  const template = useTemplatesStore((s) => s.templates.find((t) => t.id === proposal?.templateId))
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
  const theme = template?.theme ?? DEFAULT_THEME
  const shareUrl = `${window.location.origin}/proposal/${proposal.publicToken}`
  return (
    <div>
      <PageHeader
        title="Preview"
        description="This is exactly what the client will see."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl)
              }}
            >
              Copy Share Link
            </Button>
            <PdfDownloadButton proposal={proposal} context={context} theme={theme} />
            <Link to={`/proposals/${proposal.id}/edit`}>
              <Button variant="ghost">← Back to Editor</Button>
            </Link>
          </>
        }
      />
      <div className="print:p-0">
        <ProposalRenderer
          proposal={proposal}
          context={context}
          theme={theme}
          developerLogoDataUrl={profile.logoDataUrl}
        />
      </div>
    </div>
  )
}
