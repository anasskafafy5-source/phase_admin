import { useSearchParams } from 'react-router-dom'
import Filter from '../../ui/Filter.jsx'
import Pagination from '../../ui/Pagination.jsx'
import Sort from '../../ui/Sort.jsx'
import { getProductListParams, PRODUCTS_PER_PAGE } from './productListParams.js'

const sortOptions = [
  { label: 'Newest first', value: 'created_at_desc' },
  { label: 'Oldest first', value: 'created_at_asc' },
  { label: 'Name: A to Z', value: 'name_asc' },
  { label: 'Name: Z to A', value: 'name_desc' },
  { label: 'Price: low to high', value: 'price_asc' },
  { label: 'Price: high to low', value: 'price_desc' },
]

function ProductsOperation({ categories, totalCount }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const params = getProductListParams(searchParams)
  const pageCount = Math.ceil(totalCount / PRODUCTS_PER_PAGE)

  function updateSearchParams(changes, resetPage = true) {
    const nextParams = new URLSearchParams(searchParams)

    Object.entries(changes).forEach(([key, value]) => {
      if (value) nextParams.set(key, value)
      else nextParams.delete(key)
    })
    if (resetPage) nextParams.delete('page')

    setSearchParams(nextParams)
  }

  return (
    <section className="mb-6 space-y-4">
      <Filter
        categories={categories}
        filters={params}
        onSearchChange={(search) => updateSearchParams({ search })}
        onCategoryChange={(category) => updateSearchParams({ category })}
        onStatusChange={(status) => updateSearchParams({ status })}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">{totalCount} product{totalCount === 1 ? '' : 's'}</p>
        <Sort options={sortOptions} value={params.sort} onChange={(sort) => updateSearchParams({ sort })} />
      </div>
      <Pagination
        page={params.page}
        pageCount={pageCount}
        onPageChange={(page) => updateSearchParams({ page: String(page) }, false)}
      />
    </section>
  )
}

export default ProductsOperation
