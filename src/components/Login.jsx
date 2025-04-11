import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const Login = () => {
  // États pour stocker les valeurs des champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Connexion avec Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      // Redirection vers la page d'accueil ou le tableau de bord
      window.location.href = '/dashboard';
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la connexion.');
      console.error('Erreur de connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
      
      <div className="auth-links">
        <p className="signup-link">
          Pas encore de compte ? <a href="/signup">Créer un compte</a>
        </p>
        <p className="reset-link">
          <a href="/reset-password">Mot de passe oublié ?</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
