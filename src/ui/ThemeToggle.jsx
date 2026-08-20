import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? <HiOutlineSun className="size-5" /> : <HiOutlineMoon className="size-5" />}
    </button>
  )
}

export default ThemeToggle
