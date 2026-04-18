import { supabase } from '../supabaseClient'

// Récupérer tous les devis avec client + items
export async function getQuotes() {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      clients ( id, first_name, last_name, email, phone ),
      quote_items ( * )
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}

// Récupérer un seul devis par ID
export async function getQuoteById(id) {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      clients ( id, first_name, last_name, email, phone ),
      quote_items ( * )
    `)
    .eq('id', id)
    .single()
  return { data, error }
}

// Créer un devis + ses lignes en une seule opération
export async function createQuote(quoteData, items) {
  // 1. Insérer le devis
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert([quoteData])
    .select()
    .single()

  if (quoteError) return { data: null, error: quoteError }

  // 2. Insérer les lignes avec le quote_id
  const itemsWithId = items.map(item => ({
    ...item,
    quote_id: quote.id
  }))

  const { data: quoteItems, error: itemsError } = await supabase
    .from('quote_items')
    .insert(itemsWithId)
    .select()

  if (itemsError) return { data: null, error: itemsError }

  return { data: { ...quote, quote_items: quoteItems }, error: null }
}

// Mettre à jour le statut d'un devis
// Statuts possibles : 'en_attente', 'accepte', 'refuse', 'expire'
export async function updateQuoteStatus(id, status) {
  const { data, error } = await supabase
    .from('quotes')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

// Générer un numéro de devis unique (ex: DEV-2025-0042)
export function generateQuoteNumber() {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `DEV-${year}-${random}`
}

// Calculer les totaux HT / TVA / TTC à partir des lignes
export function computeTotals(items) {
  const total_ht = items.reduce((sum, item) => sum + item.total_ht, 0)
  const total_tva = items.reduce((sum, item) => {
    return sum + item.total_ht * (item.vat_rate / 100)
  }, 0)
  const total_ttc = total_ht + total_tva
  return {
    total_ht: parseFloat(total_ht.toFixed(2)),
    total_tva: parseFloat(total_tva.toFixed(2)),
    total_ttc: parseFloat(total_ttc.toFixed(2)),
  }
}