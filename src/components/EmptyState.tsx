import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-[var(--spacing-3xl)] px-[var(--spacing-lg)]">
      <p className="text-[var(--text-lg)] font-medium text-[var(--color-text)]">{title}</p>
      {description && <p className="mt-[var(--spacing-2xs)] text-[var(--text-sm)] text-[var(--color-text-muted)] max-w-sm">{description}</p>}
      {action && <div className="mt-[var(--spacing-md)]">{action}</div>}
    </div>
  )
}
