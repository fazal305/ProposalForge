import clsx from 'clsx'
export function Card({ className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)]',
        className,
      )}
      {...props}
    />
  )
}
