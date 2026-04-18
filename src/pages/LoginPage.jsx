// Intégration disponible via : useAuth() → { signIn, signUp, loading }
// signIn(email, password) renvoie { data, error } de Supabase
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  // TODO (Frontend Dev) : formulaire email + password, appeler signIn / signUp
  return <div>LoginPage</div>
}
