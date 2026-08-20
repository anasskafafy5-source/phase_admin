import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2'

function Pagination({ onPageChange, page, pageCount }) {
  if (pageCount <= 1) return null

  return (
    <nav className="flex items-center justify-between gap-3" aria-label="Pagination">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <HiOutlineChevronLeft className="size-4" /> Previous
      </button>
      <span className="text-sm text-[var(--color-text-muted)]">Page {page} of {pageCount}</span>
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next <HiOutlineChevronRight className="size-4" />
      </button>
    </nav>
  )
}

export default Pagination
