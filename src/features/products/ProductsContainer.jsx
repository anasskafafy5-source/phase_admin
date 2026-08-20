import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '../../ui/Button.jsx'
import Modal from '../../ui/Modal.jsx'
import Spinner from '../../ui/Spinner.jsx'
import AddProductModal from './AddProductModal.jsx'
import ProductsOperation from './ProductsOperation.jsx'
import ProductsTable from './ProductsTable.jsx'
import { getProductListParams, PRODUCTS_PER_PAGE } from './productListParams.js'
import { useAddProduct } from './useAddProduct.js'
import { useGetProducts } from './useGetProducts.js'
import { useGetCategories } from '../categories/useGetCategories.js'

function ProductsContainer() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchParams] = useSearchParams()
  const listParams = getProductListParams(searchParams)
  const { addProduct, isPending: isAddingProduct } = useAddProduct({
    onSuccess: () => setIsAddModalOpen(false),
  })
  const { data: categories = [] } = useGetCategories()
  const { data, error, isError, isLoading } = useGetProducts({ ...listParams, pageSize: PRODUCTS_PER_PAGE })
  const products = data?.products || []
  const totalCount = data?.count || 0

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setIsAddModalOpen(true)}>Add product</Button>
      </div>
      <ProductsOperation categories={categories} totalCount={totalCount} />
      {isLoading && <Spinner label="Loading products" />}
      {isError && (
        <p className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
          {error.message || 'Unable to load products.'}
        </p>
      )}
      {!isLoading && !isError && !products.length && (
        <p className="text-sm text-[var(--color-text-muted)]">
          {totalCount ? 'No products match the current filters.' : 'No products have been created yet.'}
        </p>
      )}
      {!isLoading && !isError && products.length > 0 && <ProductsTable categories={categories} products={products} />}
      <Modal isOpen={isAddModalOpen} isPending={isAddingProduct} onClose={() => setIsAddModalOpen(false)}>
        <AddProductModal categories={categories} isPending={isAddingProduct} onAddProduct={addProduct} />
      </Modal>
    </>
  )
}

export default ProductsContainer
