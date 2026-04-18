// Intégration disponible via :
//   useQuotes()  → { fetchQuote, changeStatus, loading }
//   useCompany() → { company, fetchCompany }
//   usePDF()     → { exportPDF, generating, error }
//
// IMPORTANT pour le PDF :
//   L'élément racine du rendu du devis DOIT avoir id="devis-preview"
//   Les images (logo, tampon) sont cross-origin (Supabase Storage) → déjà géré (useCORS: true)
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuotes } from '../hooks/useQuotes'
import { useCompany } from '../hooks/useCompany'
import { usePDF } from '../hooks/usePDF'

export default function QuotePreviewPage() {
  const { id } = useParams()
  const { fetchQuote } = useQuotes()
  const { company, fetchCompany } = useCompany()
  const { exportPDF, generating } = usePDF()
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    fetchQuote(id).then(setQuote)
    fetchCompany()
  }, [id, fetchQuote, fetchCompany])

  const handleExport = () => exportPDF(quote, company)

  // TODO (Frontend Dev) : rendu du devis dans div#devis-preview + bouton export
  return (
    <div>
      <div id="devis-preview">QuotePreviewPage — aperçu du devis</div>
      <button onClick={handleExport} disabled={generating}>
        {generating ? 'Génération...' : 'Exporter PDF'}
      </button>
    </div>
  )
}
