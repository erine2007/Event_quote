import { supabase } from '../supabaseClient'

// Récupérer les infos de l'entreprise (1 seule ligne attendue)
export async function getCompany() {
  const { data, error } = await supabase
    .from('company')
    .select('*')
    .single()
  return { data, error }
}

// Upload logo ou tampon dans Supabase Storage
// type = 'logo' | 'stamp'
export async function uploadAsset(file, type) {
  const bucket = 'company-assets'
  const path = `${type}_${Date.now()}.${file.name.split('.').pop()}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })

  if (uploadError) return { url: null, error: uploadError }

  // Récupérer l'URL publique
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return { url: urlData.publicUrl, error: null }
}

// Mettre à jour l'URL du logo ou du tampon en base
export async function updateCompanyAsset(companyId, type, url) {
  const field = type === 'logo' ? 'logo_url' : 'stamp_url'
  const { data, error } = await supabase
    .from('company')
    .update({ [field]: url })
    .eq('id', companyId)
    .select()
    .single()
  return { data, error }
}