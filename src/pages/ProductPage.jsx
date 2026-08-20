import { useParams } from 'react-router-dom'
import ProductDetails from '../features/products/ProductDetails.jsx'

function ProductPage() {
  const { id } = useParams()

  return <ProductDetails productId={id} />
}

export default ProductPage
