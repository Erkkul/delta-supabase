import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import './styles/auth.css';
import './styles/dashboard.css';

// Composant page d'accueil
const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Delta Supabase</h1>
        <p>Démonstration d'authentification et base de données avec Supabase</p>
      </header>
      <div className="home-content">
        <div className="home-features">
          <div className="feature-card">
            <h2>Authentification sécurisée</h2>
            <p>Système d'authentification complet avec inscription, connexion et récupération de mot de passe.</p>
          </div>
          <div className="feature-card">
            <h2>Base de données en temps réel</h2>
            <p>Stockage et synchronisation des données utilisateurs avec Supabase.</p>
          </div>
          <div className="feature-card">
            <h2>Interface réactive</h2>
            <p>Application React moderne avec navigation fluide et interface utilisateur intuitive.</p>
          </div>
        </div>
        <div className="home-actions">
          <Link to="/login" className="action-button primary">Se connecter</Link>
          <Link to="/signup" className="action-button secondary">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [supabaseInitialized, setSupabaseInitialized] = useState(false);
  const [initError, setInitError] = useState(null);

  // Vérifier que les variables d'environnement sont bien configurées
  useEffect(() => {
    const checkSupabaseConfig = () => {
      console.log('Checking Supabase configuration...');
      
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl) {
        console.error('REACT_APP_SUPABASE_URL is not defined in environment variables');
        setInitError('URL Supabase non configurée. Vérifiez le fichier .env');
        return false;
      }
      
      if (!supabaseAnonKey) {
        console.error('REACT_APP_SUPABASE_ANON_KEY is not defined in environment variables');
        setInitError('Clé Supabase non configurée. Vérifiez le fichier .env');
        return false;
      }
      
      console.log('Supabase configuration found:', { 
        url: supabaseUrl.substring(0, 15) + '...', 
        key: supabaseAnonKey.substring(0, 10) + '...' 
      });
      
      setSupabaseInitialized(true);
      return true;
    };
    
    checkSupabaseConfig();
  }, []);

  // Si erreur d'initialisation, afficher message
  if (initError) {
    return (
      <div className="app-error-container">
        <div className="app-error-message">
          <h2>Erreur d'initialisation</h2>
          <p>{initError}</p>
          <p>Vérifiez que le fichier .env contient les variables REACT_APP_SUPABASE_URL et REACT_APP_SUPABASE_ANON_KEY.</p>
        </div>
      </div>
    );
  }

  // Si Supabase n'est pas encore initialisé, afficher un loader
  if (!supabaseInitialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Initialisation de l'application...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<HomePage />} />
            
            {/* Routes publiques */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Redirection par défaut pour les routes non reconnues */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;