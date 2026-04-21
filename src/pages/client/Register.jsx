import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', password:'', phone:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Veuillez remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    const { data, error: err } = await signUp(form.email, form.password, form.firstName, form.lastName)
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('clients').upsert({
        id: data.user.id, first_name: form.firstName,
        last_name: form.lastName, email: form.email, phone: form.phone,
      })
    }
    navigate('/quote/type')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <button onClick={() => navigate('/')} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.4)', fontSize:13, fontFamily:"'Outfit',sans-serif", display:'flex', alignItems:'center', gap:4 }}>← Retour</button>
        <div style={{ display:'flex', gap:5 }}>
          {[1,0,0,0,0].map((a,i) => <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:a?'#FF4D2E':'rgba(255,255,255,.1)' }} />)}
        </div>
      </div>

      <div style={{ padding:'32px 22px 100px' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:8 }}>Créer mon<br/>compte</h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:28,lineHeight:1.6 }}>Pour accéder à vos devis à tout moment.</p>

        <div style={{ display:'flex', gap:10, marginBottom:0 }}>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Prénom *</label>
            <input style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:14 }}
              placeholder="Marie" value={form.firstName} onChange={e => setForm({...form,firstName:e.target.value})} />
          </div>
          <div style={{ flex:1 }}>
            <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Nom *</label>
            <input style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:14 }}
              placeholder="Dupont" value={form.lastName} onChange={e => setForm({...form,lastName:e.target.value})} />
          </div>
        </div>

        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Email *</label>
        <input style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:14 }}
          type="email" placeholder="marie@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} />

        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Mot de passe *</label>
        <input style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:14 }}
          type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form,password:e.target.value})} />

        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>Téléphone (optionnel)</label>
        <input style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:14 }}
          type="tel" placeholder="06 12 34 56 78" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} />

        {error && <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:12,padding:'12px 16px',fontSize:12,color:'#FCA5A5',marginBottom:16 }}>{error}</div>}

        <div style={{ background:'rgba(255,77,46,.05)',border:'1px solid rgba(255,77,46,.15)',borderRadius:12,padding:'12px 14px',fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.5,marginBottom:20 }}>
          🔒 Vos données sont sécurisées. Ce compte vous permet de retrouver vos devis à tout moment.
        </div>
      </div>

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'16px 22px',background:'rgba(11,13,23,.95)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        <button onClick={handleSubmit} disabled={loading} style={{ width:'100%',padding:'17px',background:'#FF4D2E',border:'none',borderRadius:16,color:'#fff',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',boxShadow:'0 8px 32px rgba(255,77,46,.3)',opacity:loading?0.7:1 }}>
          {loading ? 'Création...' : 'Créer mon compte →'}
        </button>
        <p style={{ textAlign:'center',fontSize:12,color:'rgba(255,255,255,.3)',marginTop:12 }}>
          Déjà un compte ? <Link to="/login" style={{ color:'#FF4D2E',textDecoration:'none' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
