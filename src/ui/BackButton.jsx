import { HiOutlineArrowLeft } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'

function BackButton({ fallbackTo = '/products', label = 'Back' }) {
  const navigate = useNavigate()

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(fallbackTo)
  }

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
    >
      <HiOutlineArrowLeft className="size-5" />
      {label}
    </button>
  )
}

export default BackButton
