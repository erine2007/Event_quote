import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { formatPrice } from '../../utils/calculateQuote'

const STATUS = {
  en_attente: { label:'En attente', color:'#F59E0B', bg:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.3)', icon:'⏳' },
  confirme:   { label:'Confirmé',   color:'#10B981', bg:'rgba(16,185,129,.15)', border:'rgba(16,185,129,.3)', icon:'✓' },
  refuse:     { label:'Refusé',     color:'#EF4444', bg:'rgba(239,68,68,.15)',  border:'rgba(239,68,68,.3)',  icon:'✗' },
  expire:     { label:'Expiré',     color:'#64748B', bg:'rgba(100,116,139,.15)',border:'rgba(100,116,139,.3)',icon:'↺' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => setProfile(data))
    supabase.from('quotes').select('*, quote_items(*)').eq('client_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setQuotes(data || []); setLoading(false) })
  }, [user])

  const handleLogout = async () => { await signOut(); navigate('/') }

  const stats = {
    total:    quotes.length,
    attente:  quotes.filter(q => q.status === 'en_attente').length,
    confirme: quotes.filter(q => q.status === 'confirme').length,
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      {/* Nav */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
        <div style={{ display:'flex',alignItems:'center',gap:8 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:'#FF4D2E',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:14,color:'#fff' }}>E</div>
          <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800 }}>MirlaEvent</span>
        </div>
        <button onClick={handleLogout} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:12,fontFamily:"'Outfit',sans-serif" }}>Déconnexion</button>
      </div>

      <div style={{ padding:'24px 22px 100px' }}>
        {/* Accueil */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:4 }}>Bonjour,</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800 }}>{profile?.first_name || 'Client'} {profile?.last_name || ''}</div>
        </div>

        {/* Stats */}
        <div style={{ display:'flex',gap:10,marginBottom:24 }}>
          {[
            { num:stats.total,   lbl:'Devis créés',  color:'#FF4D2E' },
            { num:stats.attente, lbl:'En attente',   color:'#F59E0B' },
            { num:stats.confirme,lbl:'Confirmés',    color:'#10B981' },
          ].map((s,i) => (
            <div key={i} style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px 10px',textAlign:'center' }}>
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,color:s.color,marginBottom:3 }}>{s.num}</div>
              <div style={{ fontSize:9,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.07em' }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700 }}>Mes devis</div>
        </div>

        {loading ? (
          <p style={{ color:'rgba(255,255,255,.3)',fontSize:13 }}>Chargement...</p>
        ) : quotes.length === 0 ? (
          <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:18,padding:'32px',textAlign:'center' }}>
            <div style={{ fontSize:32,marginBottom:12 }}>📋</div>
            <div style={{ fontSize:14,fontWeight:600,marginBottom:6 }}>Aucun devis pour l'instant</div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:20 }}>Créez votre premier devis en quelques minutes.</div>
            <button onClick={() => navigate('/quote/type')} style={{ background:'#FF4D2E',border:'none',borderRadius:12,padding:'12px 24px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>
              Créer mon premier devis →
            </button>
          </div>
        ) : (
          quotes.map(q => {
            const st = STATUS[q.status] || STATUS.en_attente
            return (
              <div key={q.id} style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px 16px',marginBottom:10,cursor:'pointer' }}>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600,marginBottom:3 }}>{q.event_type}</div>
                    <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>{q.quote_number} · {new Date(q.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span style={{ background:st.bg,border:`1px solid ${st.border}`,borderRadius:8,padding:'4px 10px',fontSize:10,fontWeight:600,color:st.color }}>
                    {st.icon} {st.label}
                  </span>
                </div>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>{q.guest_count} personnes{q.event_location ? ` · ${q.event_location}` : ''}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:'#F59E0B' }}>{formatPrice(q.total_ttc)}</div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'16px 22px',background:'rgba(11,13,23,.95)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        <button onClick={() => navigate('/quote/type')} style={{ width:'100%',padding:'17px',background:'#FF4D2E',border:'none',borderRadius:16,color:'#fff',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',boxShadow:'0 8px 32px rgba(255,77,46,.3)' }}>
          + Nouveau devis
        </button>
      </div>
    </div>
  )
}
