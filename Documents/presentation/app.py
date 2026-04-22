from flask import Flask, render_template_string

app = Flask(__name__)

HTML = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>MirlaEvent — Pitch</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,500;1,700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --cream:   #FDFAF5;
    --white:   #FFFFFF;
    --coral:   #E8432D;
    --orange:  #F07030;
    --amber:   #F5A623;
    --text:    #1A1208;
    --muted:   #7A6A58;
    --border:  rgba(26,18,8,0.09);
    --grad:    linear-gradient(135deg, var(--coral), var(--orange));
    --font-title: 'Cormorant Garamond', Georgia, serif;
    --font-body:  'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; scroll-snap-type: y mandatory; }

  body {
    font-family: var(--font-body);
    background: var(--cream);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── SLIDE BASE ── */
  .slide {
    min-height: 100vh;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 80px 10vw;
  }

  /* ── NAV DOTS ── */
  #nav-dots {
    position: fixed;
    right: 28px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 999;
  }
  .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: rgba(26,18,8,0.18);
    cursor: pointer;
    transition: all .3s;
    border: none;
  }
  .dot.active {
    background: var(--coral);
    transform: scale(1.4);
  }

  /* ── PROGRESS BAR ── */
  #progress {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: var(--grad);
    z-index: 999;
    transition: width .4s ease;
  }

  /* ── ARROW NAV ── */
  .arrow-nav {
    position: fixed;
    bottom: 28px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 999;
  }
  .arrow-btn {
    width: 44px; height: 44px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(8px);
    cursor: pointer;
    font-size: 16px;
    color: var(--text);
    display: flex; align-items: center; justify-content: center;
    transition: all .2s;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }
  .arrow-btn:hover {
    background: var(--coral);
    color: white;
    border-color: var(--coral);
    transform: scale(1.08);
  }

  /* ── DECORATIVE SHAPES ── */
  .blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  /* ── TYPOGRAPHY ── */
  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--coral);
    margin-bottom: 16px;
  }

  h1.hero-title {
    font-family: var(--font-title);
    font-size: clamp(52px, 7vw, 96px);
    font-weight: 700;
    line-height: 1.0;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
    color: var(--text);
  }
  h1.hero-title em {
    font-style: italic;
    color: var(--coral);
  }

  h2.slide-title {
    font-family: var(--font-title);
    font-size: clamp(36px, 5vw, 64px);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 20px;
  }

  .lead {
    font-size: clamp(15px, 1.6vw, 18px);
    color: var(--muted);
    line-height: 1.75;
    font-weight: 300;
    max-width: 520px;
  }

  /* ── SLIDE 1 — HERO ── */
  #slide-1 { background: var(--white); }
  #slide-1 .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(232,67,45,0.08);
    border: 1px solid rgba(232,67,45,0.2);
    border-radius: 30px;
    padding: 7px 16px;
    margin-bottom: 28px;
  }
  #slide-1 .badge span {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--coral);
  }
  #slide-1 .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--coral);
    animation: pulse 2s ease infinite;
  }
  .hero-sub {
    font-size: clamp(14px, 1.5vw, 17px);
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
    max-width: 480px;
    margin-bottom: 40px;
  }
  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--grad);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .04em;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(232,67,45,0.3);
    transition: all .2s;
  }
  .hero-cta:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(232,67,45,0.4); }

  /* ── SLIDE 2 — PROBLÈME ── */
  #slide-2 { background: var(--cream); }
  .problem-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;
  }
  .problem-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
    transition: transform .25s, box-shadow .25s;
  }
  .problem-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }
  .problem-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--grad);
  }
  .problem-icon {
    font-size: 32px;
    margin-bottom: 14px;
    display: block;
  }
  .problem-card h3 {
    font-family: var(--font-title);
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--text);
  }
  .problem-card p {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── SLIDE 3 — SOLUTION ── */
  #slide-3 {
    background: var(--text);
    color: white;
  }
  #slide-3 h2.slide-title { color: white; }
  #slide-3 .label { color: var(--amber); }
  .solution-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    margin-top: 40px;
  }
  .solution-text .lead { color: rgba(255,255,255,0.6); max-width: 100%; }
  .solution-steps { display: flex; flex-direction: column; gap: 16px; }
  .step {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 18px 20px;
    transition: background .2s;
  }
  .step:hover { background: rgba(232,67,45,0.1); }
  .step-num {
    min-width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--grad);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-title);
    font-size: 16px; font-weight: 700;
    color: white; flex-shrink: 0;
  }
  .step h4 { font-size: 14px; font-weight: 500; color: white; margin-bottom: 3px; }
  .step p  { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 300; line-height: 1.5; }

  /* ── SLIDE 4 — FONCTIONNALITÉS ── */
  #slide-4 { background: var(--white); }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 40px;
  }
  .feature-card {
    background: var(--cream);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 24px 20px;
    transition: all .25s;
  }
  .feature-card:hover {
    background: white;
    box-shadow: 0 12px 32px rgba(0,0,0,0.07);
    transform: translateY(-3px);
  }
  .feature-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: rgba(232,67,45,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    margin-bottom: 14px;
  }
  .feature-card h3 {
    font-family: var(--font-title);
    font-size: 18px; font-weight: 700;
    margin-bottom: 6px; color: var(--text);
  }
  .feature-card p {
    font-size: 12px; color: var(--muted);
    line-height: 1.6; font-weight: 300;
  }

  /* ── SLIDE 5 — CHIFFRES ── */
  #slide-5 { background: var(--cream); }
  .stats-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
    margin-top: 40px;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .stat-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 28px 20px;
    text-align: center;
    transition: transform .2s;
  }
  .stat-card:hover { transform: translateY(-3px); }
  .stat-num {
    font-family: var(--font-title);
    font-size: 48px; font-weight: 700;
    line-height: 1;
    background: var(--grad);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 6px;
  }
  .stat-label {
    font-size: 11px; color: var(--muted);
    text-transform: uppercase; letter-spacing: .1em; font-weight: 500;
  }
  .stats-quote {
    padding: 32px;
    background: var(--text);
    border-radius: 24px;
    color: white;
  }
  .stats-quote blockquote {
    font-family: var(--font-title);
    font-size: clamp(20px, 2.5vw, 28px);
    font-style: italic;
    font-weight: 500;
    line-height: 1.4;
    color: white;
    margin-bottom: 20px;
  }
  .stats-quote cite {
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    font-style: normal;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  /* ── SLIDE 6 — CTA FINAL ── */
  #slide-6 {
    background: var(--grad);
    color: white;
    text-align: center;
    align-items: center;
  }
  #slide-6 h2.slide-title { color: white; }
  #slide-6 .label { color: rgba(255,255,255,0.7); }
  #slide-6 .lead { color: rgba(255,255,255,0.8); max-width: 480px; text-align: center; }
  .cta-url {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: white;
    color: var(--coral);
    border-radius: 14px;
    padding: 18px 36px;
    font-weight: 700;
    font-size: 16px;
    letter-spacing: .04em;
    margin-top: 32px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.15);
    transition: transform .2s;
    text-decoration: none;
  }
  .cta-url:hover { transform: translateY(-3px); }
  .contact-row {
    display: flex;
    gap: 32px;
    margin-top: 28px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .contact-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: rgba(255,255,255,0.75);
  }

  .feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(232,67,45,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
  overflow: hidden; /* 🔥 important */
}

