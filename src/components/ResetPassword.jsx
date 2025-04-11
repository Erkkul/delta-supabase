import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setMessage('Un email de réinitialisation de mot de passe a été envoyé à votre adresse email.');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de la demande de réinitialisation.');
      console.error('Erreur de réinitialisation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Réinitialiser votre mot de passe</h2>
      
      {message && <div className="success-message">{message}</div>}
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
        
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
      
      <div className="auth-links">
        <p className="login-link">
          <a href="/login">Retour à la connexion</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
