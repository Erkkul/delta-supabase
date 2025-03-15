# Application Delta avec Supabase

Ce projet est une application de démonstration qui utilise Supabase pour les fonctionnalités de base de données et d'authentification.

## Configuration

Ce projet utilise les identifiants Supabase suivants :

```javascript
const supabaseUrl = 'https://rcmuejvaxqzbynsezjkk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbXVlanZheHF6Ynluc2V6amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjU2NjcsImV4cCI6MjA1NzY0MTY2N30.R4qdgjcGIcG3FovE9duZe-yH6Q0asNMIxbCHaWNI6Wc';
```

## Fonctionnalités implémentées

- **Authentification** : Inscription, connexion et déconnexion des utilisateurs
- **Base de données** : Gestion des profils utilisateurs et des notes

## Structure du projet

- `index.html` : Page principale de l'application
- `js/app.js` : Point d'entrée de l'application
- `js/supabase.js` : Configuration du client Supabase
- `js/auth.js` : Fonctions d'authentification
- `js/notes.js` : Fonctions de gestion des notes
- `css/styles.css` : Styles de l'application
- `supabase-schema.sql` : Script SQL pour créer les tables
- `supabase-trigger.sql` : Script SQL pour configurer le déclencheur de création de profil

## Configuration Supabase

Pour utiliser cette application, suivez ces étapes dans Supabase :

1. Connectez-vous à votre projet Supabase (https://app.supabase.com)
2. Accédez à l'éditeur SQL dans la section "SQL Editor"
3. Exécutez d'abord le script `supabase-schema.sql` pour créer les tables et les politiques
4. Ensuite, exécutez le script `supabase-trigger.sql` pour configurer le déclencheur qui crée automatiquement des profils utilisateurs

### Pourquoi un déclencheur ?

Le déclencheur `on_auth_user_created` permet de créer automatiquement un profil utilisateur chaque fois qu'un nouvel utilisateur s'inscrit, ce qui résout les problèmes de sécurité RLS (Row Level Security) qui pourraient empêcher les nouveaux utilisateurs de créer leur profil.
