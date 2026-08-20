function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm text-[var(--color-text-muted)]" role="status">
      <span className="size-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}

export default Spinner
