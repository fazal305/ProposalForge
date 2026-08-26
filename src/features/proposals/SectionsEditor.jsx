import { useRef, useState } from 'react'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Textarea } from '@/components/FormField'
import { VariablePicker } from '@/components/VariablePicker'
import { MarkdownLite } from '@/lib/markdownLite'
import { resolveVariables } from '@/lib/variables'
import { useProposalsStore } from '@/stores/proposalsStore'
function SectionRow({ proposalId, section, context }) {
  const updateSection = useProposalsStore((s) => s.updateSection)
  const [previewing, setPreviewing] = useState(false)
  const textareaRef = useRef(null)
  const insertVariable = (token) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? section.contentMd.length
    const end = el.selectionEnd ?? section.contentMd.length
    const next = section.contentMd.slice(0, start) + token + section.contentMd.slice(end)
    updateSection(proposalId, section.id, next)
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + token.length
    })
  }
  return (
    <Card className="p-[var(--spacing-lg)]">
      <div className="flex items-center justify-between mb-[var(--spacing-sm)]">
        <h3 className="text-[var(--text-base)] font-semibold text-[var(--color-text)]">{section.title}</h3>
        <Button size="sm" variant="ghost" onClick={() => setPreviewing((p) => !p)}>
          {previewing ? 'Edit' : 'Preview'}
        </Button>
      </div>
      {previewing ? (
        <div className="text-[var(--text-sm)] text-[var(--color-text)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] p-[var(--spacing-md)]">
          <MarkdownLite content={resolveVariables(section.contentMd, context)} />
        </div>
      ) : (
        <>
          <div className="mb-[var(--spacing-xs)]">
            <VariablePicker onInsert={insertVariable} />
          </div>
          <Textarea
            ref={textareaRef}
            value={section.contentMd}
            onChange={(e) => updateSection(proposalId, section.id, e.target.value)}
            rows={5}
            aria-label={`${section.title} content`}
          />
        </>
      )}
    </Card>
  )
}
export function SectionsEditor({ proposalId, sections, context }) {
  const sorted = [...sections].sort((a, b) => a.orderIndex - b.orderIndex)
  return (
    <div className="space-y-[var(--spacing-md)]">
      {sorted.map((section) => (
        <SectionRow key={section.id} proposalId={proposalId} section={section} context={context} />
      ))}
    </div>
  )
}
