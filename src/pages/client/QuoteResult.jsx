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
  const [quote, setQuote] = useState(null)
  const [items, setItems] = useState([])
  const [downloading, setDownloading] = useState(false)

  const quoteId = sessionStorage.getItem('generatedQuoteId')
  const eventType  = sessionStorage.getItem('quoteEventLabel') || ''
  const guests     = parseInt(sessionStorage.getItem('quoteGuests') || 40)
  const date       = sessionStorage.getItem('quoteDate') || ''
  const location   = sessionStorage.getItem('quoteLocation') || ''
  const selectedRaw = sessionStorage.getItem('quoteSelectedServices') || '[]'
  const selectedSvcs = JSON.parse(selectedRaw)

  useEffect(() => {
    supabase.from('company').select('*').single().then(({ data }) => setCompany(data))
    if (quoteId) {
      supabase.from('quotes').select('*').eq('id', quoteId).single().then(({ data }) => setQuote(data))
      supabase.from('quote_items').select('*').eq('quote_id', quoteId).then(({ data }) => setItems(data || []))
    }
  }, [quoteId])

  const totalHT  = items.reduce((a, i) => a + i.total_ht, 0)
  const totalTVA = totalHT * 0.2
  const totalTTC = totalHT + totalTVA

  const downloadPDF = async () => {
    setDownloading(true)
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      pdf.save(`devis-${quote?.quote_number || 'MirlaEvent'}.pdf`)
    } catch (e) {
      console.error(e)
    }
    setDownloading(false)
  }

  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const validUntil = new Date(); validUntil.setDate(validUntil.getDate() + 30)
  const validStr = validUntil.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
        <span style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800 }}>MirlaEvent</span>
        <span style={{ background:'rgba(245,158,11,.15)',border:'1px solid rgba(245,158,11,.3)',borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:600,color:'#F59E0B' }}>⏳ En attente</span>
      </div>

      <div style={{ padding:'24px 22px 120px' }}>
        {/* Succès */}
        <div style={{ textAlign:'center',marginBottom:24 }}>
          <div style={{ width:60,height:60,borderRadius:'50%',background:'rgba(255,77,46,.12)',border:'2px solid #FF4D2E',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,margin:'0 auto 12px' }}>✓</div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:4 }}>Votre devis est prêt !</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,.35)' }}>Valable jusqu'au {validStr}</div>
        </div>

        {/* PDF PREVIEW */}
        <div ref={pdfRef} style={{ background:'#ffffff',borderRadius:12,overflow:'hidden',marginBottom:20 }}>

          {/* Header */}
          <div style={{ background:'#0D1B2A',padding:'18px 20px',display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
            <div style={{ color:'#94A3B8',fontSize:10,lineHeight:1.7 }}>
              <div style={{ color:'#fff',fontSize:13,fontWeight:700,marginBottom:3 }}>{company?.name || 'MirlaEvent'}</div>
              {company?.address}<br />
              {company?.phone} · {company?.email}<br />
              SIRET : {company?.siret}
            </div>
            <div style={{ textAlign:'right' }}>
              {company?.logo_url && <img src={company.logo_url} alt="logo" style={{ width:60,height:60,objectFit:'contain',marginBottom:6 }} />}
              <div style={{ color:'#00D4AA',fontSize:20,fontWeight:700,fontFamily:"Georgia,serif" }}>DEVIS</div>
              <div style={{ color:'#64748B',fontSize:9,marginTop:2 }}>N° {quote?.quote_number || 'DEV-2025-XXX'}</div>
              <div style={{ color:'#64748B',fontSize:9 }}>Émis le {today}</div>
            </div>
          </div>

          {/* Infos client & événement */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',borderBottom:'1px solid #E2E8F0' }}>
            <div style={{ padding:'12px 16px',borderRight:'1px solid #E2E8F0' }}>
              <div style={{ fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',color:'#94A3B8',marginBottom:5 }}>Client</div>
              <div style={{ fontSize:12,fontWeight:600,color:'#1E293B' }}>Votre nom</div>
              <div style={{ fontSize:10,color:'#64748B' }}>Votre email</div>
            </div>
            <div style={{ padding:'12px 16px' }}>
              <div style={{ fontSize:9,fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',color:'#94A3B8',marginBottom:5 }}>Événement</div>
              <div style={{ fontSize:12,fontWeight:600,color:'#1E293B' }}>{eventType}</div>
              {date && <div style={{ fontSize:10,color:'#64748B' }}>{new Date(date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})}</div>}
              {location && <div style={{ fontSize:10,color:'#64748B' }}>{location}</div>}
              <div style={{ fontSize:10,color:'#64748B' }}>{guests} personnes</div>
            </div>
          </div>

          {/* Tableau des prestations */}
          <div style={{ padding:'0 16px' }}>
            <div style={{ display:'grid',gridTemplateColumns:'2fr .6fr 1fr .7fr 1fr',padding:'6px 8px',fontSize:8,fontWeight:700,textTransform:'uppercase',color:'#94A3B8',borderBottom:'1px solid #E2E8F0',marginTop:10 }}>
              <span>Prestation</span><span style={{ textAlign:'center' }}>TVA</span><span style={{ textAlign:'right' }}>P.U. HT</span><span style={{ textAlign:'center' }}>Qté</span><span style={{ textAlign:'right' }}>Total HT</span>
            </div>
            {items.map((item, i) => (
              <div key={i} style={{ display:'grid',gridTemplateColumns:'2fr .6fr 1fr .7fr 1fr',padding:'7px 8px',fontSize:10,borderBottom:'1px solid #F1F5F9',background:i%2===0?'#F8FAFC':'#fff',alignItems:'center' }}>
                <span style={{ fontWeight:500,color:'#1E293B' }}>{item.service_name}</span>
                <span style={{ textAlign:'center',color:'#64748B' }}>{item.vat_rate}%</span>
                <span style={{ textAlign:'right',color:'#64748B' }}>{formatPrice(item.unit_price)}</span>
                <span style={{ textAlign:'center',color:'#64748B' }}>{item.quantity} {item.unit==='personne'?'pers.':'x'}</span>
                <span style={{ textAlign:'right',fontWeight:600,color:'#1E293B' }}>{formatPrice(item.total_ht)}</span>
              </div>
            ))}
          </div>

          {/* Totaux */}
          <div style={{ display:'flex',justifyContent:'flex-end',padding:'10px 16px' }}>
            <div style={{ width:180 }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:10,color:'#64748B',padding:'2px 0' }}>
                <span>Total HT</span><span>{formatPrice(totalHT)}</span>
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:10,color:'#64748B',padding:'2px 0' }}>
                <span>TVA (20%)</span><span>{formatPrice(totalTVA)}</span>
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',padding:'6px 10px',background:'#0D1B2A',borderRadius:6,marginTop:5 }}>
                <span style={{ fontSize:11,fontWeight:700,color:'#fff' }}>Total TTC</span>
                <span style={{ fontSize:11,fontWeight:700,color:'#F59E0B' }}>{formatPrice(totalTTC)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding:'12px 16px',background:'#F8FAFC',borderTop:'1px solid #E2E8F0',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
            <div style={{ fontSize:8,color:'#94A3B8',lineHeight:1.6,maxWidth:200 }}>
              Devis valable 30 jours · {company?.payment_conditions || 'Acompte de 30% à la signature'}<br />
              SIRET {company?.siret}
            </div>
            {company?.stamp_url ? (
              <img src={company.stamp_url} alt="tampon" style={{ width:70,height:55,objectFit:'contain' }} />
            ) : (
              <div style={{ width:70,height:55,border:'1.5px dashed #CBD5E1',borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,color:'#CBD5E1',textAlign:'center' }}>
                Tampon<br />officiel
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          <button onClick={downloadPDF} disabled={downloading}
            style={{ width:'100%',padding:'17px',background:'#F59E0B',border:'none',borderRadius:16,color:'#0A0F1A',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',boxShadow:'0 8px 32px rgba(245,158,11,.3)',opacity:downloading?0.7:1 }}>
            {downloading ? 'Téléchargement...' : '⬇ Télécharger le PDF'}
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ width:'100%',padding:'17px',background:'transparent',border:'1px solid rgba(255,77,46,.3)',borderRadius:16,color:'#FF4D2E',fontSize:14,fontFamily:"'Outfit',sans-serif",cursor:'pointer' }}>
            Voir mes devis →
          </button>
        </div>
      </div>
    </div>
  )
}
