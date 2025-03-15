# Application Delta avec Supabase

Ce projet est une application de démonstration qui utilise Supabase pour les fonctionnalités de base de données et d'authentification.

## Structure du projet

```
/delta-supabase/
│
├── src/                   # Code source de l'application
│   ├── components/        # Composants UI réutilisables
│   │   ├── NoteCard.js    # Composant de carte de note
│   │   ├── NoteForm.js    # Formulaire de note
│   │   └── NotesList.js   # Liste des notes
│   │
│   ├── models/            # Définitions de types et interfaces
│   │   ├── note.js        # Modèle de note
│   │   └── user.js        # Modèle d'utilisateur et profil
│   │
│   ├── pages/             # Pages de l'application
│   │   ├── Auth.js        # Page d'authentification
│   │   ├── Home.js        # Page d'accueil
│   │   ├── Notes.js       # Page de gestion des notes
│   │   └── Profile.js     # Page de profil utilisateur
│   │
│   ├── services/          # Services d'accès aux données
│   │   ├── auth.service.js   # Service d'authentification
│   │   ├── notes.service.js  # Service de gestion des notes
│   │   ├── profile.service.js # Service de gestion du profil
│   │   └── supabase.js    # Configuration de Supabase
│   │
│   ├── utils/             # Fonctions utilitaires
│   │   ├── date-formatter.js # Formatage des dates
│   │   └── toast.js       # Gestion des notifications
│   │
│   └── index.js           # Point d'entrée de l'application
│
├── public/                # Fichiers accessibles publiquement
│   └── index.html         # Page HTML principale
│
├── assets/                # Ressources statiques
│   └── css/               # Feuilles de style
│       └── styles.css     # Styles de l'application
│
├── config/                # Fichiers de configuration
│   └── supabase-config.js # Configuration de Supabase
│
├── scripts/               # Scripts d'automatisation
│   └── migrations/        # Scripts de migration pour Supabase
│       ├── schema.sql     # Schéma de base de données
│       └── triggers.sql   # Déclencheurs
│
└── README.md              # Documentation du projet
```

## Configuration Supabase

Ce projet utilise les identifiants Supabase suivants :

```javascript
const supabaseUrl = 'https://rcmuejvaxqzbynsezjkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbXVlanZheHF6Ynluc2V6amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjU2NjcsImV4cCI6MjA1NzY0MTY2N30.R4qdgjcGIcG3FovE9duZe-yH6Q0asNMIxbCHaWNI6Wc';
```

Pour configurer la base de données Supabase, exécutez les scripts SQL dans le dossier `scripts/migrations/` :

1. `schema.sql` - Crée les tables et les politiques de sécurité
2. `triggers.sql` - Configure le déclencheur pour la création automatique des profils

## Fonctionnalités implémentées

- **Authentification** :
  - Inscription, connexion et déconnexion des utilisateurs
  - Gestion des profils utilisateurs

- **Base de données** :
  - Gestion des notes (création, lecture, mise à jour, suppression)
  - Sécurité RLS (Row Level Security) pour protéger les données

## Comment utiliser

1. Clonez ce dépôt
2. Exécutez les scripts SQL dans votre projet Supabase
3. Ouvrez `public/index.html` dans un navigateur

## Développement

Pour le développement, vous pouvez utiliser un serveur local comme Live Server pour VS Code ou servir les fichiers avec un serveur HTTP simple.

```bash
# Exemple avec Python
python -m http.server
```

## Points forts de la conception

- **Architecture modulaire** : Séparation claire des responsabilités
- **Composants réutilisables** : Interface utilisateur construite avec des composants isolés
- **Services dédiés** : Accès aux données via des services spécialisés
- **Gestion des erreurs** : Traitement robuste des erreurs et retour utilisateur
- **Sécurité** : Utilisation des politiques RLS pour protéger les données