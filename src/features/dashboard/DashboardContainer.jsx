import {
  HiOutlineCheckCircle,
  HiOutlineFolder,
  HiOutlinePlus,
  HiOutlineShoppingBag,
  HiOutlineXCircle,
} from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import Spinner from '../../ui/Spinner.jsx'
import StatCard from '../../ui/StatCard.jsx'
import { useGetDashboardStats } from './useGetDashboardStats.js'

function DashboardContainer() {
  const { data: stats, error, isError, isLoading } = useGetDashboardStats()

  if (isLoading) return <Spinner label="Loading dashboard" />

  if (isError) {
    return (
      <p className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
        {error.message || 'Unable to load dashboard data.'}
      </p>
    )
  }

  const cards = [
    { Icon: HiOutlineShoppingBag, label: 'Total products', value: stats.totalProducts },
    { Icon: HiOutlineCheckCircle, label: 'Active products', value: stats.activeProducts },
    { Icon: HiOutlineFolder, label: 'Categories', value: stats.totalCategories },
    { Icon: HiOutlineXCircle, label: 'Sold-out variants', value: stats.soldOutVariants },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Store overview</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      </section>
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <QuickAction to="/products" label="Add new product" />
          <QuickAction to="/categories" label="Add new category" />
        </div>
      </section>
    </div>
  )
}

function QuickAction({ label, to }) {
  return (
    <Link
      to={to}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--color-surface)] transition-colors hover:bg-[var(--color-primary-hover)]"
    >
      <HiOutlinePlus className="size-5" />
      {label}
    </Link>
  )
}

export default DashboardContainer
