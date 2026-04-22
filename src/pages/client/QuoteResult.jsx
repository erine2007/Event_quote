import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/calculateQuote'
import { useAuth } from '../../hooks/useAuth'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function QuoteResult() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const pdfRef = useRef()
  const [company, setCompany] = useState(null)
  const [client, setClient] = useState(null)
  const [items, setItems] = useState([])
  const [quote, setQuote] = useState(null)
  const [downloading, setDownloading] = useState(false)

  const quoteId    = sessionStorage.getItem('generatedQuoteId')
  const eventLabel = sessionStorage.getItem('quoteEventLabel') || ''
  const eventIcon  = sessionStorage.getItem('quoteEventIcon')  || ''
  const guests     = parseInt(sessionStorage.getItem('quoteGuests') || 40)
  const date       = sessionStorage.getItem('quoteDate') || ''
  const location   = sessionStorage.getItem('quoteLocation') || ''

  useEffect(() => {
    supabase.from('company').select('*').single()
      .then(({ data }) => setCompany(data))
    if (user) {
      supabase.from('clients').select('*').eq('id', user.id).single()
        .then(({ data }) => setClient(data))
    }
    if (quoteId) {
      supabase.from('quotes').select('*').eq('id', quoteId).single()
        .then(({ data }) => setQuote(data))
      supabase.from('quote_items').select('*').eq('quote_id', quoteId)
        .then(({ data }) => setItems(data || []))
    }
  }, [quoteId, user])

  const totalHT  = items.reduce((a, i) => a + i.total_ht, 0)
  const totalTVA = totalHT * 0.2
  const totalTTC = totalHT + totalTVA

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
  const validUntil = new Date()
  validUntil.setDate(validUntil.getDate() + 30)
  const validStr = validUntil.toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const element = pdfRef.current
      const originalWidth    = element.style.width
      const originalMaxWidth = element.style.maxWidth
      element.style.width    = '794px'
      element.style.maxWidth = '794px'

      const canvas = await html2canvas(element, {
        scale:       2,
        backgroundColor: '#ffffff',
        useCORS:     true,
        allowTaint:  true,
        width:       794,
        windowWidth: 794,
      })

      element.style.width    = originalWidth
      element.style.maxWidth = originalMaxWidth

      const imgData = canvas.toDataURL('image/png')
      const pdf     = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
      const pageW   = pdf.internal.pageSize.getWidth()
      const imgH    = (canvas.height * pageW) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, imgH)
      pdf.save(`devis-${quote?.quote_number || 'mirlaevent'}.pdf`)
    } catch(e) {
      console.error('Erreur PDF:', e)
    }
    setDownloading(false)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>

      {/* Navbar */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800 }}>MirlaEvent</span>
        <span style={{ background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:600,color:'#F59E0B' }}>
          ⏳ En attente
        </span>
      </div>

      <div style={{ padding:'24px 22px 120px' }}>

        {/* Succès */}
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ width:60,height:60,borderRadius:'50%',background:'rgba(255,77,46,.12)',border:'2px solid #FF4D2E',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 12px' }}>✓</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Votre devis est prêt !</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,.35)' }}>Valable jusqu'au {validStr}</div>
        </div>

        {/* ── PDF ── */}
        <div ref={pdfRef} style={{ background:'#ffffff', borderRadius:0, overflow:'hidden', marginBottom:20, width:'100%' }}>

          {/* HEADER */}
          <div style={{ background:'#0D1B2A', padding:'26px 28px', display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderRadius:0 }}>
            <div>
              {company?.logo_url ? (
                <img src={company.logo_url} alt="logo" crossOrigin="anonymous"
                  style={{ height:64, objectFit:'contain', marginBottom:12, display:'block' }} />
              ) : (
                <div style={{ color:'#ffffff', fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, marginBottom:10, letterSpacing:'0.03em' }}>
                  {company?.name || 'MirlaEvent'}
                </div>
              )}
              <div style={{ color:'#94A3B8', fontSize:13, lineHeight:2.1 }}>
                {company?.address  && <span>{company.address}<br/></span>}
                {company?.phone    && <span>{company.phone}</span>}
                {company?.phone && company?.email && <span> · </span>}
                {company?.email    && <span>{company.email}<br/></span>}
                {company?.siret    && <span>SIRET : {company.siret}</span>}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#00D4AA', fontSize:30, fontWeight:700, fontFamily:'Georgia,serif', letterSpacing:'0.08em' }}>
                DEVIS
              </div>
              <div style={{ color:'#64748B', fontSize:13, marginTop:6 }}>N° {quote?.quote_number || '—'}</div>
              <div style={{ color:'#64748B', fontSize:13, marginTop:3 }}>Émis le {today}</div>
            </div>
          </div>

          {/* CLIENT + ÉVÉNEMENT */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:'1px solid #E2E8F0' }}>
            <div style={{ padding:'18px 24px', borderRight:'1px solid #E2E8F0' }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#94A3B8', marginBottom:10 }}>Client</div>
              <div style={{ fontSize:16, fontWeight:600, color:'#1E293B', marginBottom:5 }}>
                {client?.first_name || user?.user_metadata?.first_name || '—'}{' '}
                {client?.last_name  || user?.user_metadata?.last_name  || ''}
              </div>
              <div style={{ fontSize:13, color:'#64748B', marginBottom:3 }}>
                {client?.email || user?.email || '—'}
              </div>
              {client?.phone && (
                <div style={{ fontSize:13, color:'#64748B' }}>{client.phone}</div>
              )}
            </div>
            <div style={{ padding:'18px 24px' }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#94A3B8', marginBottom:10 }}>Événement</div>

              {/* ✅ FIX : affichage séparé de l'icône (img) et du label (texte) */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
                {eventIcon && (
                  <img
                    src={eventIcon}
                    alt={eventLabel}
                    crossOrigin="anonymous"
                    style={{ width:24, height:24, objectFit:'contain', borderRadius:4, flexShrink:0 }}
                  />
                )}
                <span style={{ fontSize:16, fontWeight:600, color:'#1E293B' }}>{eventLabel}</span>
              </div>

              {date && (
                <div style={{ fontSize:13, color:'#64748B', marginBottom:3 }}>
                  {new Date(date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}
                </div>
              )}
              {location && (
                <div style={{ fontSize:13, color:'#64748B', marginBottom:3 }}>📍 {location}</div>
              )}
              <div style={{ fontSize:13, color:'#64748B' }}>{guests} personnes</div>
            </div>
          </div>

          {/* TABLEAU PRESTATIONS */}
          <div style={{ padding:'0 24px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr .6fr 1fr .7fr 1fr', padding:'10px 8px', fontSize:11, fontWeight:700, textTransform:'uppercase', color:'#94A3B8', borderBottom:'1px solid #E2E8F0', marginTop:18 }}>
              <span>Prestation</span>
              <span style={{ textAlign:'center' }}>TVA</span>
              <span style={{ textAlign:'right' }}>P.U. HT</span>
              <span style={{ textAlign:'center' }}>Qté</span>
              <span style={{ textAlign:'right' }}>Total HT</span>
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr .6fr 1fr .7fr 1fr', padding:'12px 8px', fontSize:13, borderBottom:'1px solid #F1F5F9', background:i%2===0?'#F8FAFC':'#ffffff', alignItems:'center' }}>
                <span style={{ fontWeight:500, color:'#1E293B' }}>{item.service_name}</span>
                <span style={{ textAlign:'center', color:'#64748B' }}>{item.vat_rate}%</span>
                <span style={{ textAlign:'right', color:'#64748B' }}>{formatPrice(item.unit_price)}</span>
                <span style={{ textAlign:'center', color:'#64748B' }}>
                  {item.quantity} {item.unit==='personne'?'pers.':'x'}
                </span>
                <span style={{ textAlign:'right', fontWeight:600, color:'#1E293B' }}>{formatPrice(item.total_ht)}</span>
              </div>
            ))}
          </div>

          {/* TOTAUX */}
          <div style={{ display:'flex', justifyContent:'flex-end', padding:'18px 24px' }}>
            <div style={{ width:230 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#64748B', padding:'5px 0' }}>
                <span>Total HT</span><span>{formatPrice(totalHT)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#64748B', padding:'5px 0', marginBottom:10 }}>
                <span>TVA (20%)</span><span>{formatPrice(totalTVA)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', background:'#0D1B2A', borderRadius:8 }}>
                <span style={{ fontSize:15, fontWeight:700, color:'#ffffff' }}>Total TTC</span>
                <span style={{ fontSize:15, fontWeight:700, color:'#F59E0B' }}>{formatPrice(totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* FOOTER + TAMPON */}
          <div style={{ padding:'16px 24px 20px', background:'#F8FAFC', borderTop:'1px solid #E2E8F0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:11, color:'#94A3B8', lineHeight:2.0, maxWidth:280 }}>
              Devis valable {company?.quote_validity_days || 30} jours<br/>
              {company?.payment_conditions}<br/>
              SIRET {company?.siret}
            </div>
            {company?.stamp_url ? (
              <div style={{ transform:'rotate(-12deg)', transformOrigin:'center', flexShrink:0 }}>
                <img src={company.stamp_url} alt="tampon officiel" crossOrigin="anonymous"
                  style={{ width:125, height:98, objectFit:'contain', opacity:0.88 }} />
              </div>
            ) : (
              <div style={{ width:90, height:70, border:'1.5px dashed #CBD5E1', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#CBD5E1', textAlign:'center', transform:'rotate(-12deg)', flexShrink:0 }}>
                Tampon<br/>officiel
              </div>
            )}
          </div>

        </div>

        {/* Boutons */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={downloadPDF} disabled={downloading}
            style={{ width:'100%', padding:'17px', background:'#F59E0B', border:'none', borderRadius:16, color:'#0A0F1A', fontSize:15, fontWeight:700, fontFamily:"'Outfit',sans-serif", cursor:'pointer', boxShadow:'0 8px 32px rgba(245,158,11,.3)', opacity:downloading?0.7:1 }}>
            {downloading ? 'Téléchargement...' : '⬇ Télécharger le PDF'}
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ width:'100%', padding:'17px', background:'transparent', border:'1px solid rgba(255,77,46,.3)', borderRadius:16, color:'#FF4D2E', fontSize:14, fontFamily:"'Outfit',sans-serif", cursor:'pointer' }}>
            Voir mes devis →
          </button>
        </div>

      </div>
    </div>
  )
}