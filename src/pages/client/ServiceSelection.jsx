import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/calculateQuote'

export default function ServiceSelection() {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const guests = parseInt(sessionStorage.getItem('quoteGuests') || 40)

  useEffect(() => {
    supabase.from('services')
      .select('*, service_categories(name, icon)')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => { setServices(data || []); setLoading(false) })
  }, [])

  const toggle = (svc) => {
    setSelected(prev =>
      prev.find(s => s.id === svc.id)
        ? prev.filter(s => s.id !== svc.id)
        : [...prev, svc]
    )
  }

  const calcLine = (svc) => svc.unit === 'personne' ? svc.price * guests : svc.price
  const totalHT  = selected.reduce((a, s) => a + calcLine(s), 0)
  const totalTTC = totalHT * 1.2

  const grouped = services.reduce((acc, svc) => {
    const cat = svc.service_categories?.name || 'Autre'
    const icon = svc.service_categories?.icon || '✨'
    if (!acc[cat]) acc[cat] = { icon, items: [] }
    acc[cat].items.push(svc)
    return acc
  }, {})

  const handleNext = () => {
    sessionStorage.setItem('quoteSelectedServices', JSON.stringify(selected))
    navigate('/quote/contact')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <button onClick={() => navigate('/quote/details')} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'Outfit',sans-serif" }}>← Retour</button>
        <div style={{ display:'flex',gap:5 }}>
          {[1,1,1,0,0].map((a,i) => <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:a?'#FF4D2E':'rgba(255,255,255,.1)' }} />)}
        </div>
      </div>

      <div style={{ padding:'28px 22px 160px' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:8 }}>Choisissez<br/>vos services</h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:24,lineHeight:1.6 }}>Sélectionnez les prestations souhaitées.</p>

        {loading ? <p style={{ color:'rgba(255,255,255,.3)' }}>Chargement...</p> : (
          Object.entries(grouped).map(([cat, { icon, items }]) => (
            <div key={cat}>
              <div style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',margin:'20px 0 10px' }}>{icon} {cat}</div>
              {items.map(svc => {
                const isSel = selected.find(s => s.id === svc.id)
                const lineTotal = calcLine(svc)
                return (
                  <div key={svc.id} onClick={() => toggle(svc)}
                    style={{ display:'flex',alignItems:'center',gap:12,padding:'13px 14px',background:isSel?'rgba(255,77,46,.06)':'#111827',border:`1px solid ${isSel?'#FF4D2E':'rgba(255,255,255,.07)'}`,borderRadius:13,marginBottom:9,cursor:'pointer',transition:'all .2s' }}>
                    <div style={{ width:20,height:20,borderRadius:5,border:`1.5px solid ${isSel?'#FF4D2E':'rgba(255,255,255,.2)'}`,background:isSel?'#FF4D2E':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,color:'#fff',fontWeight:700 }}>
                      {isSel?'✓':''}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:500,color:'#fff' }}>{svc.name}</div>
                      {svc.description && <div style={{ fontSize:10,color:'rgba(255,255,255,.35)',marginTop:2 }}>{svc.description}</div>}
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:12,fontWeight:600,color:'#FF4D2E' }}>{formatPrice(svc.price)}/{svc.unit}</div>
                      {isSel && <div style={{ fontSize:10,color:'rgba(255,77,46,.8)',marginTop:2 }}>= {formatPrice(lineTotal)}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'14px 22px 18px',background:'rgba(11,13,23,.97)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        {selected.length > 0 && (
          <div style={{ background:'#111827',borderRadius:12,padding:'10px 14px',marginBottom:12 }}>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:3 }}>
              <span>Total HT</span><span>{formatPrice(totalHT)}</span>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:5 }}>
              <span>TVA 20%</span><span>{formatPrice(totalHT * 0.2)}</span>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:16,fontWeight:700 }}>
              <span>Total TTC</span><span style={{ color:'#F59E0B' }}>{formatPrice(totalTTC)}</span>
            </div>
          </div>
        )}
        <button onClick={handleNext} disabled={selected.length === 0}
          style={{ width:'100%',padding:'17px',background:selected.length?'#FF4D2E':'rgba(255,255,255,.1)',border:'none',borderRadius:16,color:selected.length?'#fff':'rgba(255,255,255,.3)',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:selected.length?'pointer':'not-allowed' }}>
          {selected.length > 0 ? `Continuer (${selected.length} service${selected.length > 1 ? 's' : ''}) →` : 'Sélectionnez au moins un service'}
        </button>
      </div>
    </div>
  )
}
