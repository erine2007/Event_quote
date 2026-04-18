import { useState, useCallback } from 'react'
import { generatePDF } from '../utils/pdfGenerator'

export function usePDF() {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  // quoteData doit contenir quote_number et clients.last_name
  // company doit contenir logo_url et stamp_url
  // Le composant parent doit avoir un élément avec id="devis-preview"
  const exportPDF = useCallback(async (quoteData, company) => {
    setGenerating(true)
    setError(null)
    const { success, error } = await generatePDF(quoteData, company)
    setGenerating(false)
    if (!success) setError(error)
    return success
  }, [])

  return { generating, error, exportPDF }
}
