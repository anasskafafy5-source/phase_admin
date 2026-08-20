const variants = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-surface)] hover:bg-[var(--color-primary-hover)]',
  secondary: 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-background)]',
}

function Button({ children, className = '', disabled = false, type = 'button', variant = 'primary', ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
