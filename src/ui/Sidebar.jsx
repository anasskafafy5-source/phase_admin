import { HiOutlineXMark } from 'react-icons/hi2'
import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation.js'

function Sidebar({ isMobile, isOpen, onClose }) {
  const visible = !isMobile || isOpen

  return (
    <>
      {isMobile && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 cursor-default bg-black/40"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-200 md:translate-x-0 ${visible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center border-b border-[var(--color-border)] px-5">
          <span className="text-xl font-bold tracking-tight">PHASE</span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)] md:hidden"
            aria-label="Close navigation"
          >
            <HiOutlineXMark className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navigationItems.map(({ label, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-[var(--color-primary)] text-[var(--color-surface)]' : 'text-[var(--color-text-muted)] hover:bg-[var(--color-background)] hover:text-[var(--color-text)]'}`}
            >
              <Icon className="size-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
