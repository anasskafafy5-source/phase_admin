export const PRODUCTS_PER_PAGE = 10

export function getProductListParams(searchParams) {
  const page = Number(searchParams.get('page'))

  return {
    category: searchParams.get('category') || '',
    page: Number.isInteger(page) && page > 0 ? page : 1,
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'created_at_desc',
    status: searchParams.get('status') || '',
  }
}
