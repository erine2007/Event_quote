// Intégration disponible via :
//   useCompany() → { company, fetchCompany, uploadAndSaveAsset, loading, error }
// uploadAndSaveAsset(file, 'logo')  → upload + sauvegarde URL logo
// uploadAndSaveAsset(file, 'stamp') → upload + sauvegarde URL tampon
import { useEffect } from 'react'
import { useCompany } from '../hooks/useCompany'

export default function ProfilePage() {
  const { company, fetchCompany, uploadAndSaveAsset, loading } = useCompany()

  useEffect(() => { fetchCompany() }, [fetchCompany])

  // TODO (Frontend Dev) : affichage + upload logo/tampon
  return <div>ProfilePage</div>
}
