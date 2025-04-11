import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, userDetails, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNotes: 0,
    lastLogin: ''
  });
  const [error, setError] = useState(null);

  // Afficher l'identifiant de l'utilisateur pour débogage
  console.log('Dashboard rendering for user:', user?.email);

  useEffect(() => {
    // Simuler le chargement des données (court délai pour démo)
    const timer = setTimeout(() => {
      try {
        // Générer des stats factices
        setStats({
          totalNotes: Math.floor(Math.random() * 10),
          lastLogin: new Date().toLocaleString()
        });
        console.log('Dashboard data loaded successfully');
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Impossible de charger les données du tableau de bord');
      } finally {
        setLoading(false);
      }
    }, 300); // Réduit à 300ms pour accélérer le chargement

    return () => clearTimeout(timer);
  }, []);

  // S'assurer que user est bien défini
  if (!user) {
    console.log('No user data in Dashboard - returning to login');
    return (
      <div className="dashboard-error">
        <p>Session expirée ou utilisateur non authentifié. Veuillez vous reconnecter.</p>
        <button onClick={() => window.location.href = '/login'} className="action-button">
          Retour à la connexion
        </button>
      </div>
    );
  }

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Tableau de bord</h1>
        </header>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Tableau de bord</h1>
          <button className="logout-button" onClick={signOut}>
            Se déconnecter
          </button>
        </header>
        <div className="dashboard-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="action-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Affichage normal du tableau de bord
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Tableau de bord</h1>
        <button className="logout-button" onClick={signOut}>
          Se déconnecter
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="user-info-card">
          <h2>Informations utilisateur</h2>
          <div className="user-info-content">
            <div className="avatar-placeholder">
              {userDetails && userDetails.first_name ? userDetails.first_name.charAt(0).toUpperCase() : 
               user?.email ? user.email.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="user-details">
              <p><strong>Email:</strong> {user?.email || 'Non disponible'}</p>
              {userDetails ? (
                <>
                  <p><strong>Prénom:</strong> {userDetails.first_name || 'Non renseigné'}</p>
                  <p><strong>Nom:</strong> {userDetails.last_name || 'Non renseigné'}</p>
                </>
              ) : (
                <p><strong>Profil:</strong> Informations complémentaires non disponibles</p>
              )}
              <p><strong>Dernière connexion:</strong> {stats.lastLogin}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Notes</h3>
            <div className="card-value">{stats.totalNotes}</div>
            <p>Notes enregistrées</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Profil</h3>
            <div className="card-value">
              {userDetails && userDetails.first_name && userDetails.last_name ? '100%' : '50%'}
            </div>
            <p>Complétude du profil</p>
          </div>

          <div className="dashboard-card">
            <h3>Activité</h3>
            <div className="card-value">Actif</div>
            <p>Statut du compte</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="action-button">Créer une note</button>
          <button className="action-button">Modifier le profil</button>
          <button className="action-button">Paramètres</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
