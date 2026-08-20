import { useState } from 'react'
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../../ui/ConfirmDialog.jsx'
import Modal from '../../ui/Modal.jsx'
import EditProductModal from './EditProductModal.jsx'
import { useDeleteProduct } from './useDeleteProduct.js'
import { useUpdateProduct } from './useUpdateProduct.js'

function ProductsAction({ categories, onDeleteSuccess, product, showView = true }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { deleteProduct, isPending: isDeleting } = useDeleteProduct({
    onSuccess: () => {
      setIsDeleteOpen(false)
      onDeleteSuccess?.()
    },
  })
  const { isPending: isUpdating, updateProduct } = useUpdateProduct({ onSuccess: () => setIsEditOpen(false) })

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {showView && (
          <Link
            to={`/products/${product.id}`}
            className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
            aria-label={`View ${product.name}`}
            title="View product"
          >
            <HiOutlineEye className="size-5" />
          </Link>
        )}
        <button type="button" onClick={() => setIsEditOpen(true)} className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]" aria-label={`Edit ${product.name}`} title="Edit product">
          <HiOutlinePencilSquare className="size-5" />
        </button>
        <button type="button" onClick={() => setIsDeleteOpen(true)} className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]" aria-label={`Delete ${product.name}`} title="Delete product">
          <HiOutlineTrash className="size-5" />
        </button>
      </div>
      <Modal isOpen={isEditOpen} isPending={isUpdating} onClose={() => setIsEditOpen(false)}>
        <EditProductModal categories={categories} isPending={isUpdating} onUpdateProduct={updateProduct} product={product} />
      </Modal>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        isPending={isDeleting}
        title="Delete product?"
        message={`This will permanently delete ${product.name}, its variants, and its images.`}
        confirmLabel="Delete product"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteProduct(product)}
      />
    </>
  )
}

export default ProductsAction
