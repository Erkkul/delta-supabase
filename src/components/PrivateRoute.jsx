import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Dès que l'authentification est terminée et que l'utilisateur est défini (ou non),
    // nous mettons fin au chargement
    if (!authLoading) {
      // Un petit délai pour une transition plus fluide
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  // Pendant le chargement de l'auth, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rendre le composant enfant si l'utilisateur est authentifié
  return children;
};

export default PrivateRoute;
