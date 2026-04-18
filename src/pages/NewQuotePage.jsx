// Intégration disponible via :
//   useQuotes()  → { addQuote, computeTotals, loading, error }
//   useCatalog() → { services, servicesByCategory, eventTypes, fetchCatalog }
// addQuote(quoteData, items) crée le devis + les lignes en une seule opération
// quoteData : { client_id, event_type, event_date, event_location, org_id, ... }
// items     : [{ description, quantity, unit_price, vat_rate, total_ht }]
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useQuotes } from '../hooks/useQuotes'
import { useCatalog } from '../hooks/useCatalog'

export default function NewQuotePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addQuote, computeTotals, loading } = useQuotes()
  const { services, servicesByCategory, eventTypes, fetchCatalog } = useCatalog()

  useEffect(() => { fetchCatalog() }, [fetchCatalog])

  // TODO (Frontend Dev) : formulaire client + prestations
  // Après addQuote réussi → navigate(`/quotes/${quote.id}/preview`)
  return <div>NewQuotePage</div>
}
