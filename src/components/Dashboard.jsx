import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, userDetails, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalNotes: 0,
    lastLogin: ''
  });

  useEffect(() => {
    // Simuler le chargement des données
    const timer = setTimeout(() => {
      setStats({
        totalNotes: Math.floor(Math.random() * 10),
        lastLogin: new Date().toLocaleString()
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

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
              {userDetails && userDetails.first_name ? userDetails.first_name.charAt(0) : user?.email.charAt(0)}
            </div>
            <div className="user-details">
              <p><strong>Email:</strong> {user?.email}</p>
              {userDetails && (
                <>
                  <p><strong>Prénom:</strong> {userDetails.first_name || 'Non renseigné'}</p>
                  <p><strong>Nom:</strong> {userDetails.last_name || 'Non renseigné'}</p>
                </>
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
