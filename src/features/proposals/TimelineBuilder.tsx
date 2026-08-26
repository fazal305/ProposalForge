import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field, Input, Textarea } from '@/components/FormField'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
import type { Milestone } from '@/types'

export function TimelineBuilder({ proposalId, milestones }: { proposalId: string; milestones: Milestone[] }) {
  const addMilestone = useProposalsStore((s) => s.addMilestone)
  const updateMilestone = useProposalsStore((s) => s.updateMilestone)
  const deleteMilestone = useProposalsStore((s) => s.deleteMilestone)
  const reorderMilestones = useProposalsStore((s) => s.reorderMilestones)
  const [name, setName] = useState('')

  const sorted = [...milestones].sort((a, b) => a.orderIndex - b.orderIndex)

  const move = (id: string, direction: -1 | 1) => {
    const ids = sorted.map((m) => m.id)
    const index = ids.indexOf(id)
    const target = index + direction
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    reorderMilestones(proposalId, ids)
  }

  return (
    <div className="space-y-[var(--spacing-lg)]">
      <Card className="p-[var(--spacing-lg)]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            addMilestone(proposalId, {
              name: name.trim(),
              description: null,
              startDate: null,
              endDate: null,
              durationLabel: null,
              paymentPercent: null,
            })
            setName('')
          }}
          className="flex gap-[var(--spacing-sm)]"
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Discovery & Wireframing" className="flex-1" />
          <Button type="submit" variant="primary">
            Add Milestone
          </Button>
        </form>
      </Card>

      {sorted.length === 0 ? (
        <EmptyState title="No milestones yet" description="Break the project into phases with a duration for each." />
      ) : (
        <ol className="space-y-[var(--spacing-md)]">
          {sorted.map((m, index) => (
            <li key={m.id}>
              <Card className="p-[var(--spacing-lg)] flex gap-[var(--spacing-sm)]">
                <div className="flex flex-col gap-[var(--spacing-3xs)] pt-1">
                  <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(m.id, -1)} className="text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text)] text-xs">↑</button>
                  <button type="button" aria-label="Move down" disabled={index === sorted.length - 1} onClick={() => move(m.id, 1)} className="text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text)] text-xs">↓</button>
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-[var(--spacing-sm)]">
                  <Field label="Name">
                    <Input value={m.name} onChange={(e) => updateMilestone(proposalId, m.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Duration" hint="e.g. Week 1, Weeks 3-4">
                    <Input value={m.durationLabel ?? ''} onChange={(e) => updateMilestone(proposalId, m.id, { durationLabel: e.target.value })} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Description">
                      <Textarea
                        value={m.description ?? ''}
                        onChange={(e) => updateMilestone(proposalId, m.id, { description: e.target.value })}
                        rows={2}
                      />
                    </Field>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => deleteMilestone(proposalId, m.id)}>
                  Remove
                </Button>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
