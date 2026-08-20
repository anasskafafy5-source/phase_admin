import { supabase } from './supabase.js'

function getProductImagePath(productId, imagePath) {
  return imagePath.startsWith(`${productId}/`) ? imagePath : `${productId}/${imagePath}`
}

function withImageUrls(product) {
  const images = (product.product_images || []).map((image) => ({
    ...image,
    imageUrl: supabase.storage
      .from('products')
      .getPublicUrl(getProductImagePath(product.id, image.image_path)).data.publicUrl,
  }))

  return { ...product, product_images: images }
}

const productSelect = `
  id,
  name,
  description,
  price,
  discount_price,
  category_id,
  is_active,
  is_best_seller,
  created_at,
  categories ( id, name ),
  product_variants ( id, size, is_sold_out ),
  product_images ( id, image_path, display_order )
`

const sortColumns = {
  created_at_asc: [{ ascending: true, column: 'created_at' }],
  created_at_desc: [{ ascending: false, column: 'created_at' }],
  name_asc: [{ ascending: true, column: 'name' }],
  name_desc: [{ ascending: false, column: 'name' }],
  price_asc: [
    { ascending: true, column: 'discount_price', nullsFirst: false },
    { ascending: true, column: 'price' },
  ],
  price_desc: [
    { ascending: false, column: 'discount_price', nullsFirst: false },
    { ascending: false, column: 'price' },
  ],
}

export async function getProducts({ category = '', page = 1, pageSize = 10, search = '', sort = 'created_at_desc', status = '' } = {}) {
  const orderBy = sortColumns[sort] || sortColumns.created_at_desc
  let query = supabase
    .from('products')
    .select(productSelect, { count: 'exact' })

  if (search) query = query.ilike('name', `%${search}%`)
  if (category) query = query.eq('category_id', category)
  if (status === 'active') query = query.eq('is_active', true)
  if (status === 'inactive') query = query.eq('is_active', false)

  const from = (page - 1) * pageSize
  orderBy.forEach(({ ascending, column, nullsFirst }) => {
    query = query.order(column, { ascending, nullsFirst })
  })

  const { count, data, error } = await query
    .order('display_order', { ascending: true, foreignTable: 'product_images' })
    .range(from, from + pageSize - 1)

  if (error) throw new Error(error.message)

  return { count: count || 0, products: data.map(withImageUrls) }
}

export async function getProduct(productId) {
  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('id', productId)
    .order('display_order', { ascending: true, foreignTable: 'product_images' })
    .single()

  if (error) throw new Error(error.message)

  return withImageUrls(data)
}

function buildProductImagePath(productId, file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  return `${productId}/${crypto.randomUUID()}.${extension}`
}

export async function addProduct({ categoryId, description, discountPrice, images, isActive, isBestSeller, name, price, variants }) {
  let product
  const imagePaths = []

  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        category_id: categoryId,
        description: description || null,
        discount_price: Number.isFinite(discountPrice) ? discountPrice : null,
        is_active: isActive,
        is_best_seller: isBestSeller,
        name,
        price,
      })
      .select('id, name, description, price, discount_price, category_id, is_active, is_best_seller, created_at')
      .single()

    if (error) throw new Error(error.message)
    product = data

    const variantRows = variants.map((variant) => ({
      product_id: product.id,
      is_sold_out: variant.is_sold_out,
      size: variant.size.trim(),
    }))
    const { error: variantsError } = await supabase.from('product_variants').insert(variantRows)

    if (variantsError) throw new Error(variantsError.message)

    const imageUploads = images.map((image) => ({
      image,
      imagePath: buildProductImagePath(product.id, image),
    }))
    imagePaths.push(...imageUploads.map(({ imagePath }) => imagePath))
    const uploadTasks = imageUploads.map(async ({ image, imagePath }) => {
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(imagePath, image, { cacheControl: '3600', contentType: image.type, upsert: false })

      if (uploadError) throw new Error(uploadError.message)
    })
    await Promise.all(uploadTasks)

    if (imageUploads.length) {
      const imageRows = imagePaths.map((imagePath, displayOrder) => ({
        display_order: displayOrder,
        image_path: imagePath,
        product_id: product.id,
      }))
      const { error: imagesError } = await supabase.from('product_images').insert(imageRows)

      if (imagesError) throw new Error(imagesError.message)
    }

    return product
  } catch (error) {
    if (product?.id) {
      await supabase.from('product_images').delete().eq('product_id', product.id)
      await supabase.from('product_variants').delete().eq('product_id', product.id)
      await supabase.from('products').delete().eq('id', product.id)
    }
    if (imagePaths.length) await supabase.storage.from('products').remove(imagePaths)
    throw error
  }
}

