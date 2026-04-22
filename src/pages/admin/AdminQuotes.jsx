import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/calculateQuote'
import { NavAdmin } from './AdminDashboard'

const STATUS = {
  en_attente: { label:'En attente', color:'#F59E0B', bg:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.3)' },
  confirme:   { label:'Confirmé',   color:'#10B981', bg:'rgba(16,185,129,.15)', border:'rgba(16,185,129,.3)' },
  refuse:     { label:'Refusé',     color:'#EF4444', bg:'rgba(239,68,68,.15)',  border:'rgba(239,68,68,.3)'  },
}

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    supabase
      .from('quotes')
      .select(`
        *,
        clients (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setQuotes(data || []); setLoading(false) })
  }, [])

  const openQuote = async (q) => {
    setSelected(q)
    const { data } = await supabase
      .from('quote_items')
      .select('*')
      .eq('quote_id', q.id)
    setItems(data || [])
  }

  const changeStatus = async (quoteId, status) => {
    await supabase.from('quotes').update({ status }).eq('id', quoteId)
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q))
    if (selected?.id === quoteId) setSelected(prev => ({ ...prev, status }))
  }

  // ── VUE DÉTAIL D'UN DEVIS ─────────────────────────────
  if (selected) {
    const st = STATUS[selected.status] || STATUS.en_attente
    const totalHT  = items.reduce((a, i) => a + i.total_ht, 0)
    const totalTVA = totalHT * 0.2
    const totalTTC = totalHT + totalTVA

    return (
      <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
          <button onClick={() => { setSelected(null); setItems([]) }}
            style={{ background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.4)',fontSize:13,fontFamily:"'Outfit',sans-serif" }}>
            ← Retour
          </button>
          <span style={{ background:st.bg,border:`1px solid ${st.border}`,borderRadius:8,padding:'4px 10px',fontSize:11,fontWeight:600,color:st.color }}>
            {st.label}
          </span>
        </div>

        <div style={{ padding:'20px 22px 120px' }}>

          {/* Numéro devis */}
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,marginBottom:3 }}>
              {selected.event_type}
            </div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,.35)' }}>
              {selected.quote_number} · Créé le {new Date(selected.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>

          {/* Infos client */}
          <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'16px',marginBottom:12 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10 }}>
              👤 Informations client
            </div>
            <div style={{ fontSize:15,fontWeight:600,marginBottom:5 }}>
              {selected.clients?.first_name || '—'} {selected.clients?.last_name || ''}
            </div>
            <div style={{ fontSize:12,color:'rgba(255,255,255,.5)',marginBottom:3 }}>
              📧 {selected.clients?.email || 'Email non disponible'}
            </div>
            {selected.clients?.phone && (
              <div style={{ fontSize:12,color:'rgba(255,255,255,.5)' }}>
                📞 {selected.clients.phone}
              </div>
            )}
          </div>

          {/* Infos événement */}
          <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'16px',marginBottom:12 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10 }}>
              🎉 Détails de l'événement
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
              <div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',marginBottom:3 }}>Type</div>
                <div style={{ fontSize:13,fontWeight:500 }}>{selected.event_type}</div>
              </div>
              <div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',marginBottom:3 }}>Personnes</div>
                <div style={{ fontSize:13,fontWeight:500 }}>{selected.guest_count} pers.</div>
              </div>
              {selected.event_date && (
                <div>
                  <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',marginBottom:3 }}>Date</div>
                  <div style={{ fontSize:13,fontWeight:500 }}>
                    {new Date(selected.event_date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
              )}
              {selected.event_location && (
                <div>
                  <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',marginBottom:3 }}>Lieu</div>
                  <div style={{ fontSize:13,fontWeight:500 }}>📍 {selected.event_location}</div>
                </div>
              )}
              <div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',marginBottom:3 }}>Valable jusqu'au</div>
                <div style={{ fontSize:13,fontWeight:500 }}>
                  {selected.valid_until ? new Date(selected.valid_until).toLocaleDateString('fr-FR') : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Prestations */}
          <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'16px',marginBottom:12 }}>
            <div style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:10 }}>
              🛎️ Prestations sélectionnées
            </div>
            {items.length === 0 ? (
              <p style={{ color:'rgba(255,255,255,.3)',fontSize:12 }}>Chargement...</p>
            ) : (
              items.map((item, i) => (
                <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<items.length-1?'1px solid rgba(255,255,255,.05)':'none' }}>
                  <div>
                    <div style={{ fontSize:13,color:'rgba(255,255,255,.8)' }}>{item.service_name}</div>
                    <div style={{ fontSize:10,color:'rgba(255,255,255,.3)',marginTop:2 }}>
                      {item.quantity} {item.unit} × {formatPrice(item.unit_price)}
                    </div>
                  </div>
                  <div style={{ fontSize:13,fontWeight:600,color:'#fff' }}>{formatPrice(item.total_ht)}</div>
                </div>
              ))
            )}

            {/* Totaux */}
            <div style={{ marginTop:14,paddingTop:14,borderTop:'1px solid rgba(255,255,255,.08)' }}>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:5 }}>
                <span>Total HT</span><span>{formatPrice(selected.total_ht)}</span>
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:10 }}>
                <span>TVA (20%)</span><span>{formatPrice(selected.total_tva)}</span>
              </div>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,77,46,.1)',border:'1px solid rgba(255,77,46,.2)',borderRadius:10,padding:'12px 14px' }}>
                <span style={{ fontSize:14,fontWeight:600 }}>Total TTC</span>
                <span style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#F59E0B' }}>
                  {formatPrice(selected.total_ttc)}
                </span>
              </div>
            </div>
          </div>

          {/* Changer le statut */}
          <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'16px' }}>
            <div style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12 }}>
              ⚡ Changer le statut
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {Object.entries(STATUS).map(([key, val]) => (
                <button key={key} onClick={() => changeStatus(selected.id, key)}
                  style={{ padding:'14px 16px',background:selected.status===key?val.bg:'rgba(255,255,255,.03)',border:`1px solid ${selected.status===key?val.border:'rgba(255,255,255,.07)'}`,borderRadius:12,color:selected.status===key?val.color:'rgba(255,255,255,.5)',fontSize:13,fontWeight:selected.status===key?700:400,fontFamily:"'Outfit',sans-serif",cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:8,transition:'all .2s' }}>
                  <span style={{ fontSize:16 }}>
                    {key==='en_attente'?'⏳':key==='confirme'?'✓':'✗'}
                  </span>
                  {val.label}
                  {selected.status===key && <span style={{ marginLeft:'auto',fontSize:11 }}>← Actuel</span>}
                </button>
              ))}
            </div>
          </div>

        </div>
        <NavAdmin active="/admin/quotes" />
      </div>
    )
  }

  // ── LISTE DES DEVIS ────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800 }}>Tous les devis</div>
        <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginTop:2 }}>{quotes.length} devis au total</div>
      </div>

      <div style={{ padding:'16px 22px 100px' }}>
        {loading ? (
          <p style={{ color:'rgba(255,255,255,.3)' }}>Chargement...</p>
        ) : quotes.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 20px',color:'rgba(255,255,255,.3)' }}>
            <div style={{ fontSize:40,marginBottom:12 }}>📋</div>
            <div style={{ fontSize:14 }}>Aucun devis reçu pour l'instant</div>
          </div>
        ) : (
          quotes.map(q => {
            const st = STATUS[q.status] || STATUS.en_attente
            return (
              <div key={q.id} onClick={() => openQuote(q)}
                style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:14,padding:'14px 16px',marginBottom:10,cursor:'pointer',transition:'border .2s' }}>

                {/* Ligne 1 : client + statut */}
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600,marginBottom:2 }}>
                      {selected?.clients?.first_name
                        ? `${q.clients?.first_name} ${q.clients?.last_name}`
                        : q.clients?.first_name
                          ? `${q.clients.first_name} ${q.clients.last_name}`
                          : 'Client'}
                    </div>
                    <div style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>
                      {q.clients?.email || '—'}
                    </div>
                  </div>
                  <span style={{ background:st.bg,border:`1px solid ${st.border}`,borderRadius:8,padding:'3px 9px',fontSize:10,fontWeight:600,color:st.color,flexShrink:0 }}>
                    {st.label}
                  </span>
                </div>

                {/* Ligne 2 : event + total */}
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:12,color:'rgba(255,255,255,.6)',marginBottom:2 }}>
                      {q.event_type} · {q.guest_count} pers.
                      {q.event_location ? ` · ${q.event_location}` : ''}
                    </div>
                    <div style={{ fontSize:10,color:'rgba(255,255,255,.3)' }}>
                      {q.quote_number} · {new Date(q.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div style={{ fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:800,color:'#F59E0B' }}>
                    {formatPrice(q.total_ttc)}
                  </div>
                </div>

              </div>
            )
          })
        )}
      </div>
      <NavAdmin active="/admin/quotes" />
    </div>
  )
}