import React, { useEffect } from 'react';
import BackOfficeMenu from '../components/BackOfficeMenu';
import './ProfileAdmin.css';

const ProfileAdmin = ({ onNavigate, onLogout, currentPage }) => {
  useEffect(() => {
    const userType = localStorage.getItem('typeUser');
    if (userType !== 'admin') {
      onNavigate('profile');
      return;
    }
  }, [onNavigate]);

  return (
    <div className="profile-admin-container">
      <BackOfficeMenu
        onNavigate={onNavigate}
        onLogout={onLogout}
        currentPage={currentPage}
      />
      <div className="profile-admin-content">
        <div className="profile-header">
          <h1>Profil Administrateur</h1>
          <p>Gestion de votre profil administrateur</p>
        </div>

        <div className="profile-form">
          <div className="form-section">
            <h2>Informations Personnelles</h2>
            <div className="form-group">
              <label>Prénom</label>
              <input type="text" placeholder="Votre prénom" />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input type="text" placeholder="Votre nom" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="votre.email@example.com" />
            </div>
          </div>

          <div className="form-section">
            <h2>Sécurité</h2>
            <div className="form-group">
              <label>Mot de passe actuel</label>
              <input type="password" placeholder="Mot de passe actuel" />
            </div>
            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <input type="password" placeholder="Nouveau mot de passe" />
            </div>
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" placeholder="Confirmer le mot de passe" />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-save">Enregistrer les modifications</button>
            <button className="btn-cancel">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;