.feature-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

  /* ── ANIMATIONS ── */
  @keyframes pulse {
    0%,100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.5); opacity: .6; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .animate { opacity: 0; }
  .animate.visible { animation: fadeUp .6s ease forwards; }
  .animate.visible:nth-child(2) { animation-delay: .1s; }
  .animate.visible:nth-child(3) { animation-delay: .2s; }
  .animate.visible:nth-child(4) { animation-delay: .3s; }
  .animate.visible:nth-child(5) { animation-delay: .4s; }
  .animate.visible:nth-child(6) { animation-delay: .5s; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .slide { padding: 60px 6vw; }
    .problem-grid, .features-grid { grid-template-columns: 1fr; }
    .solution-layout, .stats-layout { grid-template-columns: 1fr; gap: 32px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    #nav-dots { display: none; }
  }
</style>
<script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>

<!-- Progress bar -->
<div id="progress"></div>

<!-- Nav dots -->
<nav id="nav-dots">
  <button class="dot active" onclick="goTo(0)" title="Accueil"></button>
  <button class="dot" onclick="goTo(1)" title="Problème"></button>
  <button class="dot" onclick="goTo(2)" title="Solution"></button>
  <button class="dot" onclick="goTo(3)" title="Fonctionnalités"></button>
  <button class="dot" onclick="goTo(4)" title="Outils"></button>
  <button class="dot" onclick="goTo(5)" title="Équipe"></button>
  <button class="dot" onclick="goTo(6)" title="Contact"></button>
</nav>

<!-- Arrow navigation -->
<div class="arrow-nav">
  <button class="arrow-btn" id="btn-prev" onclick="prevSlide()">↑</button>
  <button class="arrow-btn" id="btn-next" onclick="nextSlide()">↓</button>
</div>

<!-- ══════════════════════════════════════
     SLIDE 1 — HERO
══════════════════════════════════════ -->
<section class="slide" id="slide-1">
  <!-- Decorative blobs -->
  <div class="blob" style="width:500px;height:500px;background:radial-gradient(circle,rgba(232,67,45,.06),transparent 70%);top:-100px;right:-100px;"></div>
  <div class="blob" style="width:300px;height:300px;background:radial-gradient(circle,rgba(245,166,35,.08),transparent 70%);bottom:-60px;left:-60px;"></div>

  <div style="position:relative;z-index:1;max-width:780px;">
    <div class="badge animate">
      <div class="badge-dot"></div>
      <span>Présentation MirlaEvent</span>
      <img src="/static/log.png" style="width:120px;margin-bottom:20px;" />
    </div>
    

    <h1 class="hero-title animate">
      L'événement<br/>
      <em>parfait,</em><br/>
      en 2 minutes.
    </h1>

    <p class="hero-sub animate">
      MirlaEvent génère des devis PDF professionnels pour vos événements :
      anniversaires, mariages, séminaires : instantanément et gratuitement.
    </p>

    <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;" class="animate">
      <button class="hero-cta" onclick="nextSlide()">Découvrir →</button>
      <span style="font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;">
        Scroll ou flèches pour naviguer
      </span>
    </div>
  </div>

  <!-- Floating badge déco -->
  <div style="position:absolute;right:8vw;bottom:15%;background:white;border:1px solid var(--border);border-radius:20px;padding:20px 24px;box-shadow:0 16px 48px rgba(0,0,0,0.08);z-index:1;" class="animate">
    <div style="font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px;">Exemple de devis</div>
    <div style="font-family:var(--font-title);font-size:18px;font-weight:700;margin-bottom:4px;">Mariage Dupont</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px;">Paris · 80 pers. · Juin 2025</div>
    <div style="display:flex;justify-content:space-between;font-size:13px;padding:8px 0;border-top:1px solid var(--border);">
      <span style="color:var(--muted);">Total TTC</span>
      <span style="font-weight:700;color:var(--coral);">4 920 €</span>
    </div>
    <div style="background:rgba(232,67,45,0.08);border:1px solid rgba(232,67,45,0.2);border-radius:8px;padding:5px 10px;text-align:center;margin-top:10px;">
      <span style="font-size:11px;font-weight:600;color:var(--coral);">✓ PDF prêt à télécharger</span>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════
     SLIDE 2 — PROBLÈME
══════════════════════════════════════ -->
<section class="slide" id="slide-2">
  <div class="blob" style="width:400px;height:400px;background:radial-gradient(circle,rgba(245,166,35,.07),transparent 70%);top:-80px;left:-80px;"></div>

  <div style="position:relative;z-index:1;width:100%;">
    <div class="label animate">Le problème</div>
    <h2 class="slide-title animate">
      Organiser un événement,<br/>
      c'est <em style="font-style:italic;color:var(--coral);">trop compliqué.</em>
    </h2>
    <p class="lead animate">
      Les prestataires événementiels perdent un temps précieux à créer des devis manuellement,
      sans outil dédié, sans professionnalisme visuel.
    </p>

    <div class="problem-grid" style="margin-top:40px;">
      <div class="problem-card animate">
        <span class="problem-icon">⏳</span>
        <h3>Perte de temps</h3>
        <p>Créer un devis manuellement prend en moyenne 45 minutes — Word, Excel, impression, envoi.</p>
      </div>
      <div class="problem-card animate">
        <span class="problem-icon">📄</span>
        <h3>Manque de pro</h3>
        <p>Un devis mal présenté nuit à l'image de marque et réduit le taux de conversion client.</p>
      </div>
      <div class="problem-card animate">
        <span class="problem-icon">🔁</span>
        <h3>Zéro traçabilité</h3>
        <p>Impossible de suivre ses devis, relancer les clients ou analyser ses performances commerciales.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════
     SLIDE 3 — SOLUTION
══════════════════════════════════════ -->
<section class="slide" id="slide-3">
  <div class="blob" style="width:500px;height:500px;background:radial-gradient(circle,rgba(232,67,45,.08),transparent 70%);top:-120px;right:-120px;"></div>

  <div style="position:relative;z-index:1;width:100%;">
    <div class="label animate">La solution</div>
    <h2 class="slide-title animate">
      MirlaEvent : votre assistant<br/>devis événementiel.
    </h2>

    <div class="solution-layout">
      <div class="solution-text animate">
        <p class="lead">
          Une plateforme web qui génère en moins de 2 minutes un devis PDF professionnel,
          personnalisé, avec logo et tampon officiel — prêt à envoyer au client.
        </p>
        <div style="margin-top:28px;display:flex;gap:20px;flex-wrap:wrap;">
          <div style="text-align:center;">
            <div style="font-family:var(--font-title);font-size:36px;font-weight:700;color:var(--amber);">2 min</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:.1em;">Par devis</div>
          </div>
          <div style="text-align:center;">
            <div style="font-family:var(--font-title);font-size:36px;font-weight:700;color:var(--amber);">100%</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:.1em;">Personnalisé</div>
          </div>
          <div style="text-align:center;">
            <div style="font-family:var(--font-title);font-size:36px;font-weight:700;color:var(--amber);">0 €</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:.1em;">Pour le client</div>
          </div>
        </div>
      </div>

      <div class="solution-steps">
        <div class="step animate">
          <div class="step-num">01</div>
          <div>
            <h4>Choisissez votre événement</h4>
            <p>Anniversaire, mariage, séminaire, conférence, dîner pro…</p>
          </div>
        </div>
        <div class="step animate">
          <div class="step-num">02</div>
          <div>
            <h4>Sélectionnez vos prestations</h4>
            <p>Buffet, DJ, décoration, animation — total calculé en direct.</p>
          </div>
        </div>
        <div class="step animate">
          <div class="step-num">03</div>
          <div>
            <h4>Téléchargez votre PDF</h4>
            <p>Logo + tampon officiel, numéroté, prêt à envoyer au client.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════
     SLIDE 4 — FONCTIONNALITÉS
══════════════════════════════════════ -->
<section class="slide" id="slide-4">
  <div class="blob" style="width:350px;height:350px;background:radial-gradient(circle,rgba(232,67,45,.05),transparent 70%);bottom:-60px;right:-60px;"></div>

  <div style="position:relative;z-index:1;width:100%;">
    <div class="label animate">Fonctionnalités</div>
    <h2 class="slide-title animate">
      Tout ce qu'il faut,<br/>rien de superflu.
    </h2>

    <div class="features-grid">
      <div class="feature-card animate">
        <div class="feature-icon">📋</div>
        <h3>Devis instantané</h3>
        <p>Génération PDF en moins de 2 minutes avec mise en page professionnelle.</p>
      </div>
      <div class="feature-card animate">
        <div class="feature-icon">🎨</div>
        <h3>Branding intégré</h3>
        <p>Logo, tampon et couleurs de l'entreprise sur chaque document produit.</p>
      </div>
      <div class="feature-card animate">
        <div class="feature-icon">💶</div>
        <h3>Calcul automatique</h3>
        <p>HT, TVA, TTC calculés en temps réel selon les prestations sélectionnées.</p>
      </div>
      <div class="feature-card animate">
        <div class="feature-icon">📁</div>
        <h3>Historique client</h3>
        <p>Tous vos devis archivés, consultables et téléchargeables à tout moment.</p>
      </div>
      <div class="feature-card animate">
        <div class="feature-icon">🎪</div>
        <h3>8 types d'événements</h3>
        <p>Anniversaire, mariage, séminaire, soirée, conférence, dîner pro et plus.</p>
      </div>
      <div class="feature-card animate">
        <div class="feature-icon">🔒</div>
        <h3>Compte sécurisé</h3>
        <p>Espace personnel protégé, données sécurisées via Supabase.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════
     SLIDE 5 — OUTILS UTILISES
══════════════════════════════════════ -->
<section class="slide" id="slide-tools">
  <div style="position:relative;z-index:1;width:100%;">
    <div class="label animate">Technologies</div>
    <h2 class="slide-title animate">
      Outils utilisés<br/>pour construire MirlaEvent
    </h2>

    <div class="features-grid">
      <div class="feature-card animate">
        <div class="feature-icon">
         <img src="/static/react.png" alt="React" />
       </div>
        <h3>React</h3>
        <p>Interface dynamique et rapide côté client.</p>
      </div>

      <div class="feature-card animate">
        <div class="feature-icon">
         <img src="/static/supabase.png" alt="supabase" />
       </div>
        <h3>Supabase</h3>
        <p>Base de données, authentification et stockage.</p>
      </div>

      

      <div class="feature-card animate">
        <div class="feature-icon">
         <img src="/static/css.png" alt="React" />
       </div>
        <h3>CSS moderne</h3>
        <p>Design responsive et expérience fluide.</p>
      </div>

      <div class="feature-card animate">
        <div class="feature-icon">📄</div>
        <h3>PDF Generator</h3>
        <p>Création automatique de devis professionnels.</p>
      </div>

      <div class="feature-card animate">
        <div class="feature-icon">
         <img src="/static/Vite_logo_2026.svg.png" alt="React" />
       </div>
        <h3>Vite</h3>
        <p>Build ultra rapide pour le développement.</p>
      </div>
    </div>
  </div>
</section>

<!-- ══════════════════════════════════════
     SLIDE 6 — ÉQUIPE
══════════════════════════════════════ -->
<section class="slide" id="slide-team">
  <div style="position:relative;z-index:1;width:100%;">
    <div class="label animate">L'équipe</div>
    <h2 class="slide-title animate">
      Les créateurs<br/>de MirlaEvent
    </h2>

    <div class="features-grid">

      <div class="feature-card animate">
        <div class="feature-icon">👩‍💻</div>
        <h3>Erine MASSO</h3>
        <h4>Développeur Front-End</h4>
        <p>Interface utilisateur et expérience UX.</p>
      </div>

      <div class="feature-card animate">
        <div class="feature-icon">👩‍💻</div>
        <h3>Irène FABIOE</h3>
        <h4>Développeur Back-End</h4>
        <p>Gestion des données et génération des devis.</p>
      </div>

      <div class="feature-card animate">
        <div class="feature-icon">👨‍💻</div>
        <h3>Jaspe PERO</h3>
        <h3>Développeur Fullstack</h3>
        <p>Connexion entre le Front et le Back</p>
      </div>

    </div>
  </div>
</section>

<!-- ══════════════════════════════════════
     SLIDE 7 — CTA FINAL
══════════════════════════════════════ -->
<section class="slide" id="slide-6">
  <div class="blob" style="width:600px;height:600px;background:rgba(255,255,255,0.07);top:-200px;right:-200px;border-radius:50%;"></div>
  <div class="blob" style="width:400px;height:400px;background:rgba(0,0,0,0.06);bottom:-100px;left:-100px;border-radius:50%;"></div>

  <div style="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;">
    <div class="label animate">Essayez maintenant</div>
    <h2 class="slide-title animate" style="text-align:center;color:white;">
      Votre événement<br/>commence ici.
    </h2>
    <p class="lead animate">
      Gratuit, sans engagement. Créez votre premier devis en moins de 2 minutes.
    </p>

    <a href="http://localhost:5173" target="_blank" class="cta-url animate">
     ✦ Accéder à MirlaEvent
   </a>

    <div class="contact-row animate">
      <div class="contact-item">📧 contact@mirlaevent.fr</div>
      <div class="contact-item">📱 Disponible sur mobile</div>
      <div class="contact-item">🔒 Données sécurisées</div>
    </div>
  </div>
</section>

<script>
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  const prog   = document.getElementById('progress');
  let current  = 0;

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    const pct = ((current) / (slides.length - 1)) * 100;
    prog.style.width = pct + '%';
    // Animate elements in current slide
    slides[current].querySelectorAll('.animate').forEach(el => {
      el.classList.add('visible');
    });
  }

  function goTo(n) {
    current = Math.max(0, Math.min(slides.length - 1, n));
    slides[current].scrollIntoView({ behavior: 'smooth' });
    updateUI();
  }

  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  prevSlide();
  });

  // Intersection Observer to detect current slide
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        current = Array.from(slides).indexOf(entry.target);
        updateUI();
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(s => observer.observe(s));

  // Init
  updateUI();
  lucide.createIcons();
</script>
</body>
</html>"""

@app.route('/')
def index():
    return render_template_string(HTML)

if __name__ == '__main__':
    app.run(debug=True, port=5050)