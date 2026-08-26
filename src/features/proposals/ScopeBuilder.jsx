import { useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field, Input, Textarea } from '@/components/FormField'
import { EmptyState } from '@/components/EmptyState'
import { useProposalsStore } from '@/stores/proposalsStore'
function groupBy(items) {
  const map = new Map()
  for (const item of [...items].sort((a, b) => a.orderIndex - b.orderIndex)) {
    const list = map.get(item.groupTitle) ?? []
    list.push(item)
    map.set(item.groupTitle, list)
  }
  return [...map.entries()]
}
export function ScopeBuilder({ proposalId, scopeItems }) {
  const addScopeItem = useProposalsStore((s) => s.addScopeItem)
  const updateScopeItem = useProposalsStore((s) => s.updateScopeItem)
  const deleteScopeItem = useProposalsStore((s) => s.deleteScopeItem)
  const reorderScopeItems = useProposalsStore((s) => s.reorderScopeItems)
  const [groupTitle, setGroupTitle] = useState('')
  const [title, setTitle] = useState('')
  const groups = groupBy(scopeItems)
  const move = (id, direction) => {
    const ids = [...scopeItems].sort((a, b) => a.orderIndex - b.orderIndex).map((i) => i.id)
    const index = ids.indexOf(id)
    const target = index + direction
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    reorderScopeItems(proposalId, ids)
  }
  return (
    <div className="space-y-[var(--spacing-lg)]">
      <Card className="p-[var(--spacing-lg)]">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">
          Add Scope Item
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!groupTitle.trim() || !title.trim()) return
            addScopeItem(proposalId, {
              groupTitle: groupTitle.trim(),
              title: title.trim(),
              description: null,
              quantity: 1,
              unit: 'item',
              unitPrice: null,
              notes: null,
              included: true,
            })
            setTitle('')
          }}
          className="grid sm:grid-cols-2 gap-[var(--spacing-sm)] items-end"
        >
          <Field label="Group" hint="e.g. Authentication, Admin Dashboard">
            <Input value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)} placeholder="Authentication" />
          </Field>
          <Field label="Item">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Google OAuth" />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary">
              Add Item
            </Button>
          </div>
        </form>
      </Card>

      {groups.length === 0 ? (
        <EmptyState
          title="No scope items yet"
          description="Add grouped scope items above to build out what's included."
        />
      ) : (
        groups.map(([group, items]) => (
          <Card key={group} className="p-[var(--spacing-lg)]">
            <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text)] mb-[var(--spacing-sm)]">
              {group}
            </h3>
            <ul className="space-y-[var(--spacing-sm)]">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-[var(--spacing-sm)] border-t border-[var(--color-border)] pt-[var(--spacing-sm)] first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-col gap-[var(--spacing-3xs)] pt-1">
                    <button
                      type="button"
                      aria-label="Move up"
                      onClick={() => move(item.id, -1)}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      aria-label="Move down"
                      onClick={() => move(item.id, 1)}
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs"
                    >
                      ↓
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={item.included}
                    onChange={(e) =>
                      updateScopeItem(proposalId, item.id, {
                        included: e.target.checked,
                      })
                    }
                    aria-label={`Include ${item.title}`}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        updateScopeItem(proposalId, item.id, {
                          title: e.target.value,
                        })
                      }
                      className={item.included ? '' : 'line-through text-[var(--color-text-subtle)]'}
                    />
                    <Textarea
                      value={item.description ?? ''}
                      onChange={(e) =>
                        updateScopeItem(proposalId, item.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Optional description or notes"
                      rows={1}
                      className="mt-[var(--spacing-2xs)] text-[var(--text-xs)]"
                    />
                  </div>
                  <div className="flex items-center gap-[var(--spacing-2xs)] shrink-0">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateScopeItem(proposalId, item.id, {
                          quantity: Number(e.target.value),
                        })
                      }
                      className="w-16"
                      aria-label="Quantity"
                    />
                    <Input
                      value={item.unit}
                      onChange={(e) =>
                        updateScopeItem(proposalId, item.id, {
                          unit: e.target.value,
                        })
                      }
                      className="w-20"
                      aria-label="Unit"
                    />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteScopeItem(proposalId, item.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
        ))
      )}
    </div>
  )
}
