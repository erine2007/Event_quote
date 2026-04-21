import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { NavAdmin } from './AdminDashboard'

export default function AdminProfile() {
  const [company, setCompany] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState({ logo: false, stamp: false })

  useEffect(() => {
    supabase.from('company').select('*').single().then(({ data }) => {
      setCompany(data)
      setForm(data || {})
    })
  }, [])

  const saveInfo = async () => {
    setSaving(true)
    await supabase.from('company').update({
      name: form.name, address: form.address, phone: form.phone,
      email: form.email, siret: form.siret,
      payment_conditions: form.payment_conditions,
      quote_validity_days: form.quote_validity_days,
    }).eq('id', company.id)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const uploadFile = async (file, type) => {
    setUploading(prev => ({ ...prev, [type]: true }))
    const ext = file.name.split('.').pop()
    const path = `${type}/${type}.${ext}`
    await supabase.storage.from('business-assets').upload(path, file, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from('business-assets').getPublicUrl(path)
    const field = type === 'logo' ? 'logo_url' : 'stamp_url'
    await supabase.from('company').update({ [field]: publicUrl }).eq('id', company.id)
    setForm(prev => ({ ...prev, [field]: publicUrl }))
    setUploading(prev => ({ ...prev, [type]: false }))
  }

  if (!company) return <div style={{ minHeight:'100vh',background:'#0B0D17',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.4)',fontFamily:"'Outfit',sans-serif" }}>Chargement...</div>

  return (
    <div style={{ minHeight:'100vh', background:'#0B0D17', fontFamily:"'Outfit',sans-serif", color:'#fff' }}>
      <div style={{ padding:'18px 22px 0' }}>
        <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800 }}>Profil entreprise</div>
        <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',marginTop:2 }}>Logo, tampon et informations</div>
      </div>

      <div style={{ padding:'20px 22px 100px' }}>

        {/* Logo et tampon */}
        <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:'18px',marginBottom:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:14 }}>Visuels</div>
          <div style={{ display:'flex',gap:12 }}>
            {/* Logo */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>Logo</div>
              <div style={{ background:'#0B0D17',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,height:80,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8,overflow:'hidden' }}>
                {form.logo_url ? <img src={form.logo_url} alt="logo" style={{ maxWidth:'100%',maxHeight:'100%',objectFit:'contain' }} /> : <span style={{ fontSize:24 }}>🖼️</span>}
              </div>
              <label style={{ display:'block',padding:'9px',background:'rgba(255,77,46,.1)',border:'1px solid rgba(255,77,46,.3)',borderRadius:10,textAlign:'center',fontSize:12,color:'#FF4D2E',fontWeight:600,cursor:'pointer' }}>
                {uploading.logo ? 'Upload...' : 'Changer'}
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files[0] && uploadFile(e.target.files[0],'logo')} />
              </label>
            </div>
            {/* Tampon */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>Tampon</div>
              <div style={{ background:'#0B0D17',border:'1px solid rgba(255,255,255,.07)',borderRadius:10,height:80,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8,overflow:'hidden' }}>
                {form.stamp_url ? <img src={form.stamp_url} alt="tampon" style={{ maxWidth:'100%',maxHeight:'100%',objectFit:'contain' }} /> : <span style={{ fontSize:24 }}>📍</span>}
              </div>
              <label style={{ display:'block',padding:'9px',background:'rgba(99,102,241,.1)',border:'1px solid rgba(99,102,241,.3)',borderRadius:10,textAlign:'center',fontSize:12,color:'#818CF8',fontWeight:600,cursor:'pointer' }}>
                {uploading.stamp ? 'Upload...' : 'Changer'}
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files[0] && uploadFile(e.target.files[0],'stamp')} />
              </label>
            </div>
          </div>
        </div>

        {/* Infos entreprise */}
        <div style={{ background:'#111827',border:'1px solid rgba(255,255,255,.07)',borderRadius:16,padding:'18px',marginBottom:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,marginBottom:14 }}>Informations</div>
          {[
            { key:'name',        label:'Nom de l\'entreprise', placeholder:'MirlaEvent' },
            { key:'address',     label:'Adresse',             placeholder:'12 rue des Lilas, 75001 Paris' },
            { key:'phone',       label:'Téléphone',           placeholder:'06 12 34 56 78' },
            { key:'email',       label:'Email',               placeholder:'contact@MirlaEvent.fr' },
            { key:'siret',       label:'SIRET',               placeholder:'123 456 789 00012' },
            { key:'payment_conditions', label:'Conditions de paiement', placeholder:'Acompte 30%...' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom:12 }}>
              <label style={{ fontSize:10,fontWeight:600,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6,display:'block' }}>{field.label}</label>
              <input value={form[field.key] || ''} onChange={e => setForm({...form,[field.key]:e.target.value})}
                placeholder={field.placeholder}
                style={{ width:'100%',background:'#0B0D17',border:'1px solid rgba(255,255,255,.08)',borderRadius:10,padding:'12px 14px',fontSize:13,color:'#fff',fontFamily:"'Outfit',sans-serif",outline:'none' }} />
            </div>
          ))}
        </div>

        {saved && <div style={{ background:'rgba(16,185,129,.1)',border:'1px solid rgba(16,185,129,.3)',borderRadius:12,padding:'12px',fontSize:12,color:'#4ADE80',textAlign:'center',marginBottom:14 }}>✓ Modifications enregistrées</div>}

        <button onClick={saveInfo} disabled={saving}
          style={{ width:'100%',padding:'17px',background:'#FF4D2E',border:'none',borderRadius:16,color:'#fff',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',opacity:saving?0.7:1 }}>
          {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
        </button>
      </div>
      <NavAdmin active="/admin/profile" />
    </div>
  )
}
