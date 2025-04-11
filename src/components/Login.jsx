import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, supabase, testAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        console.log('Checking if already logged in...');
        const currentUser = await testAuth();
        
        if (currentUser) {
          console.log('User already logged in:', currentUser.email);
          setRedirecting(true);
          navigate('/dashboard');
        } else {
          console.log('No user logged in, showing login form');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };
    
    checkLoggedIn();
  }, [navigate, testAuth]);

  // Si l'utilisateur est déjà connecté, rediriger
  useEffect(() => {
    if (user) {
      console.log('User detected in auth context, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with email:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Login error:', signInError);
        throw signInError;
      }

      console.log('Login successful, session:', data.session);
      console.log('Redirecting to dashboard after login');
      setRedirecting(true);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la connexion.');
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  if (redirecting) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Redirection en cours...</p>
      </div>
    );
  }

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
