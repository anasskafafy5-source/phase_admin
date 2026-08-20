function StatCard({ Icon, label, value }) {
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-lg bg-[var(--color-background)] p-3 text-[var(--color-text)]">
          <Icon className="size-6" />
        </div>
      </div>
    </article>
  )
}

export default StatCard
