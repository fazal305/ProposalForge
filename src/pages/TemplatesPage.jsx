import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/PageHeader'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Field, Input } from '@/components/FormField'
import { useTemplatesStore } from '@/stores/templatesStore'
export function TemplatesPage() {
  const templates = useTemplatesStore((s) => s.templates)
  const addTemplate = useTemplatesStore((s) => s.addTemplate)
  const duplicateTemplate = useTemplatesStore((s) => s.duplicateTemplate)
  const deleteTemplate = useTemplatesStore((s) => s.deleteTemplate)
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  return (
    <div>
      <PageHeader
        title="Template Manager"
        description="Build once, reuse for every client. Static sections stay the same; dynamic ones fill in per project."
        actions={
          !showForm && (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              New Template
            </Button>
          )
        }
      />

      {showForm && (
        <Card className="p-[var(--spacing-lg)] mb-[var(--spacing-lg)]">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim()) return
              const t = addTemplate(name.trim())
              setShowForm(false)
              setName('')
              navigate(`/templates/${t.id}`)
            }}
            className="flex items-end gap-[var(--spacing-md)]"
          >
            <div className="flex-1">
              <Field label="Template Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mobile App Proposal"
                  autoFocus
                />
              </Field>
            </div>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create & Edit
            </Button>
          </form>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
        {templates.map((t) => (
          <Card key={t.id} className="p-[var(--spacing-lg)] flex flex-col">
            <div className="flex items-start justify-between gap-[var(--spacing-sm)]">
              <div className="min-w-0">
                <h2 className="text-[var(--text-base)] font-semibold text-[var(--color-text)] truncate">{t.name}</h2>
                {t.isDefault && (
                  <span className="text-[var(--text-xs)] text-[var(--color-primary)]">Default template</span>
                )}
              </div>
            </div>
            {t.description && (
              <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-[var(--spacing-xs)] flex-1">
                {t.description}
              </p>
            )}
            <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)] mt-[var(--spacing-sm)]">
              {t.sections.length} sections
            </p>
            <div className="flex gap-[var(--spacing-xs)] mt-[var(--spacing-md)]">
              <Link to={`/templates/${t.id}`} className="flex-1">
                <Button variant="secondary" className="w-full">
                  Edit
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => duplicateTemplate(t.id)} title="Duplicate">
                Duplicate
              </Button>
              {!t.isDefault && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (confirm(`Delete template "${t.name}"?`)) deleteTemplate(t.id)
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
