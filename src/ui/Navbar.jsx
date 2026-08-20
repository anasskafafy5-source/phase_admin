import { HiBars3 } from 'react-icons/hi2'
import ThemeToggle from './ThemeToggle.jsx'

function Navbar({ pageTitle, theme, onToggleTheme, onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)] md:hidden"
        aria-label="Open navigation"
      >
        <HiBars3 className="size-6" />
      </button>
      <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>
      <div className="ml-auto">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </header>
  )
}

export default Navbar
