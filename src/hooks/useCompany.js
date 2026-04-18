import { useState, useCallback } from 'react'
import { getCompany, uploadAsset, updateCompanyAsset } from '../services/companyService'

export function useCompany() {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCompany = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await getCompany()
    if (error) setError(error.message)
    else setCompany(data)
    setLoading(false)
  }, [])

  // Upload du fichier + mise à jour de l'URL en base en une seule opération
  // type : 'logo' | 'stamp'
  const uploadAndSaveAsset = useCallback(async (file, type) => {
    if (!company?.id) return { success: false, error: 'Entreprise non chargée' }
    setLoading(true)
    const { url, error: uploadError } = await uploadAsset(file, type)
    if (uploadError) {
      setLoading(false)
      return { success: false, error: uploadError.message }
    }
    const { data, error: updateError } = await updateCompanyAsset(company.id, type, url)
    setLoading(false)
    if (updateError) return { success: false, error: updateError.message }
    setCompany(data)
    return { success: true, url }
  }, [company])

  return { company, loading, error, fetchCompany, uploadAndSaveAsset }
}
