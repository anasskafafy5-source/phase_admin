import BackButton from '../../ui/BackButton.jsx'
import Spinner from '../../ui/Spinner.jsx'
import { useNavigate } from 'react-router-dom'
import { useGetCategories } from '../categories/useGetCategories.js'
import ProductsAction from './ProductsAction.jsx'
import { useGetProduct } from './useGetProduct.js'

function ProductDetails({ productId }) {
  const navigate = useNavigate()
  const { data: categories = [] } = useGetCategories()
  const { data: product, error, isError, isLoading } = useGetProduct(productId)

  if (isLoading) return <Spinner label="Loading product" />
  if (isError) return <p className="text-sm text-[var(--color-danger)]">{error.message || 'Unable to load product.'}</p>

  const effectivePrice = product.discount_price ?? product.price

  return (
    <div className="space-y-8">
      <BackButton />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {product.product_images.length ? product.product_images.map((image) => (
            <img key={image.id} src={image.imageUrl} alt={product.name} className="aspect-square w-full rounded-xl border border-[var(--color-border)] object-cover" />
          )) : <div className="col-span-full aspect-video rounded-xl bg-[var(--color-surface)]" />}
        </div>
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">{product.categories?.name || 'Uncategorized'}</p>
              <h2 className="mt-1 text-2xl font-semibold">{product.name}</h2>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_active ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]' : 'bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]'}`}>{product.is_active ? 'Active' : 'Inactive'}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_best_seller ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]' : 'bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)]'}`}>{product.is_best_seller ? 'Best seller' : 'Standard product'}</span>
            </div>
          </div>
          <div className="mt-4 border-t border-[var(--color-border)] pt-3">
            <ProductsAction
              categories={categories}
              product={product}
              showView={false}
              onDeleteSuccess={() => navigate('/products')}
            />
          </div>
          <p className="mt-5 text-sm text-[var(--color-text-muted)]">Selling price</p>
          <p className="mt-1 text-xl font-semibold">{effectivePrice}</p>
          {product.discount_price && <p className="mt-1 text-sm text-[var(--color-text-muted)]">Regular price: <span className="line-through">{product.price}</span></p>}
          {product.description && <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-muted)]">{product.description}</p>}
        </section>
      </div>
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h3 className="font-semibold">Variants</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.product_variants.map((variant) => (
            <span key={variant.id} className={`rounded-lg border px-3 py-2 text-sm ${variant.is_sold_out ? 'border-[var(--color-danger)]/30 text-[var(--color-danger)]' : 'border-[var(--color-border)] text-[var(--color-text)]'}`}>
              {variant.size}{variant.is_sold_out ? ' · Sold out' : ''}
            </span>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ProductDetails
