# Application Delta Supabase

Cette application de démonstration utilise Supabase pour l'authentification et la gestion des utilisateurs.

## Configuration

### Prérequis

- Node.js et npm installés
- Un compte Supabase avec un projet créé

### Installation

1. Clonez ce dépôt
   ```bash
   git clone https://github.com/Erkkul/delta-supabase.git
   cd delta-supabase
   ```

2. Installez les dépendances
   ```bash
   npm install
   ```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
   ```
   REACT_APP_SUPABASE_URL=votre_url_supabase
   REACT_APP_SUPABASE_ANON_KEY=votre_clé_anon_supabase
   ```

### Configuration Supabase

1. Dans votre projet Supabase, assurez-vous que l'authentification par email est activée.

2. La table personnalisée `users` a déjà été créée dans Supabase avec les champs nécessaires pour stocker les informations des utilisateurs.

## Fonctionnalités

### Authentification

- Inscription avec email/mot de passe
- Connexion des utilisateurs
- Réinitialisation de mot de passe
- Profil utilisateur avec informations personnelles

### Sécurité

- Routes protégées avec authentification requise
- Gestion des tokens JWT par Supabase
- Row Level Security (RLS) pour la protection des données utilisateur

## Structure du projet

```
src/
  |- components/         # Composants React
  |    |- Dashboard.jsx   # Tableau de bord utilisateur
  |    |- Login.jsx       # Formulaire de connexion
  |    |- PrivateRoute.jsx # Protection des routes authentifiées
  |    |- ResetPassword.jsx # Réinitialisation de mot de passe
  |    |- SignUp.jsx      # Formulaire d'inscription
  |
  |- contexts/           # Contextes React
  |    |- AuthContext.jsx # Contexte d'authentification
  |
  |- styles/             # Feuilles de style CSS
  |    |- auth.css        # Styles des composants d'authentification
  |    |- dashboard.css   # Styles du tableau de bord
  |
  |- App.jsx             # Composant principal et routage
  |- index.jsx           # Point d'entrée de l'application
```

## Utilisation

```bash
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Développement

Pour ajouter de nouvelles fonctionnalités ou modifier des composants existants, consultez la documentation de Supabase et de React Router.

## Licence

Ce projet est sous licence MIT.
