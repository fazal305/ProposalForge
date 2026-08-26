import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { resolveVariables, type VariableContext } from '@/lib/variables'
import { formatCurrency, lineItemTotal } from '@/lib/pricing'
import type { Proposal, ProposalTheme } from '@/types'

/**
 * A real PDF document (not a screenshot of the HTML preview) built with @react-pdf/renderer
 * primitives. Mirrors the structure of ProposalRenderer.tsx but uses that library's own
 * layout model, so page breaks, headers, and footers are handled by the PDF engine itself.
 */

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10.5, fontFamily: 'Helvetica', color: '#1a1a1a' },
  header: { marginBottom: 24, paddingBottom: 16, borderBottom: '2pt solid #1f4d3d' },
  eyebrow: { fontSize: 9, color: '#6b6862', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold', marginBottom: 6 },
  subtitle: { fontSize: 10, color: '#6b6862' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: '#1f4d3d', marginBottom: 6 },
  paragraph: { marginBottom: 4, lineHeight: 1.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottom: '0.5pt solid #e5e3de' },
  totalsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 24, paddingVertical: 2 },
  totalsLabel: { color: '#6b6862' },
  totalsValue: { width: 90, textAlign: 'right' },
  grandTotal: { fontSize: 13, fontFamily: 'Helvetica-Bold', borderTop: '1pt solid #1a1a1a', marginTop: 4, paddingTop: 4 },
  footer: { position: 'absolute', bottom: 24, left: 48, right: 48, fontSize: 8, color: '#98958d', textAlign: 'center' },
  pageNumber: { position: 'absolute', bottom: 24, right: 48, fontSize: 8, color: '#98958d' },
})

function stripMarkdown(md: string): string[] {
  return md
    .split('\n')
    .map((line) => line.replace(/\*\*/g, '').replace(/^#+\s*/, '').replace(/^- /, '• '))
    .filter((line) => line.trim().length > 0)
}

export function ProposalPdfDocument({
  proposal,
  context,
}: {
  proposal: Proposal
  context: VariableContext
  theme: ProposalTheme
}) {
  const sections = [...proposal.sections].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <Document title={`Proposal ${proposal.number}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Proposal {context.proposal.number}</Text>
          <Text style={styles.title}>{context.project.name || 'Software Development Proposal'}</Text>
          <Text style={styles.subtitle}>
            Prepared for {context.client.company || context.client.name} · {context.proposal.date}
          </Text>
        </View>

        {sections.map((section) => (
          <View key={section.id} style={styles.section} wrap>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.sectionKey === 'investment_pricing' ? (
              <>
                {[...proposal.pricingItems]
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((item) => (
                    <View key={item.id} style={styles.row}>
                      <Text>{item.name}</Text>
                      <Text>{formatCurrency(lineItemTotal(item), proposal.currency)}</Text>
                    </View>
                  ))}
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Subtotal</Text>
                  <Text style={styles.totalsValue}>{formatCurrency(proposal.subtotal, proposal.currency)}</Text>
                </View>
                {proposal.discount > 0 && (
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Discount</Text>
                    <Text style={styles.totalsValue}>−{formatCurrency(proposal.discount, proposal.currency)}</Text>
                  </View>
                )}
                {proposal.tax > 0 && (
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Tax</Text>
                    <Text style={styles.totalsValue}>+{formatCurrency(proposal.tax, proposal.currency)}</Text>
                  </View>
                )}
                <View style={[styles.totalsRow, styles.grandTotal]}>
                  <Text>Total</Text>
                  <Text style={styles.totalsValue}>{formatCurrency(proposal.total, proposal.currency)}</Text>
                </View>
              </>
            ) : section.sectionKey === 'payment_schedule' ? (
              [...proposal.paymentSchedules]
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((entry) => (
                  <View key={entry.id} style={styles.row}>
                    <Text>
                      {entry.label} ({entry.percent}%)
                    </Text>
                    <Text>{formatCurrency(entry.amount, proposal.currency)}</Text>
                  </View>
                ))
            ) : section.sectionKey === 'timeline_milestones' ? (
              [...proposal.milestones]
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((m, i) => (
                  <View key={m.id} style={styles.row}>
                    <Text>
                      {i + 1}. {m.name}
                    </Text>
                    <Text>{m.durationLabel}</Text>
                  </View>
                ))
            ) : (
              stripMarkdown(resolveVariables(section.contentMd, context)).map((line, i) => (
                <Text key={i} style={styles.paragraph}>
                  {line}
                </Text>
              ))
            )}
          </View>
        ))}

        <Text style={styles.footer} fixed>
          {context.developer.name} · {context.developer.email}
          {context.proposal.validUntil ? ` · Valid until ${context.proposal.validUntil}` : ''}
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>
    </Document>
  )
}
