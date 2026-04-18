import html2pdf from 'html2pdf.js'

// company : { logo_url, stamp_url, name, ... } — passé par le composant parent
// quoteData : { quote_number, clients: { last_name }, ... }
export async function generatePDF(quoteData, company) {
  const element = document.getElementById('devis-preview')

  if (!element) {
    return { success: false, error: 'Element #devis-preview introuvable' }
  }

  const clientName = quoteData.clients?.last_name || 'devis'
  const filename = `${quoteData.quote_number}_${clientName}.pdf`

  const options = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    // useCORS indispensable : les images Supabase Storage sont cross-origin
    html2canvas: { scale: 2, useCORS: true, allowTaint: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  try {
    await html2pdf().set(options).from(element).save()
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err.message }
  }
}