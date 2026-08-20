import ProductsAction from './ProductsAction.jsx'

function ProductRow({ categories, product }) {
  const coverImage = product.product_images[0]
  const activeVariants = product.product_variants.filter((variant) => !variant.is_sold_out).length
  const price = product.discount_price ?? product.price

  return (
    <tr className="transition-colors hover:bg-[var(--color-background)]">
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          {coverImage ? (
            <img
              src={coverImage.imageUrl}
              alt=""
              className="size-12 rounded-lg border border-[var(--color-border)] object-cover"
            />
          ) : (
            <div className="size-12 rounded-lg bg-[var(--color-background)]" />
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      </td>
      <td className="px-5 py-3 text-[var(--color-text-muted)]">{product.categories?.name || 'Uncategorized'}</td>
      <td className="px-5 py-3">
        <span className="font-medium">{price}</span>
        {product.discount_price && <span className="ml-2 text-xs text-[var(--color-text-muted)] line-through">{product.price}</span>}
      </td>
      <td className="px-5 py-3 text-[var(--color-text-muted)]">
        {activeVariants} available / {product.product_variants.length} total
      </td>
      <td className="px-5 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_active ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]'}`}>
          {product.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-5 py-3">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_best_seller ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]' : 'bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]'}`}>
          {product.is_best_seller ? 'Best seller' : 'Standard'}
        </span>
      </td>
      <td className="px-5 py-3"><ProductsAction categories={categories} product={product} /></td>
    </tr>
  )
}

export default ProductRow
