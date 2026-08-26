import { forwardRef } from 'react'
import clsx from 'clsx'
const variantClass = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] border border-transparent',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border-strong)] hover:border-[var(--color-primary)]',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] border border-transparent hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]',
  danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 border border-transparent',
}
const sizeClass = {
  sm: 'text-[var(--text-sm)] px-[var(--spacing-sm)] py-[var(--spacing-2xs)] gap-[var(--spacing-2xs)]',
  md: 'text-[var(--text-sm)] px-[var(--spacing-md)] py-[var(--spacing-xs)] gap-[var(--spacing-xs)]',
}
export const Button = forwardRef(({ variant = 'secondary', size = 'md', className, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors',
      'duration-[var(--duration-fast)] disabled:opacity-50 disabled:cursor-not-allowed',
      variantClass[variant],
      sizeClass[size],
      className,
    )}
    {...props}
  />
))
Button.displayName = 'Button'
