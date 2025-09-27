import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editForm, setEditForm] = useState({
    nom: '',
    prenom: '',
    age: '',
    numeroTelephone: '',
    adresse: '',
    region: '',
    ville: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    ancienMotDePasse: '',
    nouveauMotDePasse: '',
    confirmerMotDePasse: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Non authentifié');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setEditForm({
        nom: res.data.nom || '',
        prenom: res.data.prenom || '',
        age: res.data.age || '',
        numeroTelephone: res.data.numeroTelephone || '',
        adresse: res.data.adresse || '',
        region: res.data.region || '',
        ville: res.data.ville || ''
      });
    } catch (err) {
      setMessage('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${API_URL}/auth/update-profile`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Profil mis à jour avec succès');
      setUser(res.data.user);
      setShowEditProfile(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.nouveauMotDePasse !== passwordForm.confirmerMotDePasse) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/auth/update-password`, {
        ancienMotDePasse: passwordForm.ancienMotDePasse,
        nouveauMotDePasse: passwordForm.nouveauMotDePasse
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Mot de passe mis à jour avec succès');
      setShowChangePassword(false);
      setPasswordForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmerMotDePasse: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) return (
    <div className="profile-loading">
      <div className="spinner"></div>
      <p>Chargement du profil...</p>
    </div>
  );

  if (message && !user) return (
    <div className="profile-container">
      <div className="error-message">{message}</div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
          </div>
        </div>
        <div className="profile-title">
          <h1>{user?.prenom} {user?.nom}</h1>
          <p>{user?.mail}</p>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>Informations Personnelles</h2>
            <button className="edit-btn" onClick={() => setShowEditProfile(true)}>
              ✏️ Modifier Profil
            </button>
          </div>
          <div className="info-grid">
            <div className="info-card">
              <label>Nom</label>
              <p>{user?.nom || 'Non spécifié'}</p>
            </div>
            <div className="info-card">
              <label>Prénom</label>
              <p>{user?.prenom || 'Non spécifié'}</p>
            </div>
            <div className="info-card">
              <label>Email</label>
              <p>{user?.mail}</p>
            </div>
            <div className="info-card">
              <label>Âge</label>
              <p>{user?.age || 'Non spécifié'}</p>
            </div>
            <div className="info-card">
              <label>Téléphone</label>
              <p>{user?.numeroTelephone || 'Non spécifié'}</p>
            </div>
            <div className="info-card">
              <label>Adresse</label>
              <p>{user?.adresse || 'Non spécifié'}</p>
            </div>
            <div className="info-card">
              <label>Région</label>
              <p>{user?.region || 'Non spécifié'}</p>
            </div>
            <div className="info-card">
              <label>Ville</label>
              <p>{user?.ville || 'Non spécifié'}</p>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <div className="section-header">
            <h2>Sécurité</h2>
            <button className="edit-btn security-btn" onClick={() => setShowChangePassword(true)}>
              🔒 Changer Mot de Passe
            </button>
          </div>
          <div className="security-info">
            <p>Dernière modification du mot de passe : Jamais</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Se déconnecter
          </button>
        </div>
      </div>

      {/* Modal Modifier Profil */}
      {showEditProfile && (
        <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier le Profil</h3>
              <button className="close-btn" onClick={() => setShowEditProfile(false)}>×</button>
            </div>
            <form onSubmit={handleEditProfile} className="edit-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={editForm.prenom}
                    onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Âge</label>
                  <input
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    min="1"
                    max="120"
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={editForm.numeroTelephone}
                    onChange={(e) => setEditForm({...editForm, numeroTelephone: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input
                  type="text"
                  value={editForm.adresse}
                  onChange={(e) => setEditForm({...editForm, adresse: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Région</label>
                  <input
                    type="text"
                    value={editForm.region}
                    onChange={(e) => setEditForm({...editForm, region: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={editForm.ville}
                    onChange={(e) => setEditForm({...editForm, ville: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowEditProfile(false)}>
                  Annuler
                </button>
                <button type="submit" className="save-btn">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Changer Mot de Passe */}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Changer le Mot de Passe</h3>
              <button className="close-btn" onClick={() => setShowChangePassword(false)}>×</button>
            </div>
            <form onSubmit={handleChangePassword} className="edit-form">
              <div className="form-group">
                <label>Ancien mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.ancienMotDePasse}
                  onChange={(e) => setPasswordForm({...passwordForm, ancienMotDePasse: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.nouveauMotDePasse}
                  onChange={(e) => setPasswordForm({...passwordForm, nouveauMotDePasse: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={passwordForm.confirmerMotDePasse}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmerMotDePasse: e.target.value})}
                  required
                  minLength="6"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowChangePassword(false)}>
                  Annuler
                </button>
                <button type="submit" className="save-btn">
                  Changer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;