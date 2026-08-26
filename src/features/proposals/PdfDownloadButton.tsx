import { Suspense, lazy } from 'react'
import { Button } from '@/components/Button'
import type { VariableContext } from '@/lib/variables'
import type { Proposal, ProposalTheme } from '@/types'

// @react-pdf/renderer is a large dependency — load it only when a PDF is actually requested,
// keeping it out of the main bundle for every other page.
const LazyPdfLink = lazy(async () => {
  const [{ PDFDownloadLink }, { ProposalPdfDocument }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('./ProposalPdfDocument'),
  ])
  return {
    default: ({ proposal, context, theme }: { proposal: Proposal; context: VariableContext; theme: ProposalTheme }) => (
      <PDFDownloadLink
        document={<ProposalPdfDocument proposal={proposal} context={context} theme={theme} />}
        fileName={`${proposal.number}.pdf`}
      >
        {({ loading }) => (
          <Button variant="secondary" disabled={loading}>
            {loading ? 'Preparing PDF…' : 'Download PDF'}
          </Button>
        )}
      </PDFDownloadLink>
    ),
  }
})

export function PdfDownloadButton(props: { proposal: Proposal; context: VariableContext; theme: ProposalTheme }) {
  return (
    <Suspense fallback={<Button variant="secondary" disabled>Loading…</Button>}>
      <LazyPdfLink {...props} />
    </Suspense>
  )
}
