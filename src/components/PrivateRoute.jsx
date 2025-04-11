import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  // Ajouter un timeout de sécurité pour éviter les blocages infinis
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('Auth loading timeout occurred');
        setTimeoutOccurred(true);
      }
    }, 3000); // 3 secondes maximum pour le chargement

    return () => clearTimeout(timer);
  }, [loading]);

  // Si le timeout est atteint, agir comme si l'utilisateur n'était pas authentifié
  if (timeoutOccurred) {
    console.log('Auth timeout - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Afficher le loader uniquement pendant l'authentification
  if (loading) {
    console.log('Auth is loading - showing loader');
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!user) {
    console.log('No authenticated user - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Rendre le composant enfant si l'utilisateur est authentifié
  console.log('User authenticated - rendering protected content');
  return children;
};

export default PrivateRoute;
