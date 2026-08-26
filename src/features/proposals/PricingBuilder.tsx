import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field, Input } from '@/components/FormField'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
import { formatCurrency, lineItemTotal } from '@/lib/pricing'
import type { PricingItem, Proposal } from '@/types'

export function PricingBuilder({ proposal }: { proposal: Proposal }) {
  const addPricingItem = useProposalsStore((s) => s.addPricingItem)
  const updatePricingItem = useProposalsStore((s) => s.updatePricingItem)
  const deletePricingItem = useProposalsStore((s) => s.deletePricingItem)
  const updateProposalFields = useProposalsStore((s) => s.updateProposalFields)
  const [name, setName] = useState('')

  const items: PricingItem[] = [...proposal.pricingItems].sort((a, b) => a.orderIndex - b.orderIndex)

  return (
    <div className="space-y-[var(--spacing-lg)]">
      <Card className="p-[var(--spacing-lg)]">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">Line Items</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            addPricingItem(proposal.id, { name: name.trim(), description: null, quantity: 1, unitPrice: 0 })
            setName('')
          }}
          className="flex gap-[var(--spacing-sm)] mb-[var(--spacing-md)]"
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Website Development" className="flex-1" />
          <Button type="submit" variant="primary">
            Add Item
          </Button>
        </form>

        {items.length === 0 ? (
          <EmptyState title="No pricing items yet" description="Add line items to build the investment total." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[var(--text-sm)]">
              <thead>
                <tr className="text-left text-[var(--text-xs)] text-[var(--color-text-subtle)] border-b border-[var(--color-border)]">
                  <th className="py-[var(--spacing-2xs)]">Item</th>
                  <th className="w-20">Qty</th>
                  <th className="w-32">Unit Price</th>
                  <th className="w-32 text-right">Total</th>
                  <th className="w-16" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-[var(--spacing-xs)] pr-[var(--spacing-sm)]">
                      <Input value={item.name} onChange={(e) => updatePricingItem(proposal.id, item.id, { name: e.target.value })} />
                    </td>
                    <td className="pr-[var(--spacing-sm)]">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updatePricingItem(proposal.id, item.id, { quantity: Number(e.target.value) })}
                      />
                    </td>
                    <td className="pr-[var(--spacing-sm)]">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updatePricingItem(proposal.id, item.id, { unitPrice: Number(e.target.value) })}
                      />
                    </td>
                    <td className="text-right font-medium text-[var(--color-text)]">
                      {formatCurrency(lineItemTotal(item), proposal.currency)}
                    </td>
                    <td className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => deletePricingItem(proposal.id, item.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-[var(--spacing-lg)] max-w-md ml-auto">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">Discount & Tax</h3>
        <div className="grid grid-cols-2 gap-[var(--spacing-sm)] mb-[var(--spacing-md)]">
          <Field label="Discount Type">
            <select
              value={proposal.discountType}
              onChange={(e) => updateProposalFields(proposal.id, { discountType: e.target.value as 'FLAT' | 'PERCENT' })}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
            >
              <option value="FLAT">Flat amount</option>
              <option value="PERCENT">Percent</option>
            </select>
          </Field>
          <Field label="Discount Value">
            <Input
              type="number"
              step="0.01"
              value={proposal.discountValue}
              onChange={(e) => updateProposalFields(proposal.id, { discountValue: Number(e.target.value) })}
            />
          </Field>
          <Field label="Tax Rate (%)">
            <Input
              type="number"
              step="0.01"
              value={proposal.taxRatePercent}
              onChange={(e) => updateProposalFields(proposal.id, { taxRatePercent: Number(e.target.value) })}
            />
          </Field>
          <Field label="Currency">
            <Input value={proposal.currency} onChange={(e) => updateProposalFields(proposal.id, { currency: e.target.value.toUpperCase() })} />
          </Field>
        </div>

        <dl className="space-y-[var(--spacing-2xs)] text-[var(--text-sm)] border-t border-[var(--color-border)] pt-[var(--spacing-sm)]">
          <div className="flex justify-between">
            <dt className="text-[var(--color-text-muted)]">Subtotal</dt>
            <dd className="text-[var(--color-text)]">{formatCurrency(proposal.subtotal, proposal.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-text-muted)]">Discount</dt>
            <dd className="text-[var(--color-text)]">−{formatCurrency(proposal.discount, proposal.currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-text-muted)]">Tax</dt>
            <dd className="text-[var(--color-text)]">+{formatCurrency(proposal.tax, proposal.currency)}</dd>
          </div>
          <div className="flex justify-between text-[var(--text-base)] font-semibold border-t border-[var(--color-border)] pt-[var(--spacing-2xs)] mt-[var(--spacing-2xs)]">
            <dt>Total</dt>
            <dd>{formatCurrency(proposal.total, proposal.currency)}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
