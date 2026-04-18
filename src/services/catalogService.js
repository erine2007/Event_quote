import { supabase } from '../supabaseClient'

// Récupérer tous les services groupés par catégorie
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      service_categories ( id, name, icon, display_order )
    `)
    .eq('is_active', true)
    .order('name')
  return { data, error }
}

// Récupérer les types d'événements actifs (pour le formulaire)
export async function getEventTypes() {
  const { data, error } = await supabase
    .from('event_types')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
  return { data, error }
}