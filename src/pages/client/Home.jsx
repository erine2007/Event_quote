import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Home() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setStep(s => s >= 5 ? 5 : s + 1), 120)
    return () => clearInterval(t)
  }, [])

  const show = (n) => ({
    opacity: step >= n ? 1 : 0,
    transform: step >= n ? 'translateY(0)' : 'translateY(22px)',
    transition: 'opacity 0.55s ease, transform 0.55s ease',
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D17', fontFamily: "'Outfit', sans-serif", color: '#fff', overflowX: 'hidden' }}>
      <style>{`
        @keyframes glow{0%,100%{box-shadow:0 0 24px rgba(255,77,46,.4)}50%{box-shadow:0 0 48px rgba(255,77,46,.7)}}
        @keyframes shine{from{transform:translateX(-100%) skewX(-20deg)}to{transform:translateX(300%) skewX(-20deg)}}
        @keyframes pdot{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
        .btn-g{animation:glow 3s ease-in-out infinite}
        .btn-g:hover{transform:translateY(-2px)}
        .btn-g:active{transform:scale(.96)}
        .ep:hover{background:#FF4D2E!important;color:#fff!important;border-color:#FF4D2E!important;transform:translateY(-2px);transition:all .2s}
        .sc:hover{transform:translateY(-4px)}
      `}</style>

      {/* Blobs */}
      <div style={{ position:'fixed',top:'-15%',right:'-20%',width:'65vw',height:'65vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(255,77,46,.12),transparent 65%)',pointerEvents:'none',zIndex:0 }} />
      <div style={{ position:'fixed',bottom:0,left:'-25%',width:'70vw',height:'70vw',borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,.08),transparent 65%)',pointerEvents:'none',zIndex:0 }} />

      <div style={{ position:'relative',zIndex:1 }}>

        {/* NAV */}
        <nav style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'18px 22px 0',...show(0) }}>
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'#FF4D2E',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:17,color:'#fff',boxShadow:'0 4px 14px rgba(255,77,46,.5)' }}>E</div>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:'-0.02em' }}>MirlaEvent</span>
          </div>
          <button onClick={() => navigate('/login')} style={{ background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',borderRadius:24,padding:'9px 18px',color:'rgba(255,255,255,.7)',fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Outfit',sans-serif" }}>
            Connexion
          </button>
        </nav>

        {/* HERO */}
        <div style={{ padding:'36px 22px 0' }}>

          <div style={{ ...show(1),display:'inline-flex',alignItems:'center',gap:8,marginBottom:24 }}>
            <div style={{ display:'flex',alignItems:'center',gap:7,background:'rgba(255,77,46,.12)',border:'1px solid rgba(255,77,46,.25)',borderRadius:30,padding:'6px 14px' }}>
              <span style={{ width:7,height:7,borderRadius:'50%',background:'#FF4D2E',display:'inline-block',animation:'pdot 1.8s ease infinite' }} />
              <span style={{ color:'#FF7A5C',fontSize:11,fontWeight:700,letterSpacing:'.09em',textTransform:'uppercase' }}>Devis gratuit · Réponse immédiate</span>
            </div>
          </div>

          <div style={show(2)}>
            <h1 style={{ fontFamily:"'Syne',sans-serif",fontSize:52,fontWeight:800,lineHeight:1.0,letterSpacing:'-0.03em',marginBottom:20,color:'#fff' }}>
              Créez des<br />
              <span style={{ WebkitTextStroke:'2px #FF4D2E',color:'transparent' }}>moments</span><br />
              inoubliables.
            </h1>
            <p style={{ color:'rgba(255,255,255,.45)',fontSize:15,lineHeight:1.7,marginBottom:32,fontWeight:300,maxWidth:320 }}>
              Anniversaire, mariage, séminaire — devis PDF professionnel en moins de 2 minutes.
            </p>
          </div>

          <div style={{ ...show(3),display:'flex',flexDirection:'column',gap:12,marginBottom:36 }}>
            <button className="btn-g" onClick={() => navigate('/register')} style={{ width:'100%',padding:'18px',background:'#FF4D2E',border:'none',borderRadius:16,color:'#fff',fontSize:16,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',position:'relative',overflow:'hidden' }}>
              <span style={{ position:'relative',zIndex:1 }}>Obtenir mon devis gratuit →</span>
              <div style={{ position:'absolute',top:0,left:0,width:'40%',height:'100%',background:'linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)',transform:'skewX(-20deg)',animation:'shine 3s ease-in-out infinite' }} />
            </button>
            <button onClick={() => navigate('/login')} style={{ width:'100%',padding:'18px',background:'transparent',border:'1px solid rgba(255,255,255,.1)',borderRadius:16,color:'rgba(255,255,255,.5)',fontSize:14,fontFamily:"'Outfit',sans-serif",cursor:'pointer' }}>
              J'ai déjà un compte
            </button>
          </div>

          {/* Stats */}
          <div style={{ ...show(3),display:'flex',background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:18,overflow:'hidden',marginBottom:36 }}>
            {[{ num:'500+',lbl:'Événements' },{ num:'2 min',lbl:'Pour un devis' },{ num:'100%',lbl:'Personnalisé' }].map((s,i) => (
              <div key={i} style={{ flex:1,textAlign:'center',padding:'18px 8px',borderRight:i<2?'1px solid rgba(255,255,255,.06)':'none' }}>
                <div style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#FF4D2E',marginBottom:3 }}>{s.num}</div>
                <div style={{ fontSize:10,color:'rgba(255,255,255,.35)',textTransform:'uppercase',letterSpacing:'.07em' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Aperçu devis */}
        <div style={{ ...show(3),margin:'0 22px 36px',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.08)',borderRadius:24,padding:'22px',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,#FF4D2E,#FFB800,transparent)' }} />
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
            <div>
              <p style={{ fontSize:9,color:'rgba(255,255,255,.3)',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:5 }}>Exemple de devis</p>
              <p style={{ fontFamily:"'Syne',sans-serif",fontSize:16,fontWeight:700,marginBottom:3 }}>Mariage Martin</p>
              <p style={{ fontSize:11,color:'rgba(255,255,255,.35)' }}>15 juin 2025 · Paris · 80 pers.</p>
            </div>
            <div style={{ background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.3)',borderRadius:8,padding:'5px 10px' }}>
              <span style={{ color:'#4ADE80',fontSize:11,fontWeight:600 }}>✓ Confirmé</span>
            </div>
          </div>
          {[{ n:'Buffet dînatoire',p:'2 800 €' },{ n:'DJ soirée',p:'800 €' },{ n:'Décoration florale',p:'500 €' }].map((item,i) => (
            <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:i<2?'1px solid rgba(255,255,255,.06)':'none' }}>
              <span style={{ fontSize:12,color:'rgba(255,255,255,.6)' }}>{item.n}</span>
              <span style={{ fontSize:12,fontWeight:600 }}>{item.p}</span>
            </div>
          ))}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12,background:'rgba(255,77,46,.1)',border:'1px solid rgba(255,77,46,.2)',borderRadius:12,padding:'12px 16px' }}>
            <span style={{ fontSize:12,color:'rgba(255,255,255,.5)' }}>Total TTC</span>
            <span style={{ fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'#FF7A5C' }}>4 920 €</span>
          </div>
        </div>

        {/* Spécialités */}
        <div style={{ ...show(4),padding:'0 22px 32px' }}>
          <p style={{ fontSize:10,color:'rgba(255,255,255,.3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:14 }}>Nos spécialités</p>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {[{ icon:'🎂',label:'Anniversaire' },{ icon:'💍',label:'Mariage' },{ icon:'🏢',label:'Séminaire' },{ icon:'🎉',label:'Soirée' },{ icon:'🤝',label:'Conférence' },{ icon:'🍽️',label:'Dîner pro' },{ icon:'🎓',label:'Remise de prix' },{ icon:'✨',label:'Autre' }].map(e => (
              <div key={e.label} className="ep" onClick={() => navigate('/register')} style={{ display:'flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',borderRadius:30,padding:'9px 14px',cursor:'pointer',color:'rgba(255,255,255,.65)',fontSize:12,fontWeight:500 }}>
                <span style={{ fontSize:14 }}>{e.icon}</span>{e.label}
              </div>
            ))}
          </div>
        </div>

        {/* Étapes */}
        <div style={{ ...show(4),padding:'0 22px 40px' }}>
          <p style={{ fontSize:10,color:'rgba(255,255,255,.3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em',marginBottom:16 }}>En 3 étapes</p>
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {[
              { n:'01',title:'Décrivez votre événement',desc:'Type, date, lieu, nombre de personnes',accent:'#FF4D2E' },
              { n:'02',title:'Choisissez vos prestations',desc:'Buffet, DJ, déco... total calculé en direct',accent:'#FFB800' },
              { n:'03',title:'PDF prêt à télécharger',desc:"Logo + tampon officiel de l'entreprise",accent:'#6366F1' },
            ].map((s,i) => (
              <div key={i} className="sc" style={{ display:'flex',alignItems:'center',gap:16,background:'rgba(255,255,255,.03)',border:'1px solid rgba(255,255,255,.06)',borderRadius:18,padding:'16px 18px',transition:'transform .25s' }}>
                <div style={{ minWidth:46,height:46,borderRadius:14,background:`${s.accent}20`,border:`1px solid ${s.accent}40`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:s.accent }}>{s.n}</div>
                <div>
                  <div style={{ fontSize:14,fontWeight:600,marginBottom:3 }}>{s.title}</div>
                  <div style={{ fontSize:12,color:'rgba(255,255,255,.35)',lineHeight:1.4 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bas */}
        <div style={{ ...show(5),margin:'0 22px 48px',background:'linear-gradient(135deg,#FF4D2E,#C0392B)',borderRadius:24,padding:'30px 24px 28px',textAlign:'center',boxShadow:'0 20px 60px rgba(255,77,46,.3)',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:'-50%',right:'-20%',width:'60%',height:'200%',borderRadius:'50%',background:'rgba(255,255,255,.07)' }} />
          <p style={{ fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:'#fff',marginBottom:8,position:'relative' }}>Votre événement commence ici.</p>
          <p style={{ color:'rgba(255,255,255,.75)',fontSize:13,marginBottom:22,position:'relative' }}>Gratuit · Sans engagement · Résultat immédiat</p>
          <button onClick={() => navigate('/register')} style={{ background:'#fff',border:'none',borderRadius:14,padding:'15px 32px',color:'#FF4D2E',fontSize:15,fontWeight:700,fontFamily:"'Outfit',sans-serif",cursor:'pointer',position:'relative' }}>
            Commencer maintenant →
          </button>
        </div>

        <div style={{ textAlign:'center',padding:'0 22px 32px',borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:20 }}>
          <p style={{ color:'rgba(255,255,255,.2)',fontSize:11 }}>© 2025 MirlaEvent · Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}
