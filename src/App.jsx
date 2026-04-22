import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useEffect } from 'react'

// Pages publiques
import Home      from './pages/client/Home'
import Login     from './pages/client/Login'
import Register  from './pages/client/Register'

// Pages client
import Dashboard        from './pages/client/Dashboard'
import EventType        from './pages/client/EventType'
import EventDetails     from './pages/client/EventDetails'
import ServiceSelection from './pages/client/ServiceSelection'
import ContactForm      from './pages/client/ContactForm'
import QuoteResult      from './pages/client/QuoteResult'

// Pages admin
import AdminLogin     from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProfile   from './pages/admin/AdminProfile'
import AdminServices  from './pages/admin/AdminServices'
import AdminQuotes    from './pages/admin/AdminQuotes'

function ProtectedClient({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  return user ? children : <Navigate to="/login" />
}

function ProtectedAdmin({ children }) {
  const { user, role, loading } = useAuth()
  if (loading) return <Loader />
  if (!user) return <Navigate to="/admin/login" />
  if (role !== 'admin') return <Navigate to="/" />
  return children
}

function Loader() {
  return (
    <div style={{ minHeight: '100vh', background: '#0B0D17', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FF4D2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 auto 12px' }}>E</div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'Outfit, sans-serif' }}>Chargement...</p>
      </div>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Publiques */}
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Client protégé */}
        <Route path="/dashboard" element={<ProtectedClient><Dashboard /></ProtectedClient>} />
        <Route path="/quote/type" element={<ProtectedClient><EventType /></ProtectedClient>} />
        <Route path="/quote/details" element={<ProtectedClient><EventDetails /></ProtectedClient>} />
        <Route path="/quote/services" element={<ProtectedClient><ServiceSelection /></ProtectedClient>} />
        <Route path="/quote/contact" element={<ProtectedClient><ContactForm /></ProtectedClient>} />
        <Route path="/quote/result" element={<ProtectedClient><QuoteResult /></ProtectedClient>} />

        {/* Admin protégé */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
        <Route path="/admin/profile" element={<ProtectedAdmin><AdminProfile /></ProtectedAdmin>} />
        <Route path="/admin/services" element={<ProtectedAdmin><AdminServices /></ProtectedAdmin>} />
        <Route path="/admin/quotes" element={<ProtectedAdmin><AdminQuotes /></ProtectedAdmin>} />
      </Routes>
    </BrowserRouter>
  )
}
