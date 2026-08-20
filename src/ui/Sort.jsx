function Sort({ label = 'Sort by', onChange, options, value }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
      <span className="whitespace-nowrap">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="form-field !mt-0 min-w-44" aria-label={label}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

export default Sort
