import CategoryForm from './CategoryForm.jsx'

function AddCategoryModal({ isPending, onAddCategory, onClose }) {
  return (
    <CategoryForm
      isPending={isPending}
      onClose={onClose}
      onSubmit={onAddCategory}
      submitLabel="Add category"
      title="Add category"
    />
  )
}

export default AddCategoryModal
