import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackOfficeMenu from '../components/BackOfficeMenu';
import DetailUser from './DetailUser';
import './UsersManagement.css';

const UsersManagement = ({ onNavigate, onLogout, currentPage }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // États pour les modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // État pour le formulaire
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    typeUser: 'user',
    status: 'actif'
  });

  const clearMessages = () => {
    setError(null);
    setMessage(null);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  // Fonction helper pour construire les URLs API
  const getApiUrl = (endpoint) => {
    const baseUrl = API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`;
    return `${baseUrl}${endpoint}`;
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    const userType = localStorage.getItem('typeUser');
    if (userType !== 'admin') {
      // Rediriger vers le profil si pas admin
      onNavigate('profile');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('typeUser');
      
      console.log('Token:', token);
      console.log('UserType:', userType);
      
      if (!token) {
        setError('Token non trouvé. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(getApiUrl('/users'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      if (err.response?.status === 403) {
        setError('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else {
        setError('Erreur lors du chargement des utilisateurs');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'actif' ? '#48bb78' : '#f56565';
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'var(--primary-blue)' : 'var(--medium-gray)';
  };

  // Gestionnaires de modales
  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      typeUser: user.typeUser,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleDetail = async (user) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(getApiUrl(`/users/${user._id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUser(response.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
      setError('Erreur lors du chargement des détails de l\'utilisateur');
    }
  };

  const handleAdd = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      typeUser: 'user',
      status: 'actif'
    });
    setShowAddModal(true);
  };

  // Gestionnaire de formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Soumission du formulaire d'ajout
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const token = localStorage.getItem('token');
      await axios.post(getApiUrl('/users'), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowAddModal(false);
      fetchUsers(); // Recharger la liste
      setMessage('Utilisateur ajouté avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez les informations saisies.');
      } else if (err.response?.status === 409) {
        setError('Cet email est déjà utilisé.');
      } else {
        setError('Erreur lors de l\'ajout de l\'utilisateur');
      }
    }
  };

  // Soumission du formulaire d'édition
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const token = localStorage.getItem('token');
      await axios.put(getApiUrl(`/users/${selectedUser._id}`), formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers(); // Recharger la liste
      setMessage('Utilisateur modifié avec succès');
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez les informations saisies.');
      } else if (err.response?.status === 404) {
        setError('Utilisateur non trouvé.');
      } else {
        setError('Erreur lors de la modification de l\'utilisateur');
      }
    }
  };

  // Confirmation de suppression
  const handleDeleteConfirm = async () => {
    clearMessages();
    try {
      const token = localStorage.getItem('token');
      await axios.delete(getApiUrl(`/users/${selectedUser._id}`), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers(); // Recharger la liste
      setMessage('Utilisateur supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      if (err.response?.status === 404) {
        setError('Utilisateur non trouvé.');
      } else {
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const closeModals = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowAddModal(false);
    setShowDetailModal(false);
    setSelectedUser(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      typeUser: 'user',
      status: 'actif'
    });
  };

  return (
    <div className="users-management-container">
      <BackOfficeMenu
        onNavigate={onNavigate}
        onLogout={onLogout}
        currentPage={currentPage}
      />
      <div className="users-management-content">
        <div className="users-header">
          <h1>Gestion des Utilisateurs</h1>
          <p>Administration des comptes utilisateurs</p>
          <button className="btn-add-user" onClick={handleAdd}>Ajouter un utilisateur</button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <div className="users-table-container">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className="role-badge"
                        style={{ backgroundColor: getRoleColor(user.typeUser) }}
                      >
                        {user.typeUser}
                      </span>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(user.status) }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-detail" onClick={() => handleDetail(user)}>Détails</button>
                        <button className="btn-edit" onClick={() => handleEdit(user)}>Modifier</button>
                        <button className="btn-delete" onClick={() => handleDelete(user)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modale d'ajout */}
        {showAddModal && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Ajouter un utilisateur</h2>
                <button className="modal-close" onClick={closeModals}>×</button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rôle</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModals}>Annuler</button>
                  <button type="submit" className="btn-save">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modale d'édition */}
        {showEditModal && selectedUser && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Modifier l'utilisateur</h2>
                <button className="modal-close" onClick={closeModals}>×</button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rôle</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={closeModals}>Annuler</button>
                  <button type="submit" className="btn-save">Enregistrer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modale de suppression */}
        {showDeleteModal && selectedUser && (
          <div className="modal-overlay" onClick={closeModals}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Confirmer la suppression</h2>
                <button className="modal-close" onClick={closeModals}>×</button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser.prenom} {selectedUser.nom}</strong> ?</p>
                <p className="warning-text">Cette action est irréversible.</p>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModals}>Annuler</button>
                <button type="button" className="btn-delete-confirm" onClick={handleDeleteConfirm}>Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* Modale de détails */}
        {showDetailModal && selectedUser && (
          <DetailUser user={selectedUser} onClose={closeModals} />
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
