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
- `supabase-schema.sql` : Script SQL de migration pour Supabase

## Configuration Supabase

Pour utiliser cette application, vous devez configurer votre projet Supabase avec les tables et politiques de sécurité appropriées.
Vous trouverez le script SQL nécessaire dans le fichier `supabase-schema.sql`.
