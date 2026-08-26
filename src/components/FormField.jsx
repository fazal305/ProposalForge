import { forwardRef } from 'react'
import clsx from 'clsx'
const fieldClass =
  'w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] ' +
  'px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-sm)] text-[var(--color-text)] ' +
  'placeholder:text-[var(--color-text-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]'
export const Input = forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={clsx(fieldClass, className)} {...props} />
))
Input.displayName = 'Input'
export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea ref={ref} className={clsx(fieldClass, 'min-h-24 resize-y', className)} {...props} />
))
Textarea.displayName = 'Textarea'
export function Field({ label, htmlFor, error, hint, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-[var(--text-sm)] font-medium text-[var(--color-text)] mb-[var(--spacing-2xs)]">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="block mt-[var(--spacing-3xs)] text-[var(--text-xs)] text-[var(--color-text-subtle)]">
          {hint}
        </span>
      )}
      {error && (
        <span role="alert" className="block mt-[var(--spacing-3xs)] text-[var(--text-xs)] text-[var(--color-danger)]">
          {error}
        </span>
      )}
    </label>
  )
}
