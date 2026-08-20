import ProductsForm from './ProductsForm.jsx'

function AddProductModal({ categories, isPending, onAddProduct, onClose }) {
  return <ProductsForm categories={categories} isPending={isPending} onClose={onClose} onSubmit={onAddProduct} />
}

export default AddProductModal
