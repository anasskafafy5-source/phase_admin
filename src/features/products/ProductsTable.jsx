import ProductRow from './ProductRow.jsx'

function ProductsTable({ categories, products }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-background)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          <tr>
            <th className="px-5 py-3 font-medium">Product</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Selling price</th>
            <th className="px-5 py-3 font-medium">Variants</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Best seller</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {products.map((product) => <ProductRow key={product.id} categories={categories} product={product} />)}
        </tbody>
      </table>
    </div>
  )
}

export default ProductsTable
