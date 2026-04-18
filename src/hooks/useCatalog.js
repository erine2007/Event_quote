import { useState, useCallback, useMemo } from 'react'
import { getServices, getEventTypes } from '../services/catalogService'

export function useCatalog() {
  const [services, setServices] = useState([])
  const [eventTypes, setEventTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCatalog = useCallback(async () => {
    setLoading(true)
    setError(null)
    const [servicesResult, eventTypesResult] = await Promise.all([
      getServices(),
      getEventTypes(),
    ])
    if (servicesResult.error) setError(servicesResult.error.message)
    else setServices(servicesResult.data)
    if (eventTypesResult.error) setError(eventTypesResult.error.message)
    else setEventTypes(eventTypesResult.data)
    setLoading(false)
  }, [])

  // Services indexés par catégorie — utile pour les formulaires de sélection
  const servicesByCategory = useMemo(() =>
    services.reduce((acc, service) => {
      const cat = service.service_categories?.name ?? 'Autre'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(service)
      return acc
    }, {}),
  [services])

  return { services, servicesByCategory, eventTypes, loading, error, fetchCatalog }
}
