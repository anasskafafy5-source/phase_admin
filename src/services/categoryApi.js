import { supabase } from './supabase.js'

function buildCategoryImagePath(categoryId, file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  return `category-${categoryId}-${crypto.randomUUID()}.${extension}`
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, image_path, display_order')
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)

  return data.map((category) => ({
    ...category,
    imageUrl: category.image_path
      ? supabase.storage.from('categories').getPublicUrl(category.image_path).data.publicUrl
      : null,
  }))
}

export async function addCategory({ displayOrder, image, name }) {
  let category
  let imagePath

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, display_order: displayOrder })
      .select('id, name, image_path, display_order')
      .single()

    if (error) throw new Error(error.message)
    category = data

    imagePath = buildCategoryImagePath(category.id, image)
    const { error: uploadError } = await supabase.storage
      .from('categories')
      .upload(imagePath, image, { cacheControl: '3600', contentType: image.type, upsert: false })

    if (uploadError) throw new Error(uploadError.message)

    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update({ image_path: imagePath })
      .eq('id', category.id)
      .select('id, name, image_path, display_order')
      .single()

    if (updateError) throw new Error(updateError.message)

    return {
      ...updatedCategory,
      imageUrl: supabase.storage.from('categories').getPublicUrl(imagePath).data.publicUrl,
    }
  } catch (error) {
    if (imagePath) await supabase.storage.from('categories').remove([imagePath])
    if (category?.id) await supabase.from('categories').delete().eq('id', category.id)
    throw error
  }
}

export async function updateCategory({ category, displayOrder, image, name }) {
  let newImagePath

  try {
    if (image) {
      newImagePath = buildCategoryImagePath(category.id, image)
      const { error: uploadError } = await supabase.storage
        .from('categories')
        .upload(newImagePath, image, { cacheControl: '3600', contentType: image.type, upsert: false })

      if (uploadError) throw new Error(uploadError.message)
    }

    const changes = {
      display_order: displayOrder,
      name,
      ...(newImagePath ? { image_path: newImagePath } : {}),
    }
    const { data, error } = await supabase
      .from('categories')
      .update(changes)
      .eq('id', category.id)
      .select('id, name, image_path, display_order')
      .single()

    if (error) throw new Error(error.message)

    if (newImagePath && category.image_path) {
      const { error: removeError } = await supabase.storage
        .from('categories')
        .remove([category.image_path])

      if (removeError) console.error('Could not remove the replaced category image:', removeError)
    }

    return data
  } catch (error) {
    if (newImagePath) await supabase.storage.from('categories').remove([newImagePath])
    throw error
  }
}

export async function deleteCategory(category) {
  const { error: deleteError } = await supabase
    .from('categories')
    .delete()
    .eq('id', category.id)

  if (deleteError) throw new Error(deleteError.message)

  if (category.image_path) {
    const { error: removeError } = await supabase.storage
      .from('categories')
      .remove([category.image_path])

    if (removeError) console.error('Could not remove the deleted category image:', removeError)
  }
}
