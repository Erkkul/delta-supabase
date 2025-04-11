import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user, loading, initialized, testAuth, lastSession } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  // Déboguer l'authentification
  useEffect(() => {
    console.log('PrivateRoute mounted');
    console.log('Initial auth state:', { user, loading, initialized });

    // Au montage, vérifier immédiatement l'authentification
    const checkAuth = async () => {
      try {
        setChecking(true);
        console.log('Starting direct auth check');
        
        // Vérifier directement avec l'API Supabase
        const currentUser = await testAuth();
        
        if (currentUser) {
          console.log('User is authenticated via direct check:', currentUser.email);
          setIsAuthenticated(true);
        } else {
          console.log('User is NOT authenticated via direct check');
          setIsAuthenticated(false);
          // Rediriger immédiatement si l'utilisateur n'est pas authentifié
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error during direct auth check:', error);
        setIsAuthenticated(false);
      } finally {
        setChecking(false);
      }
    };

    checkAuth();

    // Ajouter un timeout de sécurité
    const timer = setTimeout(() => {
      if (checking) {
        console.log('Auth check timeout occurred');
        setTimeoutOccurred(true);
        setChecking(false);
        navigate('/login', { replace: true });
      }
    }, 3000); // 3 secondes maximum

    return () => {
      clearTimeout(timer);
      console.log('PrivateRoute unmounted');
    };
  }, [user, loading, initialized, navigate, testAuth, checking]);

  // Effet pour observer les changements d'état d'auth
  useEffect(() => {
    console.log('Auth state changed in PrivateRoute:', { 
      user: user?.email, 
      loading, 
      initialized,
      lastSession: lastSession?.user?.email,
      isAuthenticated
    });
  }, [user, loading, initialized, lastSession, isAuthenticated]);

  // Si le timeout est atteint, rediriger vers login
  if (timeoutOccurred) {
    console.log('Redirecting due to timeout');
    return <Navigate to="/login" replace />;
  }

  // Pendant la vérification, afficher le loader
  if (checking) {
    console.log('Showing loader while checking auth');
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Vérification de l'authentification...</p>
      </div>
    );
  }

  // Après vérification, si authentifié, afficher le contenu
  if (isAuthenticated) {
    console.log('Rendering protected content');
    return children;
  }

  // Sinon, rediriger vers login
  console.log('Redirecting to login (not authenticated)');
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;