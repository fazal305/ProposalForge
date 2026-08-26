export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-[var(--spacing-md)] mb-[var(--spacing-lg)]">
      <div>
        <h1 className="text-[var(--text-2xl)] font-semibold text-[var(--color-text)]">{title}</h1>
        {description && (
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-[var(--spacing-3xs)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-[var(--spacing-xs)]">{actions}</div>}
    </div>
  )
}
