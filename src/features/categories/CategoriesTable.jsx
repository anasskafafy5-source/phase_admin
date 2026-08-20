import CategoryRow from './CategoryRow.jsx'

function CategoriesTable({ categories }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          <tr>
            <th className="px-5 py-3 font-medium">Image</th>
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Display order</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {categories.map((category) => <CategoryRow key={category.id} category={category} />)}
        </tbody>
      </table>
    </div>
  )
}

export default CategoriesTable
