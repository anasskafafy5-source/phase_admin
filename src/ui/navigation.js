import {
  HiOutlineChartBarSquare,
  HiOutlineCog6Tooth,
  HiOutlineFolder,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
} from 'react-icons/hi2'

export const navigationItems = [
  { label: 'Dashboard', to: '/dashboard', Icon: HiOutlineSquares2X2 },
  { label: 'Products', to: '/products', Icon: HiOutlineChartBarSquare },
  { label: 'Categories', to: '/categories', Icon: HiOutlineFolder },
  { label: 'Accounts', to: '/accounts', Icon: HiOutlineUserGroup },
  { label: 'Settings', to: '/settings', Icon: HiOutlineCog6Tooth },
]

export function getPageTitle(pathname) {
  if (pathname === '/products/new') return 'Add Product'
  if (pathname.endsWith('/edit')) return 'Edit Product'

  return navigationItems.find((item) => item.to === pathname)?.label || 'PHASE Admin'
}
