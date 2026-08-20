import CategoryForm from './CategoryForm.jsx'

function EditCategoryModal({ category, isPending, onClose, onUpdateCategory }) {
  function submitCategory(values) {
    onUpdateCategory({ category, ...values })
  }

  return (
    <CategoryForm
      category={category}
      isPending={isPending}
      onClose={onClose}
      onSubmit={submitCategory}
      submitLabel="Save changes"
      title="Edit category"
    />
  )
}

export default EditCategoryModal
