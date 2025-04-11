import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase avec valeurs par défaut si env vars ne sont pas disponibles
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://rcmuejvaxqzbynsezjkk.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjbXVlanZheHF6Ynluc2V6amtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzMzk1MzIsImV4cCI6MjAyNzkxNTUzMn0.lG59IG7KY7lJvp5JhqF2G0sXmbDIVB8XicX-1Sgy0t8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('Supabase client initialized with URL:', supabaseUrl);

// Création du contexte d'authentification
const AuthContext = createContext();

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};

// Fournisseur du contexte d'authentification
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Commence à true pour s'assurer qu'on vérifie d'abord la session
  const [initialized, setInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Debug: stocker la dernière session pour débogage
  const [lastSession, setLastSession] = useState(null);

  // Fonction pour obtenir les détails utilisateur de la table personnalisée
  const fetchUserDetails = async (userId) => {
    console.log('Fetching user details for ID:', userId);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user details:', error);
        return null;
      }

      console.log('User details retrieved:', data);
      return data;
    } catch (error) {
      console.error('Unexpected error in fetchUserDetails:', error);
      return null;
    }
  };

  // Déconnecter l'utilisateur
  const signOut = async () => {
    console.log('Signing out...');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      console.log('Sign out successful');
      setUser(null);
      setUserDetails(null);
      setLastSession(null);
      // Rediriger vers la page de connexion après déconnexion
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Vérifier la session utilisateur au chargement initial
  useEffect(() => {
    const checkSession = async () => {
      console.log('Checking session...');
      try {
        setLoading(true);
        
        // 1. Vérifier la session actuelle
        const { data, error } = await supabase.auth.getSession();
        console.log('Session data:', data);
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }

        // Stocker la session pour débogage
        setLastSession(data.session);

        if (data.session?.user) {
          console.log('User found in session:', data.session.user.email);
          setUser(data.session.user);
          
          // Tentative de récupération des détails utilisateur
          try {
            const details = await fetchUserDetails(data.session.user.id);
            setUserDetails(details);
          } catch (detailsError) {
            console.error('Error fetching user details:', detailsError);
          }
        } else {
          console.log('No user in session, redirecting to login');
          setUser(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        setUserDetails(null);
        setAuthError(error.message);
      } finally {
        setLoading(false);
        setInitialized(true);
        console.log('Auth initialization complete');
      }
    };

    checkSession();

    // S'abonner aux changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setLastSession(session); // Stocker pour débogage
        
        if (session?.user) {
          console.log('User authenticated in auth state change:', session.user.email);
          setUser(session.user);
          try {
            const details = await fetchUserDetails(session.user.id);
            setUserDetails(details);
          } catch (detailsError) {
            console.error('Error fetching user details on auth change:', detailsError);
          }
        } else {
          console.log('No user in auth state change');
          setUser(null);
          setUserDetails(null);
        }
        
        setLoading(false);
      }
    );

    // Se désabonner lors du nettoyage
    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription?.unsubscribe();
    };
  }, []);

  // Exécuter un test de session pour vérifier s'il y a un utilisateur dès que possible
  const testAuth = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      console.log('Auth test result:', currentUser ? 'User found' : 'No user');
      if (currentUser) {
        console.log('Test auth user:', currentUser.email);
      }
      return currentUser;
    } catch (error) {
      console.error('Auth test error:', error);
      return null;
    }
  };

  // Valeur du contexte
  const value = {
    user,
    userDetails,
    loading,
    initialized,
    signOut,
    supabase,
    authError,
    lastSession,
    testAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
