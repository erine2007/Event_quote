import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [form, setForm] = useState({ email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    const { error: err } = await signIn(form.email, form.password)
    if (err) { setError('Identifiants incorrects.'); setLoading(false); return }
    navigate('/admin')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff', display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 22px' }}>
      <div style={{ textAlign:'center', marginBottom:40 }}>
        <div style={{ width:60,height:60,borderRadius:16,background:'linear-gradient(135deg,#FF4D2E,#C0392B)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'#fff',margin:'0 auto 16px',boxShadow:'0 8px 32px rgba(255,77,46,.4)' }}>⚙</div>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,marginBottom:6 }}>Espace Admin</div>
        <div style={{ fontSize:13,color:'rgba(255,255,255,.35)' }}>Accès réservé à l'équipe MirlaEvent</div>
      </div>

      <div style={{ background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.08)',borderRadius:20,padding:'28px 24px' }}>
        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Email admin</label>
        <input type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})}
          placeholder="admin@MirlaEvent.fr"
          style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:16 }} />

        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Mot de passe</label>
        <input type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})}
          placeholder="••••••••"
          style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:16 }} />

        {error && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:12,padding:'12px',fontSize:12,color:'#FCA5A5',marginBottom:16 }}>{error}</div>}

        <button onClick={handleSubmit} disabled={loading}
          style={{ width:'100%',padding:'16px',background:'#FF4D2E',border:'none',borderRadius:14,color:'#fff',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',opacity:loading?0.7:1 }}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </div>

      <button onClick={() => navigate('/login')} style={{ marginTop:20,background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.35)',fontSize:12,fontFamily:"'Outfit',sans-serif",textAlign:'center',width:'100%' }}>
        ← Retour à la connexion client
      </button>
    </div>
  )
}
