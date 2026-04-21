import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function EventType() {
  const navigate = useNavigate()
  const [types, setTypes] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('event_types').select('*').eq('is_active', true).order('display_order')
      .then(({ data }) => { setTypes(data || []); setLoading(false) })
  }, [])

  const handleNext = () => {
    if (!selected) return
    sessionStorage.setItem('quoteEventType', selected.id)
    sessionStorage.setItem('quoteEventLabel', selected.label)
    sessionStorage.setItem('quoteEventIcon', selected.icon)
    navigate('/quote/details')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'Outfit',sans-serif" }}>← Retour</button>
        <div style={{ display:'flex',gap:5 }}>
          {[1,0,0,0,0].map((a,i) => <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:a?'#FF4D2E':'rgba(255,255,255,.1)' }} />)}
        </div>
      </div>

      <div style={{ padding:'28px 22px 100px' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:8 }}>Quel type<br/>d'événement ?</h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:28,lineHeight:1.6 }}>Choisissez la catégorie qui correspond à votre projet.</p>

        {loading ? (
          <p style={{ color:'rgba(255,255,255,.3)',fontSize:13 }}>Chargement...</p>
        ) : (
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:20 }}>
            {types.map(t => (
              <div key={t.id}
                onClick={() => setSelected(t)}
                style={{ background:selected?.id===t.id?'rgba(255,77,46,.08)':'#111827', border:`1px solid ${selected?.id===t.id?'#FF4D2E':'rgba(255,255,255,.07)'}`, borderRadius:16, padding:'18px 12px', textAlign:'center', cursor:'pointer', transition:'all .2s' }}>
                <div style={{ fontSize:28,marginBottom:8 }}>{t.icon}</div>
                <div style={{ fontSize:13,fontWeight:500,color:selected?.id===t.id?'#FF7A5C':'#fff' }}>{t.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'16px 22px',background:'rgba(11,13,23,.95)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        <button onClick={handleNext} disabled={!selected} style={{ width:'100%',padding:'17px',background:selected?'#FF4D2E':'rgba(255,255,255,.1)',border:'none',borderRadius:16,color:selected?'#fff':'rgba(255,255,255,.3)',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:selected?'pointer':'not-allowed' }}>
          Continuer →
        </button>
      </div>
    </div>
  )
}
