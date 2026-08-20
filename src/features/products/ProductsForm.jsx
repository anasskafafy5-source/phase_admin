import { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { HiOutlinePlus, HiOutlineTrash, HiOutlineXMark } from 'react-icons/hi2'
import Button from '../../ui/Button.jsx'

const MAX_IMAGES = 3

function ProductsForm({ categories, isPending, onClose, onSubmit, product }) {
  const [imageIdsToRemove, setImageIdsToRemove] = useState([])
  const [variantIdsToRemove, setVariantIdsToRemove] = useState([])
  const {
    control,
    clearErrors,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      categoryId: product?.category_id ?? '',
      description: product?.description ?? '',
      discountPrice: product?.discount_price ?? '',
      isActive: product?.is_active ?? true,
      isBestSeller: product?.is_best_seller ?? false,
      images: [],
      name: product?.name ?? '',
      price: product?.price ?? '',
      variants: product?.product_variants ?? [{ is_sold_out: false, size: '' }],
    },
  })
  const { append, fields, remove } = useFieldArray({ control, name: 'variants' })
  const selectedImages = useWatch({ control, name: 'images' }) || []
  const retainedImageCount = (product?.product_images.length || 0) - imageIdsToRemove.length
  const maxNewImages = 3 - retainedImageCount

  function submitForm({ images, ...values }) {
    onSubmit({
      ...values,
      images: Array.from(images || []),
      imageIdsToRemove,
      variantIdsToRemove,
    })
  }

  function removeVariant(index) {
    const variant = fields[index]
    if (variant.id) setVariantIdsToRemove((ids) => [...ids, variant.id])
    remove(index)
  }

  function addImages(event) {
    const newImages = Array.from(event.target.files || [])
    const allImages = [...selectedImages, ...newImages]

    if (allImages.length > maxNewImages) {
      setError('images', { message: `You can add ${maxNewImages} more image${maxNewImages === 1 ? '' : 's'}.` })
      event.target.value = ''
      return
    }

    if (newImages.some((image) => !image.type.startsWith('image/'))) {
      setError('images', { message: 'Choose only image files.' })
      event.target.value = ''
      return
    }

    setValue('images', allImages, { shouldValidate: true })
    clearErrors('images')
    event.target.value = ''
  }

  function removeNewImage(index) {
    setValue('images', selectedImages.filter((_, imageIndex) => imageIndex !== index), { shouldValidate: true })
    clearErrors('images')
  }

  return (
    <form className="space-y-6 p-5" onSubmit={handleSubmit(submitForm)}>
      <div className="border-b border-[var(--color-border)] pb-4">
        <h2 className="text-lg font-semibold">{product ? 'Edit product' : 'Add product'}</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">
          Product name
          <input type="text" autoFocus disabled={isPending} className="form-field" {...register('name', { required: 'Enter a product name.' })} />
          {errors.name && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.name.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          Category
          <select disabled={isPending || !categories.length} className="form-field" {...register('categoryId', { required: 'Choose a category.' })}>
            <option value="">Select a category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          {errors.categoryId && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.categoryId.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          Regular price
          <input type="number" min="0" step="0.01" disabled={isPending} className="form-field" {...register('price', {
            min: { value: 0, message: 'Price cannot be negative.' },
            required: 'Enter a price.',
            valueAsNumber: true,
          })} />
          {errors.price && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.price.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          Final price after discount <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
          <input type="number" min="0" step="0.01" disabled={isPending} className="form-field" {...register('discountPrice', {
            min: { value: 0, message: 'Discount price cannot be negative.' },
            validate: (value) => !value || value <= getValues('price') || 'Discount must not exceed the price.',
            valueAsNumber: true,
          })} />
          <span className="mt-1 block text-xs text-[var(--color-text-muted)]">This is the price customers pay when a discount is active.</span>
          {errors.discountPrice && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.discountPrice.message}</span>}
        </label>
        <label className="block text-sm font-medium">
          <span className="flex items-center gap-2 pt-8">
            <input type="checkbox" disabled={isPending} {...register('isActive')} />
            Active in storefront
          </span>
        </label>
        <label className="block text-sm font-medium">
          <span className="flex items-center gap-2 pt-8">
            <input type="checkbox" disabled={isPending} {...register('isBestSeller')} />
            Mark as best seller
          </span>
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Description <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
          <textarea rows="3" disabled={isPending} className="form-field resize-y" {...register('description')} />
        </label>
      </div>

      <fieldset className="space-y-3">
        <div className="flex items-center justify-between">
          <legend className="text-sm font-medium">Size variants</legend>
          <Button type="button" variant="secondary" disabled={isPending} className="h-8 px-3" onClick={() => append({ is_sold_out: false, size: '' })}>
            <HiOutlinePlus className="mr-1 size-4" /> Add size
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="grid items-center gap-3 rounded-lg border border-[var(--color-border)] p-3 sm:grid-cols-[1fr_auto_auto]">
            <div>
              <input
                type="text"
                disabled={isPending}
                placeholder="Size, e.g. M or 32"
                className="form-field !mt-0"
                {...register(`variants.${index}.size`, { required: 'Enter a size.' })}
              />
              {errors.variants?.[index]?.size && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.variants[index].size.message}</span>}
            </div>
            <label className="flex items-center gap-2 whitespace-nowrap text-sm text-[var(--color-text-muted)]">
              <input type="checkbox" disabled={isPending} {...register(`variants.${index}.is_sold_out`)} />
              Sold out
            </label>
            <button
              type="button"
              disabled={isPending || fields.length === 1}
              onClick={() => removeVariant(index)}
              className="rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Remove size variant"
            >
              <HiOutlineTrash className="size-5" />
            </button>
          </div>
        ))}
      </fieldset>

      {product?.product_images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Current images</p>
          <div className="flex flex-wrap gap-3">
            {product.product_images.map((image) => {
              const isRemoved = imageIdsToRemove.includes(image.id)
              return (
                <div key={image.id} className={`relative ${isRemoved ? 'opacity-40' : ''}`}>
                  <img src={image.imageUrl} alt="" className="size-20 rounded-lg border border-[var(--color-border)] object-cover" />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => setImageIdsToRemove((ids) => isRemoved ? ids.filter((id) => id !== image.id) : [...ids, image.id])}
                    className="absolute -right-2 -top-2 rounded-full bg-[var(--color-danger)] px-2 py-1 text-xs font-medium text-white"
                    aria-label={`${isRemoved ? 'Keep' : 'Remove'} image`}
                  >
                    {isRemoved ? 'Undo' : 'Remove'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <label className="block text-sm font-medium">
        Product images <span className="font-normal text-[var(--color-text-muted)]">(up to 3)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={isPending}
          className="form-file-field"
          onChange={addImages}
        />
        {product && <span className="mt-1 block text-xs text-[var(--color-text-muted)]">{retainedImageCount} of {MAX_IMAGES} image slots in use.</span>}
        {selectedImages.length > 0 && (
          <div className="mt-2 space-y-1 rounded-lg border border-[var(--color-border)] p-2">
            {selectedImages.map((image, index) => (
              <div key={`${image.name}-${image.lastModified}-${index}`} className="flex items-center justify-between gap-3 text-xs text-[var(--color-text-muted)]">
                <span className="truncate">{image.name}</span>
                <button type="button" disabled={isPending} onClick={() => removeNewImage(index)} className="rounded p-1 hover:bg-[var(--color-background)] hover:text-[var(--color-danger)]" aria-label={`Remove ${image.name}`}>
                  <HiOutlineXMark className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.images && <span className="mt-1 block text-xs text-[var(--color-danger)]">{errors.images.message}</span>}
      </label>

      <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        <Button type="button" variant="secondary" disabled={isPending} onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : product ? 'Save changes' : 'Add product'}</Button>
      </div>
    </form>
  )
}

export default ProductsForm
