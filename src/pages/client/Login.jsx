import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!form.email || !form.password) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setLoading(true)

    const { data, error: err } = await signIn(form.email, form.password)

    if (err) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    // Vérifier le rôle dans la table profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      navigate('/admin')        // → Espace admin
    } else {
      navigate('/dashboard')    // → Espace client
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <button onClick={() => navigate('/')} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'Outfit',sans-serif" }}>← Retour</button>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:'#FF4D2E',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,color:'#fff' }}>E</div>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800 }}>MirlaEvent</span>
        </div>
      </div>

      <div style={{ padding:'40px 22px 100px' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:8 }}>
          Content de<br/>vous revoir !
        </h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:36,lineHeight:1.6 }}>
          Connectez-vous pour accéder à votre espace.
        </p>

        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Email</label>
        <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
          placeholder="votre@email.com"
          style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:16 }} />

        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Mot de passe</label>
        <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}
          placeholder="••••••••"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:16 }} />

        {error && (
          <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:12,padding:'12px 16px',fontSize:12,color:'#FCA5A5',marginBottom:16 }}>
            {error}
          </div>
        )}

        {/* Info rôles */}
        <div style={{ background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:12,padding:'12px 14px',fontSize:11,color:'rgba(255,255,255,.35)',lineHeight:1.6 }}>
          🔀 Vous serez automatiquement redirigé vers votre espace selon votre profil.
        </div>
      </div>

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'16px 22px',background:'rgba(11,13,23,.95)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        <button onClick={handleSubmit} disabled={loading}
          style={{ width:'100%',padding:'17px',background:'#FF4D2E',border:'none',borderRadius:16,color:'#fff',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',boxShadow:'0 8px 32px rgba(255,77,46,.3)',opacity:loading?0.7:1 }}>
          {loading ? 'Connexion...' : 'Se connecter →'}
        </button>
        <p style={{ textAlign:'center',fontSize:12,color:'rgba(255,255,255,.3)',marginTop:12 }}>
          Pas encore de compte ? <Link to="/register" style={{ color:'#FF4D2E',textDecoration:'none' }}>Créer un compte</Link>
        </p>
      </div>
    </div>
  )
}