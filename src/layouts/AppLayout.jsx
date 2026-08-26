import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { useSyncStore } from '@/stores/syncStore'
const NAV_ITEMS = [
  {
    to: '/',
    label: 'Dashboard',
    end: true,
  },
  {
    to: '/clients',
    label: 'Clients',
  },
  {
    to: '/projects',
    label: 'Projects',
  },
  {
    to: '/templates',
    label: 'Templates',
  },
  {
    to: '/proposals',
    label: 'Proposals',
  },
  {
    to: '/settings',
    label: 'Settings',
  },
]
function SyncIndicator() {
  const { state, isOnline } = useSyncStore()
  if (!isOnline) {
    return (
      <span className="flex items-center gap-[var(--spacing-2xs)] text-[var(--text-xs)] text-[var(--color-warning)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" />
        Offline — changes saved locally
      </span>
    )
  }
  if (state === 'saving') {
    return <span className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Saving…</span>
  }
  if (state === 'saved') {
    return <span className="text-[var(--text-xs)] text-[var(--color-text-subtle)]">Saved</span>
  }
  return null
}
export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-background)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--color-surface)] focus:px-3 focus:py-2 focus:rounded-[var(--radius-md)]"
      >
        Skip to content
      </a>

      <aside
        className="hidden md:flex md:flex-col shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)]"
        style={{
          width: 'var(--sidebar-width)',
        }}
      >
        <div className="px-[var(--spacing-lg)] py-[var(--spacing-lg)]">
          <span className="text-[var(--text-lg)] font-semibold text-[var(--color-text)]">ProposalForge</span>
          <p className="text-[var(--text-xs)] text-[var(--color-text-subtle)] mt-[var(--spacing-3xs)]">
            Built once. Used every time.
          </p>
        </div>
        <nav
          className="flex-1 px-[var(--spacing-sm)] flex flex-col gap-[var(--spacing-3xs)]"
          aria-label="Main navigation"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  'rounded-[var(--radius-md)] px-[var(--spacing-md)] py-[var(--spacing-xs)] text-[var(--text-sm)] font-medium transition-colors duration-[var(--duration-fast)]',
                  isActive
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-[var(--spacing-lg)] py-[var(--spacing-md)] border-t border-[var(--color-border)]">
          <SyncIndicator />
        </div>
      </aside>

      <header className="md:hidden flex items-center justify-between px-[var(--spacing-md)] py-[var(--spacing-sm)] border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <span className="text-[var(--text-base)] font-semibold">ProposalForge</span>
        <SyncIndicator />
      </header>

      <main id="main-content" className="flex-1 min-w-0 pb-16 md:pb-0">
        <div className="max-w-[var(--content-max-width)] mx-auto px-[var(--spacing-md)] md:px-[var(--spacing-xl)] py-[var(--spacing-lg)]">
          <Outlet />
        </div>
      </main>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-surface)] border-t border-[var(--color-border)] flex justify-around py-[var(--spacing-2xs)]"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                'text-[var(--text-xs)] px-[var(--spacing-xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-sm)]',
                isActive ? 'text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-muted)]',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
