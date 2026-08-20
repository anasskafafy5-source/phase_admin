function Filter({ categories, filters, onCategoryChange, onSearchChange, onStatusChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <input
        type="search"
        value={filters.search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search products"
        className="form-field !mt-0"
        aria-label="Search products"
      />
      <select value={filters.category} onChange={(event) => onCategoryChange(event.target.value)} className="form-field !mt-0" aria-label="Filter by category">
        <option value="">All categories</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
      </select>
      <select value={filters.status} onChange={(event) => onStatusChange(event.target.value)} className="form-field !mt-0" aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  )
}

export default Filter
