import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  const [loading, setLoading] = useState(true);

  // Fonction pour obtenir les détails utilisateur de la table personnalisée
  const fetchUserDetails = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erreur lors de la récupération des détails utilisateur:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return null;
    }
  };

  // Effet pour écouter les changements d'état d'authentification
  useEffect(() => {
    // Vérifier l'état de session actuel
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        if (session?.user) {
          setUser(session.user);
          const details = await fetchUserDetails(session.user.id);
          setUserDetails(details);
        } else {
          setUser(null);
          setUserDetails(null);
        }
      } catch (error) {
        console.error('Erreur de session:', error);
        setUser(null);
        setUserDetails(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // S'abonner aux changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const details = await fetchUserDetails(session.user.id);
          setUserDetails(details);
        } else {
          setUser(null);
          setUserDetails(null);
        }
        setLoading(false);
      }
    );

    // Se désabonner lors du nettoyage
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Fonction de déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Valeur du contexte
  const value = {
    user,
    userDetails,
    loading,
    signOut,
    supabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
