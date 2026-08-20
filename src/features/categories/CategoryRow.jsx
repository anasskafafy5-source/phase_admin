function CategoryRow({ category }) {
  return (
    <tr className="transition-colors hover:bg-[var(--color-background)]">
      <td className="px-5 py-3">
        {category.imageUrl ? (
          <img
            src={category.imageUrl}
            alt={category.name}
            className="size-12 rounded-lg border border-[var(--color-border)] object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-lg bg-[var(--color-background)] text-xs text-[var(--color-text-muted)]">
            None
          </div>
        )}
      </td>
      <td className="px-5 py-3 font-medium">{category.name}</td>
      <td className="px-5 py-3 text-[var(--color-text-muted)]">{category.display_order}</td>
      <td className="px-5 py-3"><CategoriesAction category={category} /></td>
    </tr>
  )
}

export default CategoryRow
import CategoriesAction from './CategoriesAction.jsx'
