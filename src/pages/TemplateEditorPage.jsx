import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field, Input, Textarea } from '@/components/FormField'
import { VariablePicker } from '@/components/VariablePicker'
import { MarkdownLite } from '@/lib/markdownLite'
import { EmptyState } from '@/components/EmptyState'
import { useTemplatesStore } from '@/stores/templatesStore'
function SectionEditor({ templateId, section }) {
  const updateSection = useTemplatesStore((s) => s.updateSection)
  const deleteSection = useTemplatesStore((s) => s.deleteSection)
  const duplicateSection = useTemplatesStore((s) => s.duplicateSection)
  const [previewing, setPreviewing] = useState(false)
  const textareaRef = useRef(null)
  const insertVariable = (token) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? section.contentMd.length
    const end = el.selectionEnd ?? section.contentMd.length
    const next = section.contentMd.slice(0, start) + token + section.contentMd.slice(end)
    updateSection(templateId, section.id, {
      contentMd: next,
    })
    requestAnimationFrame(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = start + token.length
    })
  }
  return (
    <Card className={`p-[var(--spacing-lg)] ${section.enabled ? '' : 'opacity-60'}`}>
      <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-sm)] mb-[var(--spacing-sm)]">
        <div className="flex items-center gap-[var(--spacing-sm)] flex-1 min-w-[200px]">
          <Input
            value={section.title}
            onChange={(e) =>
              updateSection(templateId, section.id, {
                title: e.target.value,
              })
            }
            aria-label="Section title"
            className="font-medium"
          />
          <select
            value={section.type}
            onChange={(e) =>
              updateSection(templateId, section.id, {
                type: e.target.value,
              })
            }
            aria-label="Section type"
            className="rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)]"
          >
            <option value="STATIC">Static</option>
            <option value="DYNAMIC">Dynamic</option>
          </select>
        </div>
        <div className="flex items-center gap-[var(--spacing-2xs)]">
          <Button size="sm" variant="ghost" onClick={() => setPreviewing((p) => !p)}>
            {previewing ? 'Edit' : 'Preview'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => duplicateSection(templateId, section.id)}>
            Duplicate
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              updateSection(templateId, section.id, {
                enabled: !section.enabled,
              })
            }
          >
            {section.enabled ? 'Disable' : 'Enable'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm(`Delete section "${section.title}"?`)) deleteSection(templateId, section.id)
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {previewing ? (
        <div className="prose-sm text-[var(--text-sm)] text-[var(--color-text)] border border-dashed border-[var(--color-border)] rounded-[var(--radius-md)] p-[var(--spacing-md)]">
          <MarkdownLite content={section.contentMd} />
        </div>
      ) : (
        <>
          <div className="mb-[var(--spacing-xs)]">
            <VariablePicker onInsert={insertVariable} />
          </div>
          <Textarea
            ref={textareaRef}
            value={section.contentMd}
            onChange={(e) =>
              updateSection(templateId, section.id, {
                contentMd: e.target.value,
              })
            }
            rows={5}
            aria-label={`${section.title} content`}
          />
        </>
      )}
    </Card>
  )
}
export function TemplateEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const template = useTemplatesStore((s) => s.templates.find((t) => t.id === id))
  const updateTemplateMeta = useTemplatesStore((s) => s.updateTemplateMeta)
  const addSection = useTemplatesStore((s) => s.addSection)
  const reorderSections = useTemplatesStore((s) => s.reorderSections)
  if (!template) {
    return (
      <EmptyState
        title="Template not found"
        action={
          <Link to="/templates">
            <Button variant="primary">Back to Templates</Button>
          </Link>
        }
      />
    )
  }
  const sorted = [...template.sections].sort((a, b) => a.orderIndex - b.orderIndex)
  const move = (sectionId, direction) => {
    const ids = sorted.map((s) => s.id)
    const index = ids.indexOf(sectionId)
    const target = index + direction
    if (target < 0 || target >= ids.length) return
    ;[ids[index], ids[target]] = [ids[target], ids[index]]
    reorderSections(template.id, ids)
  }
  return (
    <div>
      <PageHeader
        title={template.name}
        description="Reusable sections for this template. Static sections repeat as-is; dynamic ones pull in project variables."
        actions={
          <Button
            variant="primary"
            onClick={() =>
              addSection(template.id, {
                key: `custom_${Date.now()}`,
                title: 'New Section',
                type: 'STATIC',
                contentMd: '',
                enabled: true,
              })
            }
          >
            Add Section
          </Button>
        }
      />

      <Card className="p-[var(--spacing-lg)] mb-[var(--spacing-lg)] grid sm:grid-cols-2 gap-[var(--spacing-md)]">
        <Field label="Template Name">
          <Input
            value={template.name}
            onChange={(e) =>
              updateTemplateMeta(template.id, {
                name: e.target.value,
              })
            }
          />
        </Field>
        <Field label="Description">
          <Input
            value={template.description ?? ''}
            onChange={(e) =>
              updateTemplateMeta(template.id, {
                description: e.target.value,
              })
            }
          />
        </Field>
      </Card>

      <div className="space-y-[var(--spacing-md)]">
        {sorted.map((section, index) => (
          <div key={section.id} className="flex gap-[var(--spacing-sm)]">
            <div className="flex flex-col gap-[var(--spacing-3xs)] pt-[var(--spacing-lg)]">
              <button
                type="button"
                aria-label="Move section up"
                disabled={index === 0}
                onClick={() => move(section.id, -1)}
                className="text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text)]"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move section down"
                disabled={index === sorted.length - 1}
                onClick={() => move(section.id, 1)}
                className="text-[var(--color-text-muted)] disabled:opacity-30 hover:text-[var(--color-text)]"
              >
                ↓
              </button>
            </div>
            <div className="flex-1">
              <SectionEditor templateId={template.id} section={section} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[var(--spacing-lg)]">
        <Button variant="ghost" onClick={() => navigate('/templates')}>
          ← Back to Templates
        </Button>
      </div>
    </div>
  )
}
