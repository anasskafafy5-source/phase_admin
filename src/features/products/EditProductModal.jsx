import ProductsForm from './ProductsForm.jsx'

function EditProductModal({ categories, isPending, onClose, onUpdateProduct, product }) {
  function submitProduct(values) {
    onUpdateProduct({ ...values, product })
  }

  return <ProductsForm categories={categories} isPending={isPending} onClose={onClose} onSubmit={submitProduct} product={product} />
}

export default EditProductModal
