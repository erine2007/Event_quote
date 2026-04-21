import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function EventDetails() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]
  const [guests, setGuests] = useState(40)
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')
  const [cities, setCities] = useState([])
  const [search, setSearch] = useState('')
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    supabase.from('cities').select('*').eq('is_active', true).order('name')
      .then(({ data }) => setCities(data || []))
  }, [])

  const filtered = cities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectCity = (city) => {
    setLocation(city.name)
    setSearch(city.name)
    setShowList(false)
  }

  const handleNext = () => {
    if (!location) return
    sessionStorage.setItem('quoteGuests', guests)
    sessionStorage.setItem('quoteDate', date)
    sessionStorage.setItem('quoteLocation', location)
    sessionStorage.setItem('quoteBudget', budget)
    navigate('/quote/services')
  }

  const budgets = ['< 2 000€', '2 000–5 000€', '5 000–10 000€', '> 10 000€']

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <button onClick={() => navigate('/quote/type')} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'Outfit',sans-serif" }}>← Retour</button>
        <div style={{ display:'flex',gap:5 }}>
          {[1,1,0,0,0].map((a,i) => <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:a?'#FF4D2E':'rgba(255,255,255,.1)' }} />)}
        </div>
      </div>

      <div style={{ padding:'28px 22px 100px' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:8 }}>Détails de<br/>l'événement</h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:28,lineHeight:1.6 }}>Ces informations personnalisent votre devis.</p>

        {/* Nombre de personnes */}
        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10,display:'block' }}>
          Nombre de personnes
        </label>
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:8 }}>
          <input type="range" min={5} max={500} step={5} value={guests}
            onChange={e => setGuests(+e.target.value)}
            style={{ flex:1,height:4,WebkitAppearance:'none',background:'#1A2233',borderRadius:2,outline:'none',cursor:'pointer' }} />
          <input type="number" min={5} max={500} value={guests}
            onChange={e => setGuests(Math.min(500, Math.max(5, +e.target.value)))}
            style={{ width:70,background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:'10px',fontSize:16,fontWeight:700,color:'#FF4D2E',fontFamily:"'Syne',sans-serif",outline:'none',textAlign:'center' }} />
        </div>
        <p style={{ fontSize:11,color:'rgba(255,255,255,.25)',marginBottom:20 }}>
          Faites glisser ou tapez directement le nombre
        </p>

        {/* Date */}
        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>
          Date souhaitée
        </label>
        <input type="date" min={today} value={date} onChange={e => setDate(e.target.value)}
          style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:20,colorScheme:'dark' }} />

        {/* Ville avec autocomplétion */}
        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>
          Ville / Lieu *
        </label>
        <div style={{ position:'relative',marginBottom:20 }}>
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={search}
            onChange={e => { setSearch(e.target.value); setLocation(''); setShowList(true) }}
            onFocus={() => setShowList(true)}
            style={{ width:'100%',background:'#111827',border:`1px solid ${location?'#FF4D2E':'rgba(255,255,255,.08)'}`,borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none' }} />

          {/* Icône check si ville sélectionnée */}
          {location && (
            <div style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',color:'#FF4D2E',fontSize:16 }}>✓</div>
          )}

          {/* Liste déroulante */}
          {showList && search.length > 0 && filtered.length > 0 && (
            <div style={{ position:'absolute',top:'100%',left:0,right:0,background:'#111827',border:'1px solid rgba(255,255,255,.1)',borderRadius:12,marginTop:4,zIndex:100,overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,.5)' }}>
              {filtered.map(city => (
                <div key={city.id}
                  onClick={() => selectCity(city)}
                  style={{ padding:'13px 16px',cursor:'pointer',fontSize:14,color:'#fff',borderBottom:'1px solid rgba(255,255,255,.05)',transition:'background .15s' }}
                  onMouseEnter={e => e.target.style.background='rgba(255,77,46,.1)'}
                  onMouseLeave={e => e.target.style.background='transparent'}>
                  📍 {city.name}
                </div>
              ))}
            </div>
          )}

          {/* Aucun résultat */}
          {showList && search.length > 0 && filtered.length === 0 && (
            <div style={{ position:'absolute',top:'100%',left:0,right:0,background:'#111827',border:'1px solid rgba(255,255,255,.1)',borderRadius:12,marginTop:4,zIndex:100,padding:'16px',textAlign:'center' }}>
              <div style={{ fontSize:20,marginBottom:6 }}>😕</div>
              <div style={{ fontSize:12,color:'rgba(255,255,255,.4)' }}>
                Cette ville n'est pas encore disponible.<br/>
                <span style={{ color:'#FF4D2E' }}>Contactez-nous pour en savoir plus.</span>
              </div>
            </div>
          )}
        </div>

        {/* Budget */}
        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>
          Budget approximatif
        </label>
        <p style={{ fontSize:11,color:'rgba(255,255,255,.25)',marginBottom:10 }}>
          Indicatif — le vrai prix sera calculé selon vos services.
        </p>
        <div style={{ display:'flex',gap:7,marginBottom:8,flexWrap:'wrap' }}>
          {budgets.map(b => (
            <div key={b} onClick={() => setBudget(b)}
              style={{ flex:1,minWidth:'45%',padding:'10px 4px',background:budget===b?'rgba(255,77,46,.1)':'#111827',border:`1px solid ${budget===b?'#FF4D2E':'rgba(255,255,255,.07)'}`,borderRadius:10,fontSize:11,textAlign:'center',cursor:'pointer',color:budget===b?'#FF4D2E':'rgba(255,255,255,.4)',fontWeight:600,transition:'all .2s' }}>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Fermer la liste si on clique ailleurs */}
      {showList && <div onClick={() => setShowList(false)} style={{ position:'fixed',inset:0,zIndex:50 }} />}

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'16px 22px',background:'rgba(11,13,23,.95)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        <button onClick={handleNext} disabled={!location}
          style={{ width:'100%',padding:'17px',background:location?'#FF4D2E':'rgba(255,255,255,.1)',border:'none',borderRadius:16,color:location?'#fff':'rgba(255,255,255,.3)',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:location?'pointer':'not-allowed' }}>
          Continuer →
        </button>
        {!location && <p style={{ textAlign:'center',fontSize:11,color:'rgba(255,255,255,.3)',marginTop:8 }}>Veuillez sélectionner une ville pour continuer</p>}
      </div>
    </div>
  )
}