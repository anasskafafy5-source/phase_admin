import { useState } from 'react'
import { HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2'
import ConfirmDialog from '../../ui/ConfirmDialog.jsx'
import Modal from '../../ui/Modal.jsx'
import EditCategoryModal from './EditCategoryModal.jsx'
import { useDeleteCategory } from './useDeleteCategory.js'
import { useUpdateCategory } from './useUpdateCategory.js'

function CategoriesAction({ category }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { deleteCategory, isPending: isDeleting } = useDeleteCategory({
    onSuccess: () => setIsDeleteOpen(false),
  })
  const { isPending: isUpdating, updateCategory } = useUpdateCategory({
    onSuccess: () => setIsEditOpen(false),
  })

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
          aria-label={`Edit ${category.name}`}
          title="Edit category"
        >
          <HiOutlinePencilSquare className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)]"
          aria-label={`Delete ${category.name}`}
          title="Delete category"
        >
          <HiOutlineTrash className="size-5" />
        </button>
      </div>
      <Modal isOpen={isEditOpen} isPending={isUpdating} onClose={() => setIsEditOpen(false)}>
        <EditCategoryModal category={category} isPending={isUpdating} onUpdateCategory={updateCategory} />
      </Modal>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        isPending={isDeleting}
        title="Delete category?"
        message={`This will permanently delete ${category.name}. This action cannot be undone.`}
        confirmLabel="Delete category"
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => deleteCategory(category)}
      />
    </>
  )
}

export default CategoriesAction
