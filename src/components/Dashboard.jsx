import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, userDetails, signOut } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Tableau de bord</h1>
      
      <div className="user-info">
        <h2>Informations utilisateur</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        {userDetails && (
          <>
            <p><strong>Prénom:</strong> {userDetails.first_name || 'Non renseigné'}</p>
            <p><strong>Nom:</strong> {userDetails.last_name || 'Non renseigné'}</p>
          </>
        )}
      </div>
      
      <button className="logout-button" onClick={signOut}>
        Se déconnecter
      </button>
    </div>
  );
};

export default Dashboard;
