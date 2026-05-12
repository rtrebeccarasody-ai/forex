# ForexAI Pro — Guide de déploiement Vercel

## Structure du projet
```
forexai-pro/
├── api/
│   ├── forex.js        ← Proxy TwelveData (clé cachée côté serveur)
│   └── analysis.js     ← Proxy Anthropic Claude AI
├── public/
│   └── index.html      ← Application frontend complète
├── vercel.json         ← Configuration Vercel
├── package.json
└── README.md
```

---

## Étapes de déploiement

### 1. Créer un dépôt GitHub
1. Allez sur https://github.com/new
2. Nom du repo : `forexai-pro`
3. Visibilité : **Private** (important — vos clés sont dans Vercel, pas ici)
4. Cliquez "Create repository"

### 2. Uploader les fichiers
Option A — Interface GitHub (sans terminal) :
1. Cliquez "uploading an existing file"
2. Glissez-déposez TOUS les fichiers de ce dossier
3. Respectez la structure : créez les dossiers `api/` et `public/`
4. Commit : "Initial commit"

Option B — Terminal (si vous avez Git) :
```bash
cd forexai-pro
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/forexai-pro.git
git push -u origin main
```

### 3. Importer sur Vercel
1. Allez sur https://vercel.com/dashboard
2. Cliquez **"Add New... → Project"**
3. Cliquez **"Import"** sur le repo `forexai-pro`
4. Ne changez rien dans les paramètres
5. **NE PAS encore déployer** — ajoutez d'abord les variables d'environnement

### 4. Variables d'environnement (OBLIGATOIRE)
Dans Vercel → votre projet → **Settings → Environment Variables** :

| Name | Value |
|------|-------|
| `TWELVEDATA_KEY` | votre_nouvelle_cle_twelvedata |
| `ANTHROPIC_KEY` | votre_cle_anthropic (optionnel) |

⚠️ Utilisez des NOUVELLES clés (régénérées) — pas les anciennes exposées.

### 5. Déployer
1. Allez dans **Deployments**
2. Cliquez **"Redeploy"** ou revenez sur "Deploy"
3. Attendez ~1 minute
4. Votre app est live sur : `https://forexai-pro.vercel.app`

---

## URLs de votre app déployée
- App : `https://forexai-pro-XXXX.vercel.app`
- API forex : `https://forexai-pro-XXXX.vercel.app/api/forex?symbol=EURUSD&type=quote`
- API analyse : `https://forexai-pro-XXXX.vercel.app/api/analysis` (POST)

---

## Obtenir une clé TwelveData (gratuite)
1. https://twelvedata.com → Sign up
2. Dashboard → API Keys → copier la clé
3. Plan Basic : 800 crédits/jour, 8 req/minute (suffisant)

## Obtenir une clé Anthropic (optionnelle — pour l'analyse IA)
1. https://console.anthropic.com → API Keys
2. Sans clé Anthropic : l'app fonctionne avec l'analyse locale (SMC calculé)
3. Avec clé : analyse IA complète par Claude sur chaque paire

---

## Support
En cas de problème, vérifiez :
- Variables d'environnement bien configurées dans Vercel
- Clés API valides (non expirées, non révoquées)
- Logs Vercel : Dashboard → votre projet → Logs
