# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




---

# 🎨 2. README FRONTEND (README-frontend.md)



# 🎨 Frontend – Aurum Events

Ce dossier contient toute la partie interface utilisateur de l'application Aurum Events.

---

## 🎯 Objectif

Créer une expérience utilisateur fluide, moderne et haut de gamme pour la génération de devis événementiels.

---

## 🧠 Architecture

L'application est structurée en plusieurs pages :

- **Home** → Présentation + CTA
- **FormDevis** → Saisie des informations
- **Review** → Vérification des données
- **Preview** → Génération du devis

---

## 🔄 Workflow utilisateur

1. L'utilisateur arrive sur la page d'accueil
2. Il clique sur "Demander un devis"
3. Il remplit le formulaire
4. Il vérifie ses informations
5. Il génère son devis
6. Il télécharge le PDF
7. Il reçoit une confirmation

---

## 🧩 Composants principaux

- `Header.jsx` → Barre supérieure
- `Logo.jsx` → Logo de l’entreprise
- `Preview.jsx` → Génération du devis PDF
- `Review.jsx` → Validation des données

---

## 🎨 Design

- Palette : **Noir (#0a0a0a) & Or (#d4af37)**
- Style : Luxe / minimaliste
- UI : centrée sur la lisibilité et la conversion

---

## 📦 Librairies utilisées

- React
- react-router-dom
- html2pdf.js
- UseLocation
- UseState
- UseNavigate

---

## ⚙️ Lancer le projet

```bash
npm install
npm run dev
