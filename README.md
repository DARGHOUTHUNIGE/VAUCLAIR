# Vauclair Déménagement

Site React + Vite responsive pour Vauclair Déménagement, avec pages marketing, galerie prête à recevoir les photos de l’entreprise, formulaire de devis et API Node.

## Développement

```bash
npm install
npm run dev
```

Le frontend est disponible sur `http://localhost:5173` et l’API sur `http://localhost:3001`.

## Production

```bash
npm run build
npm start
```

Le serveur sert `dist/` et reçoit les formulaires sur `POST /api/contact`. Les demandes sont stockées dans `data/submissions.ndjson`, un fichier ignoré par Git.

## Avant publication

- Remplacer le logo provisoire par le logo officiel.
- Ajouter les photographies réelles de Vauclair dans les emplacements de la galerie.
- Compléter téléphone, email, adresse, SIRET, hébergeur et horaires.
- Remplacer `votre-domaine.fr` dans `public/robots.txt` et `public/sitemap.xml`.
- Connecter l’API à un email ou une base de données sécurisée.
