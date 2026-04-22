import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/calculateQuote'

const STATUS = {
  en_attente: { label:'En attente', color:'#F59E0B', bg:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.3)' },
  confirme:   { label:'Confirmé',   color:'#10B981', bg:'rgba(16,185,129,.15)', border:'rgba(16,185,129,.3)' },
  refuse:     { label:'Refusé',     color:'#EF4444', bg:'rgba(239,68,68,.15)',  border:'rgba(239,68,68,.3)'  },
}

function NavAdmin({ active }) {
  const navigate = useNavigate()
  const items = [
    { icon:'📊', label:'Dashboard', path:'/admin' },
    { icon:'🛎️', label:'Services',  path:'/admin/services' },
    { icon:'📋', label:'Devis',     path:'/admin/quotes' },
    { icon:'⚙️', label:'Profil',    path:'/admin/profile' },
  ]
  return (
    <div style={{ position:'fixed',bottom:0,left:0,right:0,display:'flex',background:'rgba(11,13,23,.97)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
      {items.map(item => (
        <button key={item.path} onClick={() => navigate(item.path)}
          style={{ flex:1,padding:'10px 4px',background:'none',border:'none',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3 }}>
          <span style={{ fontSize:18 }}>{item.icon}</span>
          <span style={{ fontSize:9,color:active===item.path?'#FF4D2E':'rgba(255,255,255,.35)',fontWeight:active===item.path?600:400,fontFamily:"'Outfit',sans-serif" }}>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('quotes').select('*, clients(first_name, last_name, email)').order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => { setQuotes(data || []); setLoading(false) })
  }, [])

  const stats = {
    total:    quotes.length,
    attente:  quotes.filter(q => q.status === 'en_attente').length,
    ca:       quotes.filter(q => q.status === 'confirme').reduce((a, q) => a + q.total_ttc, 0),
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
        <div>
          <div style={{ fontSize:11,color:'rgba(255,255,255,.35)',marginBottom:2 }}>Espace Admin</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800 }}>MirlaEvent</div>
        </div>
        <button onClick={() => { signOut(); navigate('/') }}
          style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.35)',fontSize:12,fontFamily:"'Outfit',sans-serif" }}>Déconnexion</button>
      </div>

      <div style={{ padding:'24px 22px 100px' }}>
        <div style={{ display:'flex',gap:10,marginBottom:24 }}>
          {[
            { num:stats.total,   lbl:'Devis reçus',  color:'#FF4D2E' },
            { num:stats.attente, lbl:'En attente',   color:'#F59E0B' },
          ].map((s,i) => (
            <div key={i} style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px',textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:s.color,marginBottom:3 }}>{s.num}</div>
              <div style={{ fontSize:9,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.07em' }}>{s.lbl}</div>
            </div>
          ))}
          <div style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px',textAlign:'center' }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:'#10B981',marginBottom:3 }}>{formatPrice(stats.ca)}</div>
            <div style={{ fontSize:9,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.07em' }}>CA potentiel</div>
          </div>
        </div>

        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,marginBottom:14 }}>Derniers devis</div>

        {loading ? <p style={{ color:'rgba(255,255,255,.3)' }}>Chargement...</p> : quotes.map(q => {
          const st = STATUS[q.status] || STATUS.en_attente
          return (
            <div key={q.id} style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px 16px',marginBottom:10 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6 }}>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,marginBottom:2 }}>{q.clients?.first_name} {q.clients?.last_name}</div>
                  <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>{q.event_type} · {q.guest_count} pers.</div>
                </div>
                <span style={{ background:st.bg,border:`1px solid ${st.border}`,borderRadius:8,padding:'3px 9px',fontSize:10,fontWeight:600,color:st.color }}>{st.label}</span>
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.3)' }}>{q.quote_number} · {new Date(q.created_at).toLocaleDateString('fr-FR')}</div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:800,color:'#F59E0B' }}>{formatPrice(q.total_ttc)}</div>
              </div>
            </div>
          )
        })}
      </div>
      <NavAdmin active="/admin" />
    </div>
  )
}

export { NavAdmin }
