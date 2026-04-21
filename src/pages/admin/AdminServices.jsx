import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils/calculateQuote'
import { NavAdmin } from './AdminDashboard'

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('services')
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showCityForm, setShowCityForm] = useState(false)
  const [newCity, setNewCity] = useState('')
  const [savingCity, setSavingCity] = useState(false)
  const [form, setForm] = useState({ category_id:'', name:'', description:'', price:'', unit:'forfait', vat_rate:20 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      supabase.from('services').select('*, service_categories(name, icon)').order('name'),
      supabase.from('service_categories').select('*').order('display_order'),
      supabase.from('cities').select('*').order('name'),
    ]).then(([{ data: svcs }, { data: cats }, { data: cts }]) => {
      setServices(svcs || [])
      setCategories(cats || [])
      setCities(cts || [])
      setLoading(false)
    })
  }, [])

  // ── SERVICES ──────────────────────────────────────────
  const toggleService = async (svc) => {
    await supabase.from('services').update({ is_active: !svc.is_active }).eq('id', svc.id)
    setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_active: !svc.is_active } : s))
  }

  const addService = async () => {
    if (!form.name || !form.price || !form.category_id) return
    setSaving(true)
    const { data } = await supabase.from('services').insert({
      ...form, price: parseFloat(form.price), is_active: true
    }).select('*, service_categories(name, icon)').single()
    if (data) setServices(prev => [...prev, data])
    setForm({ category_id:'', name:'', description:'', price:'', unit:'forfait', vat_rate:20 })
    setShowServiceForm(false)
    setSaving(false)
  }

  // ── VILLES ────────────────────────────────────────────
  const toggleCity = async (city) => {
    await supabase.from('cities').update({ is_active: !city.is_active }).eq('id', city.id)
    setCities(prev => prev.map(c => c.id === city.id ? { ...c, is_active: !city.is_active } : c))
  }

  const addCity = async () => {
    if (!newCity.trim()) return
    setSavingCity(true)
    const { data } = await supabase.from('cities').insert({ name: newCity.trim(), is_active: true }).select().single()
    if (data) setCities(prev => [...prev, data].sort((a,b) => a.name.localeCompare(b.name)))
    setNewCity('')
    setShowCityForm(false)
    setSavingCity(false)
  }

  const deleteCity = async (id) => {
    await supabase.from('cities').delete().eq('id', id)
    setCities(prev => prev.filter(c => c.id !== id))
  }

  const grouped = services.reduce((acc, svc) => {
    const cat = svc.service_categories?.name || 'Autre'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(svc)
    return acc
  }, {})

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>

      {/* Header */}
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0' }}>
        <div>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800 }}>Gestion</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginTop:2 }}>Services et villes</div>
        </div>
        <button
          onClick={() => tab === 'services' ? setShowServiceForm(!showServiceForm) : setShowCityForm(!showCityForm)}
          style={{ background:'#FF4D2E',border:'none',borderRadius:12,padding:'9px 16px',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>
          {(tab === 'services' ? showServiceForm : showCityForm) ? '✕' : '+ Ajouter'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex',gap:0,margin:'16px 22px 0',background:'#111827',borderRadius:14,padding:4 }}>
        {[['services','🛎️ Services'],['cities','📍 Villes']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ flex:1,padding:'10px',background:tab===key?'#FF4D2E':'transparent',border:'none',borderRadius:11,color:tab===key?'#fff':'rgba(255,255,255,.4)',fontSize:13,fontWeight:tab===key?700:400,cursor:'pointer',fontFamily:"'Outfit',sans-serif",transition:'all .2s' }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding:'16px 22px 100px' }}>

        {/* ── ONGLET SERVICES ── */}
        {tab === 'services' && (
          <>
            {showServiceForm && (
              <div style={{ background:'rgba(255,77,46,.06)',border:'1px solid rgba(255,77,46,.2)',borderRadius:16,padding:'18px',marginBottom:20 }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:14 }}>Nouveau service</div>
                <select value={form.category_id} onChange={e => setForm({...form,category_id:e.target.value})}
                  style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'13px 16px',fontSize:13,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:12 }}>
                  <option value="">Choisir une catégorie</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
                <input placeholder="Nom du service *" value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                  style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'13px 16px',fontSize:13,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:12 }} />
                <input placeholder="Description (optionnel)" value={form.description} onChange={e => setForm({...form,description:e.target.value})}
                  style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'13px 16px',fontSize:13,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:12 }} />
                <div style={{ display:'flex',gap:10,marginBottom:12 }}>
                  <input type="number" placeholder="Prix *" value={form.price} onChange={e => setForm({...form,price:e.target.value})}
                    style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'13px 16px',fontSize:13,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none' }} />
                  <select value={form.unit} onChange={e => setForm({...form,unit:e.target.value})}
                    style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'13px 12px',fontSize:13,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none' }}>
                    <option value="forfait">Forfait</option>
                    <option value="personne">Personne</option>
                    <option value="heure">Heure</option>
                    <option value="jour">Jour</option>
                  </select>
                </div>
                <button onClick={addService} disabled={saving}
                  style={{ width:'100%',padding:'14px',background:'#FF4D2E',border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',opacity:saving?0.7:1 }}>
                  {saving ? 'Enregistrement...' : 'Ajouter ce service'}
                </button>
              </div>
            )}

            {loading ? <p style={{ color:'rgba(255,255,255,.3)' }}>Chargement...</p> : (
              Object.entries(grouped).map(([cat, svcs]) => (
                <div key={cat}>
                  <div style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.1em',margin:'20px 0 10px' }}>
                    {svcs[0]?.service_categories?.icon} {cat} · {svcs.length} service{svcs.length>1?'s':''}
                  </div>
                  {svcs.map(svc => (
                    <div key={svc.id} style={{ display:'flex',alignItems:'center',gap:12,background:'#111827',border:`1px solid ${svc.is_active?'rgba(255,255,255,.07)':'rgba(239,68,68,.2)'}`,borderRadius:12,padding:'12px 14px',marginBottom:8,opacity:svc.is_active?1:0.6 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13,fontWeight:500,color:svc.is_active?'#fff':'rgba(255,255,255,.4)',marginBottom:2 }}>{svc.name}</div>
                        <div style={{ fontSize:11,color:'#FF4D2E' }}>{formatPrice(svc.price)} / {svc.unit}</div>
                      </div>
                      <button onClick={() => toggleService(svc)}
                        style={{ background:svc.is_active?'rgba(16,185,129,.15)':'rgba(239,68,68,.15)',border:`1px solid ${svc.is_active?'rgba(16,185,129,.3)':'rgba(239,68,68,.3)'}`,borderRadius:8,padding:'5px 12px',fontSize:11,fontWeight:600,color:svc.is_active?'#10B981':'#EF4444',cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>
                        {svc.is_active ? 'Actif' : 'Inactif'}
                      </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}

        {/* ── ONGLET VILLES ── */}
        {tab === 'cities' && (
          <>
            {/* Info */}
            <div style={{ background:'rgba(255,77,46,.05)',border:'1px solid rgba(255,77,46,.15)',borderRadius:12,padding:'12px 14px',marginBottom:16,fontSize:12,color:'rgba(255,255,255,.5)',lineHeight:1.5 }}>
              📍 Seules les villes <b style={{ color:'#FF4D2E' }}>actives</b> seront proposées aux clients dans le formulaire de devis.
            </div>

            {/* Formulaire ajout ville */}
            {showCityForm && (
              <div style={{ background:'rgba(255,77,46,.06)',border:'1px solid rgba(255,77,46,.2)',borderRadius:16,padding:'18px',marginBottom:16 }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:12 }}>Nouvelle ville</div>
                <input
                  placeholder="Ex: Abidjan, Dakar, Montréal..."
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCity()}
                  style={{ width:'100%',background:'#111827',border:'1px solid rgba(255,255,255,.08)',borderRadius:12,padding:'13px 16px',fontSize:14,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none',marginBottom:12 }} />
                <button onClick={addCity} disabled={savingCity || !newCity.trim()}
                  style={{ width:'100%',padding:'13px',background:'#FF4D2E',border:'none',borderRadius:12,color:'#fff',fontSize:14,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',opacity:savingCity||!newCity.trim()?0.5:1 }}>
                  {savingCity ? 'Ajout...' : 'Ajouter cette ville'}
                </button>
              </div>
            )}

            {/* Stats */}
            <div style={{ display:'flex',gap:10,marginBottom:16 }}>
              <div style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:'12px',textAlign:'center' }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#FF4D2E' }}>{cities.filter(c=>c.is_active).length}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.07em' }}>Villes actives</div>
              </div>
              <div style={{ flex:1,background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:12,padding:'12px',textAlign:'center' }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'rgba(255,255,255,.3)' }}>{cities.filter(c=>!c.is_active).length}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.07em' }}>Désactivées</div>
              </div>
            </div>

            {/* Liste des villes */}
            {loading ? <p style={{ color:'rgba(255,255,255,.3)' }}>Chargement...</p> : cities.length === 0 ? (
              <div style={{ textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,.3)' }}>
                <div style={{ fontSize:32,marginBottom:10 }}>📍</div>
                <div>Aucune ville configurée</div>
                <div style={{ fontSize:12,marginTop:6 }}>Cliquez sur "+ Ajouter" pour commencer</div>
              </div>
            ) : (
              cities.map(city => (
                <div key={city.id} style={{ display:'flex',alignItems:'center',gap:12,background:'#111827',border:`1px solid ${city.is_active?'rgba(255,255,255,.07)':'rgba(239,68,68,.15)'}`,borderRadius:12,padding:'13px 14px',marginBottom:8,opacity:city.is_active?1:0.6 }}>
                  <span style={{ fontSize:16 }}>📍</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14,fontWeight:500,color:city.is_active?'#fff':'rgba(255,255,255,.4)' }}>{city.name}</div>
                    <div style={{ fontSize:10,color:city.is_active?'#10B981':'#EF4444',marginTop:2 }}>
                      {city.is_active ? '✓ Disponible pour les clients' : '✗ Non disponible'}
                    </div>
                  </div>
                  <div style={{ display:'flex',gap:6 }}>
                    <button onClick={() => toggleCity(city)}
                      style={{ background:city.is_active?'rgba(16,185,129,.15)':'rgba(239,68,68,.15)',border:`1px solid ${city.is_active?'rgba(16,185,129,.3)':'rgba(239,68,68,.3)'}`,borderRadius:8,padding:'5px 10px',fontSize:11,fontWeight:600,color:city.is_active?'#10B981':'#EF4444',cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>
                      {city.is_active ? 'Actif' : 'Inactif'}
                    </button>
                    <button onClick={() => deleteCity(city.id)}
                      style={{ background:'rgba(239,68,68,.1)',border:'1px solid rgba(239,68,68,.2)',borderRadius:8,padding:'5px 10px',fontSize:11,color:'#EF4444',cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>
                      🗑
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
      <NavAdmin active="/admin/services" />
    </div>
  )
}