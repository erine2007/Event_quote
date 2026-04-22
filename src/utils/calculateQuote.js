export function calculateQuote(selectedServices, guestCount) {
  const items = selectedServices.map(service => {
    const quantity = service.unit === 'personne' ? guestCount : 1
    const total_ht = service.price * quantity
    return {
      service_id:   service.id,
      service_name: service.name,
      quantity,
      unit:         service.unit,
      unit_price:   service.price,
      vat_rate:     service.vat_rate || 20,
      total_ht,
    }
  })

  const total_ht  = items.reduce((sum, i) => sum + i.total_ht, 0)
  const total_tva = total_ht * 0.20
  const total_ttc = total_ht + total_tva

  return {
    items,
    total_ht:  Math.round(total_ht  * 100) / 100,
    total_tva: Math.round(total_tva * 100) / 100,
    total_ttc: Math.round(total_ttc * 100) / 100,
  }
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' €'
}

// ✅ CORRIGÉ — timestamp pour éviter les doublons
export function generateQuoteNumber() {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `DEV-${year}-${timestamp}`
}