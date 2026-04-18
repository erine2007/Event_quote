// Intégration disponible via :
//   useAuth()   → { user, signOut }
//   useQuotes() → { quotes, loading, error, fetchQuotes, changeStatus }
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useQuotes } from '../hooks/useQuotes'

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const { quotes, loading, fetchQuotes } = useQuotes()

  useEffect(() => { fetchQuotes() }, [fetchQuotes])

  // TODO (Frontend Dev) : liste des devis, bouton nouveau devis, bouton profil
  return <div>DashboardPage — {quotes.length} devis</div>
}
