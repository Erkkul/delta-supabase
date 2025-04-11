import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SignUp = () => {
  // États pour stocker les valeurs des champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Création du compte avec Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // Mise à jour des champs additionnels dans la table users
      if (data.user) {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            first_name: firstName,
            last_name: lastName
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Erreur lors de la mise à jour du profil:', updateError);
        }
      }

      setMessage('Inscription réussie ! Vérifiez votre email pour confirmer votre compte.');
    } catch (error) {
      setError(error.message || 'Une erreur est survenue lors de l\'inscription.');
      console.error('Erreur d\'inscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Créer un compte</h2>
      
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
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
            minLength="6"
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
      
      <p className="login-link">
        Vous avez déjà un compte ? <a href="/login">Connectez-vous</a>
      </p>
    </div>
  );
};

export default SignUp;
