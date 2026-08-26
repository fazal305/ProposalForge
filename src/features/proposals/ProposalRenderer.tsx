import { MarkdownLite } from '@/lib/markdownLite'
import { resolveVariables, type VariableContext } from '@/lib/variables'
import { formatCurrency, lineItemTotal } from '@/lib/pricing'
import type { Proposal, ProposalTheme } from '@/types'

function groupScopeItems(items: Proposal['scopeItems']) {
  const map = new Map<string, Proposal['scopeItems']>()
  for (const item of [...items].sort((a, b) => a.orderIndex - b.orderIndex)) {
    const list = map.get(item.groupTitle) ?? []
    list.push(item)
    map.set(item.groupTitle, list)
  }
  return [...map.entries()]
}

function SectionBody({ sectionKey, contentMd, proposal, context }: { sectionKey: string; contentMd: string; proposal: Proposal; context: VariableContext }) {
  const resolved = resolveVariables(contentMd, context)

  if (sectionKey === 'scope_of_work') {
    return (
      <div className="space-y-4">
        <MarkdownLite content={resolved} />
        {groupScopeItems(proposal.scopeItems.filter((i) => i.included)).map(([group, items]) => (
          <div key={group}>
            <h4 className="font-semibold text-[15px] mb-1">{group}</h4>
            <ul className="list-disc pl-5 space-y-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  {item.title}
                  {item.description ? ` — ${item.description}` : ''}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  if (sectionKey === 'timeline_milestones') {
    const milestones = [...proposal.milestones].sort((a, b) => a.orderIndex - b.orderIndex)
    return (
      <div className="space-y-3">
        <MarkdownLite content={resolved} />
        <ol className="space-y-2">
          {milestones.map((m, i) => (
            <li key={m.id} className="flex justify-between gap-4 border-b border-current/10 pb-2">
              <div>
                <span className="font-medium">
                  {i + 1}. {m.name}
                </span>
                {m.description && <p className="text-[13px] opacity-80">{m.description}</p>}
              </div>
              <span className="text-[13px] opacity-80 whitespace-nowrap">{m.durationLabel}</span>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  if (sectionKey === 'investment_pricing') {
    const items = [...proposal.pricingItems].sort((a, b) => a.orderIndex - b.orderIndex)
    return (
      <div className="space-y-3">
        <MarkdownLite content={resolved} />
        <table className="w-full text-[14px]">
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-current/10">
                <td className="py-1.5">{item.name}</td>
                <td className="py-1.5 text-right opacity-80">
                  {item.quantity} × {formatCurrency(item.unitPrice, proposal.currency)}
                </td>
                <td className="py-1.5 text-right font-medium w-32">{formatCurrency(lineItemTotal(item), proposal.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col items-end text-[14px] gap-0.5 pt-1">
          <div className="flex gap-8">
            <span className="opacity-80">Subtotal</span>
            <span className="w-28 text-right">{formatCurrency(proposal.subtotal, proposal.currency)}</span>
          </div>
          {proposal.discount > 0 && (
            <div className="flex gap-8">
              <span className="opacity-80">Discount</span>
              <span className="w-28 text-right">−{formatCurrency(proposal.discount, proposal.currency)}</span>
            </div>
          )}
          {proposal.tax > 0 && (
            <div className="flex gap-8">
              <span className="opacity-80">Tax</span>
              <span className="w-28 text-right">+{formatCurrency(proposal.tax, proposal.currency)}</span>
            </div>
          )}
          <div className="flex gap-8 text-[17px] font-semibold border-t border-current/20 pt-1 mt-1">
            <span>Total</span>
            <span className="w-28 text-right">{formatCurrency(proposal.total, proposal.currency)}</span>
          </div>
        </div>
      </div>
    )
  }

  if (sectionKey === 'payment_schedule') {
    return (
      <div className="space-y-3">
        <MarkdownLite content={resolved} />
        <table className="w-full text-[14px]">
          <tbody>
            {[...proposal.paymentSchedules].sort((a, b) => a.orderIndex - b.orderIndex).map((entry) => (
              <tr key={entry.id} className="border-b border-current/10">
                <td className="py-1.5">{entry.label}</td>
                <td className="py-1.5 text-right opacity-80">{entry.percent}%</td>
                <td className="py-1.5 text-right font-medium w-32">{formatCurrency(entry.amount, proposal.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return <MarkdownLite content={resolved} />
}

export function ProposalRenderer({
  proposal,
  context,
  theme,
  developerLogoDataUrl,
}: {
  proposal: Proposal
  context: VariableContext
  theme: ProposalTheme
  developerLogoDataUrl?: string | null
}) {
  const sections = [...proposal.sections].sort((a, b) => a.orderIndex - b.orderIndex)
  const radiusMap = { sharp: '2px', soft: '10px', round: '20px' } as const
  const spacingMap = { compact: '20px', comfortable: '32px', spacious: '48px' } as const

  return (
    <div
      className="mx-auto bg-white text-[#1a1a1a] shadow-[var(--shadow-lg)] print:shadow-none"
      style={{
        maxWidth: '840px',
        fontFamily: `${theme.fontBody}, sans-serif`,
        borderRadius: radiusMap[theme.radius],
        overflow: 'hidden',
      }}
    >
      <header
        className="px-10 py-12 text-white"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
          textAlign: theme.headerStyle === 'centered' ? 'center' : 'left',
        }}
      >
        {developerLogoDataUrl && (
          <img src={developerLogoDataUrl} alt="" className="h-12 mb-4" style={{ margin: theme.headerStyle === 'centered' ? '0 auto 16px' : '0 0 16px' }} />
        )}
        <p className="uppercase tracking-widest text-[12px] opacity-90 mb-2">Proposal {context.proposal.number}</p>
        <h1 style={{ fontFamily: `${theme.fontHeading}, serif` }} className="text-[32px] font-semibold leading-tight">
          {context.project.name || 'Software Development Proposal'}
        </h1>
        <p className="mt-2 opacity-90 text-[15px]">
          Prepared for {context.client.company || context.client.name} · {context.proposal.date}
        </p>
      </header>

      <div style={{ padding: spacingMap[theme.spacing] }} className="space-y-10">
        {sections
          .filter((s) => s.contentMd.trim().length > 0 || ['scope_of_work', 'timeline_milestones', 'investment_pricing', 'payment_schedule'].includes(s.sectionKey))
          .map((section) => (
            <section key={section.id}>
              <h2 style={{ fontFamily: `${theme.fontHeading}, serif`, color: theme.primaryColor }} className="text-[20px] font-semibold mb-3 pb-2 border-b" >
                {section.title}
              </h2>
              <div className="text-[14px] leading-relaxed">
                <SectionBody sectionKey={section.sectionKey} contentMd={section.contentMd} proposal={proposal} context={context} />
              </div>
            </section>
          ))}
      </div>

      <footer className="px-10 py-6 text-[12px] text-center opacity-60 border-t">
        {context.developer.name} · {context.developer.email}
        {context.proposal.validUntil ? ` · Valid until ${context.proposal.validUntil}` : ''}
      </footer>
    </div>
  )
}
