New subject for you :

You must create a web app (for mobile) who permit to get a quote for an event business.
On this app, it'll possible to add a logo, a stamp and make an pdf extract.

Good luck

Mot du chef d'équipe :

Je ne sais pas si vous avez vu, mais j'avais créé sur le git des branches avec vos noms. Comme ça chacun va d'abord travailler sur sa branche et ensuite quand ça sera bon pour nous 3 on fera un merge sur la branche développer et à la fin quand on aura tout validé on pourra push sur le main (J'ai une branche au nom de Jaspe)

Organisation de l'équipe

1. Organisation de l'équipe (3 personnes)
👨‍💻 1. Développeur Frontend (UI/UX)
👉 Responsable de tout ce que l'utilisateur voit
Tâches :
Créer l'interface en React
Formulaire de devis :
client, événement, prestations, prix
Gestion des états (useState / useReducer)
Design mobile (responsive)
Page d'aperçu du devis
Intégration du logo et du tampon (upload + affichage)
Bonus :
UX fluide (boutons, transitions)
Validation des champs
⚙️ 2. Développeur Backend (Supabase)
👉 Responsable des données et logique métier
Outils :
Supabase
Tâches :
Création de la base de données :
table clients
table quotes (devis)
table items (prestations)
Relations entre tables
API via Supabase :
créer un devis
récupérer les devis
Authentification (optionnel)
Gestion du stockage :
logo
tampon (Supabase Storage)

Mon role  :

🧠 3. Développeur Fullstack / Intégration & PDF
👉 Le lien entre frontend et backend
Tâches :
✅ Connexion React ↔️ Supabase (supabaseClient.js + AuthContext + hooks)
✅ Gestion des appels API (services : quotesService, companyService, catalogService)
✅ Transformation des données pour affichage (useQuotes, useCompany, useCatalog — hooks React prêts à l'emploi)
✅ Génération PDF avec html2pdf.js (pdfGenerator.js + hook usePDF)
✅ Mise en forme du devis PDF : logo, contenu, tampon (useCORS activé pour les assets Supabase Storage)
✅ Scaffolding app (Vite + React + React Router + Tailwind + routing protégé)
⬜ Tests globaux (à faire une fois que le frontend dev a branché son UI)
