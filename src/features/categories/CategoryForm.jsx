import { useForm } from 'react-hook-form'
import Button from '../../ui/Button.jsx'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function CategoryForm({ category, isPending, onClose, onSubmit, submitLabel, title }) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      displayOrder: category?.display_order ?? 0,
      name: category?.name ?? '',
    },
  })
  const isNewCategory = !category

  function submitForm({ displayOrder, image, name }) {
    onSubmit({ displayOrder, image: image?.[0], name: name.trim() })
  }

  return (
    <form className="space-y-5 p-5" onSubmit={handleSubmit(submitForm)}>
      <div className="border-b border-[var(--color-border)] pb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <label className="block text-sm font-medium">
        Name
        <input
          type="text"
          autoFocus
          disabled={isPending}
          className="form-field"
          {...register('name', { required: 'Enter a category name.' })}
        />
        {errors.name && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.name.message}</span>}
      </label>
      <label className="block text-sm font-medium">
        Image {!isNewCategory && <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>}
        <input
          type="file"
          accept="image/*"
          disabled={isPending}
          className="form-file-field"
          {...register('image', {
            required: isNewCategory ? 'Choose a category image.' : false,
            validate: {
              fileType: (files) => !files?.length || files[0].type.startsWith('image/') || 'Choose a valid image file.',
              fileSize: (files) => !files?.length || files[0].size <= MAX_IMAGE_SIZE || 'Image must be smaller than 5 MB.',
            },
          })}
        />
        {errors.image && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.image.message}</span>}
      </label>
      <label className="block text-sm font-medium">
        Display order
        <input
          type="number"
          min="0"
          disabled={isPending}
          className="form-field"
          {...register('displayOrder', {
            min: { value: 0, message: 'Display order cannot be negative.' },
            required: 'Enter a display order.',
            valueAsNumber: true,
          })}
        />
        {errors.displayOrder && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.displayOrder.message}</span>}
      </label>
      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="secondary" disabled={isPending} onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : submitLabel}</Button>
      </div>
    </form>
  )
}

export default CategoryForm
