import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { calculateQuote, formatPrice, generateQuoteNumber } from '../../utils/calculateQuote'
import { useAuth } from '../../hooks/useAuth'

export default function ContactForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const eventType    = sessionStorage.getItem('quoteEventLabel') || ''
  const eventIcon    = sessionStorage.getItem('quoteEventIcon')  || ''
  const guests       = parseInt(sessionStorage.getItem('quoteGuests') || 40)
  const date         = sessionStorage.getItem('quoteDate')     || ''
  const location     = sessionStorage.getItem('quoteLocation') || ''
  const selectedRaw  = sessionStorage.getItem('quoteSelectedServices') || '[]'
  const selectedSvcs = JSON.parse(selectedRaw)
  const { items, total_ht, total_tva, total_ttc } = calculateQuote(selectedSvcs, guests)

  const handleGenerate = async () => {
    if (!user) { setError('Vous devez être connecté.'); return }
    setLoading(true)
    setError('')

    try {
      // ✅ ÉTAPE 1 — S'assurer que le client existe dans la table clients
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!existingClient) {
        const { error: clientErr } = await supabase.from('clients').insert({
          id:         user.id,
          first_name: user.user_metadata?.first_name || 'Client',
          last_name:  user.user_metadata?.last_name  || '',
          email:      user.email,
          phone:      user.user_metadata?.phone      || null,
        })
        if (clientErr && clientErr.code !== '23505') {
          throw clientErr
        }
      }

      // ✅ ÉTAPE 2 — Créer le devis
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + 30)

      const { data: quote, error: qErr } = await supabase
        .from('quotes')
        .insert({
          quote_number:   generateQuoteNumber(),
          client_id:      user.id,
          event_type:     eventType,
          event_date:     date     || null,
          event_location: location || null,
          guest_count:    guests,
          total_ht,
          total_tva,
          total_ttc,
          status:      'en_attente',
          valid_until: validUntil.toISOString().split('T')[0],
        })
        .select()
        .single()

      if (qErr) throw qErr

      // ✅ ÉTAPE 3 — Créer les lignes du devis
      const lineItems = items.map(item => ({ ...item, quote_id: quote.id }))
      const { error: iErr } = await supabase.from('quote_items').insert(lineItems)
      if (iErr) throw iErr

      // ✅ ÉTAPE 4 — Naviguer vers le résultat
      sessionStorage.setItem('generatedQuoteId',     quote.id)
      sessionStorage.setItem('generatedQuoteNumber', quote.quote_number)
      navigate('/quote/result')

    } catch (err) {
      console.error('Erreur génération devis:', err)
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
        <button onClick={() => navigate('/quote/services')} style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'Outfit',sans-serif" }}>← Retour</button>
        <div style={{ display:'flex',gap:5 }}>
          {[1,1,1,1,0].map((a,i) => (
            <div key={i} style={{ width:6,height:6,borderRadius:'50%',background:a?'#FF4D2E':'rgba(255,255,255,.1)' }} />
          ))}
        </div>
      </div>

      <div style={{ padding:'28px 22px 120px' }}>
        <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:32,fontWeight:800,lineHeight:1.1,marginBottom:8 }}>
          Récapitulatif<br/>de votre devis
        </h1>
        <p style={{ fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:24,lineHeight:1.6 }}>
          Vérifiez les détails avant de générer votre PDF.
        </p>

        {/* Récapitulatif événement */}
        <div style={{ background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:18,padding:'18px',marginBottom:16,position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#FF4D2E,#FFB800,transparent)' }} />

          <div style={{ marginBottom:12 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <img 
               src={eventIcon} 
               alt={eventType} 
               style={{ width:24, height:24, objectFit:'cover', borderRadius:4 }}
             />
             <span>{eventType}</span>
            </div>
            <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>
              {guests} personnes
              {date     ? ` · ${new Date(date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}` : ''}
              {location ? ` · ${location}` : ''}
            </div>
          </div>

          {items.map((item, i) => (
            <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<items.length-1?'1px solid rgba(255,255,255,.05)':'none' }}>
              <span style={{ fontSize:12,color:'rgba(255,255,255,.6)' }}>{item.service_name}</span>
              <span style={{ fontSize:12,fontWeight:600 }}>{formatPrice(item.total_ht)}</span>
            </div>
          ))}

          <div style={{ marginTop:12,paddingTop:12,borderTop:'1px solid rgba(255,255,255,.08)' }}>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:4 }}>
              <span>Total HT</span><span>{formatPrice(total_ht)}</span>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:8 }}>
              <span>TVA 20%</span><span>{formatPrice(total_tva)}</span>
            </div>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,77,46,.1)',border:'1px solid rgba(255,77,46,.2)',borderRadius:10,padding:'10px 14px' }}>
              <span style={{ fontSize:13,color:'rgba(255,255,255,.5)' }}>Total TTC</span>
              <span style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#F59E0B' }}>{formatPrice(total_ttc)}</span>
            </div>
          </div>
        </div>

        {/* Message optionnel */}
        <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:7,display:'block' }}>
          Message / précisions (optionnel)
        </label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={3}
          placeholder="Thème particulier, contraintes, questions..."
          style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'14px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',resize:'none',marginBottom:16 }}
        />

        {error && (
          <div style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.3)',borderRadius:12,padding:'12px 16px',fontSize:12,color:'#FCA5A5',marginBottom:16 }}>
            {error}
          </div>
        )}

        <div style={{ background:'rgba(255,77,46,.05)',border:'1px solid rgba(255,77,46,.15)',borderRadius:12,padding:'12px 14px',fontSize:11,color:'rgba(255,255,255,.4)',lineHeight:1.5 }}>
          📄 Un devis PDF avec le logo et le tampon de l'entreprise sera généré automatiquement.
        </div>
      </div>

      <div style={{ position:'fixed',bottom:0,left:0,right:0,padding:'16px 22px',background:'rgba(11,13,23,.95)',backdropFilter:'blur(12px)',borderTop:'1px solid rgba(255,255,255,.08)',zIndex:100 }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ width:'100%',padding:'17px',background:'#FF4D2E',border:'none',borderRadius:16,color:'#fff',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',boxShadow:'0 8px 32px rgba(255,77,46,.3)',opacity:loading?0.7:1 }}>
          {loading ? 'Génération en cours...' : 'Générer mon devis PDF →'}
        </button>
      </div>
    </div>
  )
}