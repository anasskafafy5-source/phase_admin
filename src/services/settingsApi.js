import { supabase } from './supabase.js'

export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('id, whatsapp_number, instagram_url')
    .limit(1)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateSettings({ id, instagramUrl, whatsappNumber }) {
  const { data, error } = await supabase
    .from('settings')
    .update({ instagram_url: instagramUrl, whatsapp_number: whatsappNumber })
    .eq('id', id)
    .select('id, whatsapp_number, instagram_url')
    .single()

  if (error) throw new Error(error.message)
  return data
}