export async function updateProduct({
  categoryId,
  description,
  discountPrice,
  images,
  imageIdsToRemove,
  isActive,
  isBestSeller,
  name,
  price,
  product,
  variantIdsToRemove,
  variants,
}) {
  const removedImageIds = new Set(imageIdsToRemove)
  const retainedImages = product.product_images.filter((image) => !removedImageIds.has(image.id))

  if (retainedImages.length + images.length > 3) {
    throw new Error('A product can have a maximum of 3 images.')
  }

  const newImageUploads = images.map((image) => ({
    image,
    imagePath: buildProductImagePath(product.id, image),
  }))
  const newImagePaths = newImageUploads.map(({ imagePath }) => imagePath)

  try {
    const uploadTasks = newImageUploads.map(async ({ image, imagePath }) => {
      const { error } = await supabase.storage
        .from('products')
        .upload(imagePath, image, { cacheControl: '3600', contentType: image.type, upsert: false })
      if (error) throw new Error(error.message)
    })
    await Promise.all(uploadTasks)

    const { data: updatedProduct, error: productError } = await supabase
      .from('products')
      .update({
        category_id: categoryId,
        description: description || null,
        discount_price: Number.isFinite(discountPrice) ? discountPrice : null,
        is_active: isActive,
        is_best_seller: isBestSeller,
        name,
        price,
      })
      .eq('id', product.id)
      .select(productSelect)
      .single()
    if (productError) throw new Error(productError.message)

    if (variantIdsToRemove.length) {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('product_id', product.id)
        .in('id', variantIdsToRemove)
      if (error) throw new Error(error.message)
    }

    const currentVariantIds = new Set(product.product_variants.map((variant) => variant.id))
    const existingVariants = variants.filter((variant) => currentVariantIds.has(variant.id))
    const newVariants = variants.filter((variant) => !variant.id)
    await Promise.all(existingVariants.map(async (variant) => {
      const { error } = await supabase
        .from('product_variants')
        .update({ is_sold_out: variant.is_sold_out, size: variant.size.trim() })
        .eq('id', variant.id)
        .eq('product_id', product.id)
      if (error) throw new Error(error.message)
    }))
    if (newVariants.length) {
      const { error } = await supabase.from('product_variants').insert(newVariants.map((variant) => ({
        product_id: product.id,
        is_sold_out: variant.is_sold_out,
        size: variant.size.trim(),
      })))
      if (error) throw new Error(error.message)
    }

    const removedImages = product.product_images.filter((image) => removedImageIds.has(image.id))
    if (removedImages.length) {
      const { error: storageError } = await supabase.storage
        .from('products')
        .remove(removedImages.map((image) => getProductImagePath(product.id, image.image_path)))
      if (storageError) throw new Error(storageError.message)

      const { error: imageRowsError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id)
        .in('id', removedImages.map((image) => image.id))
      if (imageRowsError) throw new Error(imageRowsError.message)
    }

    const finalImages = [...retainedImages, ...newImageUploads]
    await Promise.all(retainedImages.map(async (image, displayOrder) => {
      const { error } = await supabase
        .from('product_images')
        .update({ display_order: displayOrder })
        .eq('id', image.id)
        .eq('product_id', product.id)
      if (error) throw new Error(error.message)
    }))
    if (newImageUploads.length) {
      const { error } = await supabase.from('product_images').insert(newImageUploads.map(({ imagePath }, index) => ({
        display_order: retainedImages.length + index,
        image_path: imagePath,
        product_id: product.id,
      })))
      if (error) throw new Error(error.message)
    }

    return { ...updatedProduct, product_images: finalImages }
  } catch (error) {
    if (newImagePaths.length) await supabase.storage.from('products').remove(newImagePaths)
    throw error
  }
}

export async function deleteProduct(product) {
  const imagePaths = product.product_images.map((image) => getProductImagePath(product.id, image.image_path))
  const { error: imagesError } = await supabase.from('product_images').delete().eq('product_id', product.id)
  if (imagesError) throw new Error(imagesError.message)

  const { error: variantsError } = await supabase.from('product_variants').delete().eq('product_id', product.id)
  if (variantsError) throw new Error(variantsError.message)

  const { error: productError } = await supabase.from('products').delete().eq('id', product.id)
  if (productError) throw new Error(productError.message)

  if (imagePaths.length) {
    const { error: storageError } = await supabase.storage.from('products').remove(imagePaths)
    if (storageError) console.error('Could not remove deleted product images:', storageError)
  }
}
