import { useState } from 'react'
import { VARIABLE_PICKER } from '@/lib/variables'
import { Button } from '@/components/Button'
export function VariablePicker({ onInsert }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <Button
        type="button"
        size="sm"
        variant="secondary"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Insert Variable
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute z-10 mt-[var(--spacing-2xs)] w-64 max-h-72 overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] p-[var(--spacing-2xs)]"
        >
          {VARIABLE_PICKER.map((group) => (
            <div key={group.groupLabel} className="mb-[var(--spacing-2xs)]">
              <p className="px-[var(--spacing-xs)] py-[var(--spacing-3xs)] text-[var(--text-xs)] font-semibold text-[var(--color-text-subtle)] uppercase tracking-wide">
                {group.groupLabel}
              </p>
              {group.variables.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onInsert(`{{${v.key}}}`)
                    setOpen(false)
                  }}
                  className="w-full text-left px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-sm)] text-[var(--text-sm)] text-[var(--color-text)] hover:bg-[var(--color-background)]"
                >
                  {v.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
