# 🎉 QuoteEvent — Application Web de Devis Événementiel

> Application web **mobile-first** permettant à un client de décrire ses besoins pour un événement et de recevoir automatiquement un **devis PDF professionnel** avec le logo et le tampon de l'entreprise.

---

## 📌 Table des matières

- [Aperçu du projet](#-aperçu-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Lancer le projet](#-lancer-le-projet)
- [Structure des dossiers](#-structure-des-dossiers)
- [Variables d'environnement](#-variables-denvironnement)
- [Base de données](#-base-de-données)
- [Les 3 rôles](#-les-3-rôles)
- [Parcours utilisateur](#-parcours-utilisateur)
- [Déploiement](#-déploiement)
- [Équipe](#-équipe)

---

## 🎯 Aperçu du projet

**Sujet original :**
> *"You must create a web app for mobile who permit to get a quote for an event business. On this app, it'll possible to add a logo, a stamp and make a PDF extract."*

**Ce qu'on a réalisé :**

Un client arrive sur l'application, crée son compte, décrit son événement (anniversaire, mariage, séminaire…), sélectionne les prestations souhaitées et reçoit **instantanément un devis PDF professionnel** avec le logo et le tampon de l'entreprise.

L'entreprise de son côté dispose d'un **espace admin sécurisé** pour gérer ses services, ses prix, consulter tous les devis et suivre les statuts.

---

## ✨ Fonctionnalités

### Côté Client
- ✅ Inscription et connexion sécurisées
- ✅ Choix du type d'événement (8 catégories)
- ✅ Saisie des détails (personnes, date, lieu, budget)
- ✅ Sélection des services avec **calcul du total en temps réel**
- ✅ Récapitulatif avant confirmation
- ✅ **Génération et téléchargement du PDF** avec logo + tampon
- ✅ Tableau de bord pour consulter ses devis et leurs statuts

### Côté Admin
- ✅ Connexion sécurisée à l'espace admin
- ✅ **Upload du logo et du tampon** de l'entreprise
- ✅ Gestion complète des services (ajout, activation/désactivation)
- ✅ Consultation de tous les devis clients
- ✅ Modification du statut des devis (En attente / Confirmé / Refusé)
- ✅ Mise à jour des informations de l'entreprise

---

## 🛠️ Stack technique

| Rôle | Technologie | Pourquoi |
|---|---|---|
| Framework frontend | **React 18 + Vite** | Rapide, moderne, mobile-first |
| Style CSS | **Tailwind CSS** | Responsive, rapide à écrire |
| Base de données | **Supabase (PostgreSQL)** | Gratuit, auth intégrée, RLS |
| Authentification | **Supabase Auth** | Clients + Admin dans le même système |
| Stockage fichiers | **Supabase Storage** | Logo et tampon en ligne |
| Génération PDF | **html2canvas + jsPDF** | Côté navigateur, sans serveur |
| Navigation | **React Router DOM** | Routage côté client |
| Hébergement | **Vercel** | Gratuit, déploiement automatique |

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [npm](https://www.npmjs.com/) v9 ou supérieur
- [Git](https://git-scm.com/)
- Un compte [Supabase](https://supabase.com/) (gratuit)

Pour vérifier vos versions :

```bash
node --version   # v18.x.x ou supérieur
npm --version    # v9.x.x ou supérieur
git --version
```

---

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/votre-repo/quote-event-app.git
cd quote-event-app
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_publishable
```

> ⚠️ **Important** — Ne jamais commiter ce fichier sur GitHub. Il est déjà dans le `.gitignore`.

Pour récupérer vos clés : Supabase → **Settings → API Keys → Publishable key**

---

## ▶️ Lancer le projet

```bash
npm run dev
```

Ouvrir dans le navigateur : **http://localhost:5173**

Pour tester sur téléphone (même réseau Wi-Fi) :

```bash
# Récupérer votre IP locale (Windows)
ipconfig

# Puis ouvrir sur votre téléphone :
# http://192.168.X.X:5173
```

---

## 📁 Structure des dossiers

```
quote-event-app/
│
├── src/
│   │
│   ├── pages/
│   │   ├── client/                  # Pages accessibles aux clients
│   │   │   ├── Home.jsx            # Page d'accueil
│   │   │   ├── Register.jsx        # Inscription
│   │   │   ├── Login.jsx           # Connexion
│   │   │   ├── Dashboard.jsx       # Tableau de bord (mes devis)
│   │   │   ├── EventType.jsx       # Étape 1 — choix du type
│   │   │   ├── EventDetails.jsx    # Étape 2 — détails événement
│   │   │   ├── ServiceSelection.jsx # Étape 3 — choix des services
│   │   │   ├── ContactForm.jsx     # Étape 4 — récapitulatif
│   │   │   └── QuoteResult.jsx     # Résultat + téléchargement PDF
│   │   │
│   │   └── admin/                   # Pages réservées à l'admin
│   │       ├── AdminLogin.jsx       # Connexion admin
│   │       ├── AdminDashboard.jsx   # Tableau de bord admin
│   │       ├── AdminQuotes.jsx      # Gestion des devis
│   │       ├── AdminServices.jsx    # Gestion des services
│   │       └── AdminProfile.jsx     # Logo, tampon, infos entreprise
│   │
│   ├── hooks/
│   │   └── useAuth.js               # Gestion de l'authentification
│   │
│   ├── lib/
│   │   └── supabase.js              # Client Supabase (connexion)
│   │
│   ├── utils/
│   │   ├── calculateQuote.js        # Calcul HT / TVA / TTC
│   │   └── styles.js                # Styles et couleurs globaux
│   │
│   ├── App.jsx                       # Routes et protection des pages
│   ├── main.jsx                      # Point d'entrée React
│   └── index.css                     # Styles globaux Tailwind
│
├── .env.local                         # Variables d'environnement (non committé)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## 🔑 Variables d'environnement

| Variable | Description | Où la trouver |
|---|---|---|
| `VITE_SUPABASE_URL` | URL du projet Supabase | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase | Supabase → Settings → API Keys |

---

## 🗄️ Base de données

Le projet utilise **8 tables PostgreSQL** sur Supabase :

| Table | Description |
|---|---|
| `profiles` | Rôle de chaque utilisateur (client ou admin) |
| `company` | Informations de l'entreprise (logo, tampon, SIRET) |
| `event_types` | Types d'événements disponibles |
| `service_categories` | Catégories de services (Restauration, DJ...) |
| `services` | Prestations avec leurs prix |
| `clients` | Informations complémentaires des clients |
| `quotes` | Devis générés avec totaux et statut |
| `quote_items` | Lignes de détail de chaque devis |

### Sécurité RLS

Les règles **Row Level Security** garantissent que :
- Chaque client ne voit que **ses propres devis**
- L'admin voit **tous** les devis et clients
- Les services sont **lisibles publiquement**
- Seul l'admin peut **modifier** les services et l'entreprise

---

## 👥 Les 3 rôles

### 👀 Visiteur (non connecté)
Peut voir la page d'accueil et créer un compte.

### 👤 Client (connecté)
- Remplit le formulaire de devis en 4 étapes
- Génère et télécharge son devis en PDF
- Consulte ses devis et suit leur statut

### ⚙️ Admin (compte entreprise)
- Gère les services et leurs prix
- Upload le logo et le tampon
- Consulte tous les devis clients
- Change le statut des devis

> Pour créer le compte admin : créer un utilisateur normalement puis dans Supabase → Table Editor → `profiles` → changer `role` de `'client'` à `'admin'`.

---

## 🗺️ Parcours utilisateur

```
1. Accueil                → Présentation de l'app
2. Inscription            → Création du compte client
3. Type d'événement       → Anniversaire, Mariage, Séminaire...
4. Détails                → Nombre de personnes, date, lieu
5. Services               → Sélection avec total en temps réel
6. Récapitulatif          → Vérification avant génération
7. Devis PDF              → Téléchargement du PDF complet
8. Tableau de bord        → Historique et suivi des devis
```

---

## 🌐 Déploiement

### Déployer sur Vercel

```bash
# 1. Pusher sur GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Sur vercel.com
# → Importer le repo GitHub
# → Ajouter les variables d'environnement
# → Deploy
```

### Variables d'environnement sur Vercel
Ajouter dans **Vercel → Settings → Environment Variables** :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

> Chaque `git push` redéploie automatiquement la nouvelle version.

---

## 👨‍💻 Équipe

| Rôle | Responsabilités |
|---|---|
| **Personne 1 — Frontend** | Interface React, design mobile, formulaires, UX |
| **Personne 2 — Backend** | Supabase, tables, sécurité RLS, Storage, données |
| **Personne 3 — Intégration & PDF** | Connexion React ↔ Supabase, génération PDF, déploiement |

---

