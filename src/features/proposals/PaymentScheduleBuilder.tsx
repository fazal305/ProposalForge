import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/FormField'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
import { formatCurrency, paymentSchedulePercentTotal } from '@/lib/pricing'
import type { Proposal } from '@/types'

const PRESETS: { label: string; entries: { label: string; percent: number }[] }[] = [
  { label: '50 / 50', entries: [{ label: 'Upfront', percent: 50 }, { label: 'Final Delivery', percent: 50 }] },
  {
    label: '50 / 25 / 25',
    entries: [
      { label: 'Milestone 1', percent: 50 },
      { label: 'Milestone 2', percent: 25 },
      { label: 'Final Delivery', percent: 25 },
    ],
  },
]

export function PaymentScheduleBuilder({ proposal }: { proposal: Proposal }) {
  const setPaymentScheduleEntries = useProposalsStore((s) => s.setPaymentScheduleEntries)
  const [draft, setDraft] = useState(proposal.paymentSchedules.map((e) => ({ label: e.label, percent: e.percent })))

  const sync = (next: typeof draft) => {
    setDraft(next)
    setPaymentScheduleEntries(proposal.id, next)
  }

  const totalPercent = paymentSchedulePercentTotal(draft)
  const isValid = draft.length > 0 && totalPercent === 100

  return (
    <Card className="p-[var(--spacing-lg)] max-w-2xl">
      <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">Payment Schedule</h3>

      <div className="flex flex-wrap gap-[var(--spacing-xs)] mb-[var(--spacing-md)]">
        {PRESETS.map((preset) => (
          <Button key={preset.label} size="sm" variant="secondary" onClick={() => sync(preset.entries)}>
            {preset.label}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => sync([...draft, { label: `Milestone ${draft.length + 1}`, percent: 0 }])}
        >
          + Custom Entry
        </Button>
      </div>

      {draft.length === 0 ? (
        <EmptyState title="No payment schedule set" description="Use a preset above or add custom entries." />
      ) : (
        <div className="space-y-[var(--spacing-sm)]">
          {draft.map((entry, index) => (
            <div key={index} className="flex items-center gap-[var(--spacing-sm)]">
              <Input
                value={entry.label}
                onChange={(e) => {
                  const next = [...draft]
                  next[index] = { ...next[index], label: e.target.value }
                  sync(next)
                }}
                className="flex-1"
                aria-label="Milestone label"
              />
              <div className="flex items-center gap-[var(--spacing-2xs)]">
                <Input
                  type="number"
                  value={entry.percent}
                  onChange={(e) => {
                    const next = [...draft]
                    next[index] = { ...next[index], percent: Number(e.target.value) }
                    sync(next)
                  }}
                  className="w-20"
                  aria-label="Percent"
                />
                <span className="text-[var(--text-sm)] text-[var(--color-text-muted)]">%</span>
              </div>
              <span className="text-[var(--text-sm)] text-[var(--color-text)] w-28 text-right">
                {formatCurrency(proposal.paymentSchedules[index]?.amount ?? 0, proposal.currency)}
              </span>
              <Button size="sm" variant="ghost" onClick={() => sync(draft.filter((_, i) => i !== index))}>
                Remove
              </Button>
            </div>
          ))}
          <p className={`text-[var(--text-xs)] ${isValid ? 'text-[var(--color-text-subtle)]' : 'text-[var(--color-danger)]'}`} role={isValid ? undefined : 'alert'}>
            Total: {totalPercent}% {isValid ? '' : '— must equal 100% before sending'}
          </p>
        </div>
      )}
    </Card>
  )
}
