import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackOfficeMenu from '../components/BackOfficeMenu';
import './locations.css';

const Locations = ({ onNavigate, onLogout, currentPage }) => {
  const [activeTab, setActiveTab] = useState('locations');
  const [locations, setLocations] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Configuration axios avec authentification
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    // Pour locations
    city: '',
    address: '',
    contact: '',
    isPrimary: false,
    // Pour partners
    name: '',
    logo: '',
    description: '',
    website: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  // Récupération des données
  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const userType = localStorage.getItem('typeUser');
    if (userType !== 'admin') {
      onNavigate('profile');
      return;
    }

    fetchLocations();
    fetchPartners();
  }, [onNavigate]);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/locations`, getAuthConfig());
      setLocations(Array.isArray(response.data) ? response.data : []);
      setAuthError(false);
    } catch (error) {
      console.error('Erreur lors du chargement des bureaux:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError(true);
        onLogout(); // Rediriger vers login
      }
      setLocations([]); // S'assurer que c'est un tableau
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/partners`, getAuthConfig());
      setPartners(Array.isArray(response.data) ? response.data : []);
      setAuthError(false);
    } catch (error) {
      console.error('Erreur lors du chargement des partenaires:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError(true);
        onLogout(); // Rediriger vers login
      }
      setPartners([]); // S'assurer que c'est un tableau
    } finally {
      setIsLoadingPartners(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      city: '',
      address: '',
      contact: '',
      isPrimary: false,
      name: '',
      logo: '',
      description: '',
      website: ''
    });
    setEditingItem(null);
  };

  const openModal = (item = null, type = 'location') => {
    setEditingItem(item);
    if (item) {
      if (type === 'location') {
        setFormData({
          city: item.city || '',
          address: item.address || '',
          contact: item.contact || '',
          isPrimary: item.isPrimary || false,
          name: '',
          logo: '',
          description: '',
          website: ''
        });
      } else {
        setFormData({
          city: '',
          address: '',
          contact: '',
          isPrimary: false,
          name: item.name || '',
          logo: item.logo || '',
          description: item.description || '',
          website: item.website || ''
        });
      }
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setStatusMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      if (activeTab === 'locations') {
        const data = {
          city: formData.city,
          address: formData.address,
          contact: formData.contact,
          isPrimary: formData.isPrimary
        };

        if (editingItem) {
          await axios.put(`${import.meta.env.VITE_API_URL}/locations/${editingItem._id}`, data, getAuthConfig());
          setStatusMessage('Bureau modifié avec succès !');
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/locations`, data, getAuthConfig());
          setStatusMessage('Bureau créé avec succès !');
        }
        fetchLocations();
      } else {
        const data = {
          name: formData.name,
          logo: formData.logo,
          description: formData.description,
          website: formData.website
        };

        if (editingItem) {
          await axios.put(`${import.meta.env.VITE_API_URL}/partners/${editingItem._id}`, data, getAuthConfig());
          setStatusMessage('Partenaire modifié avec succès !');
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/partners`, data, getAuthConfig());
          setStatusMessage('Partenaire créé avec succès !');
        }
        fetchPartners();
      }

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setStatusMessage('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      if (type === 'location') {
        await axios.delete(`${import.meta.env.VITE_API_URL}/locations/${id}`, getAuthConfig());
        fetchLocations();
      } else {
        await axios.delete(`${import.meta.env.VITE_API_URL}/partners/${id}`, getAuthConfig());
        fetchPartners();
      }
      setStatusMessage('Élément supprimé avec succès !');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setStatusMessage('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="locations-management">
      <BackOfficeMenu onNavigate={onNavigate} onLogout={onLogout} currentPage={currentPage} />

      <div className="locations-content">
        <div className="content-header">
          <h1>Gestion des Bureaux et Partenaires</h1>
          <p>Administrer les bureaux et les partenaires de l'entreprise</p>
        </div>

        {/* Onglets */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            Bureaux ({locations.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'partners' ? 'active' : ''}`}
            onClick={() => setActiveTab('partners')}
          >
            Partenaires ({partners.length})
          </button>
        </div>

        {/* Messages de statut */}
        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('succès') ? 'success' : 'error'}`}>
            {statusMessage}
          </div>
        )}

        {authError && (
          <div className="status-message error">
            Accès refusé. Vous devez être administrateur pour accéder à cette page.
          </div>
        )}

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'locations' && (
          <div className="tab-content">
            <div className="content-actions">
              <button className="btn-primary" onClick={() => openModal(null, 'location')}>
                Nouveau Bureau
              </button>
            </div>

            {isLoadingLocations ? (
              <div className="loading">Chargement des bureaux...</div>
            ) : (
              <div className="locations-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ville</th>
                      <th>Adresse</th>
                      <th>Contact</th>
                      <th>Siège Principal</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map((location) => (
                      <tr key={location._id}>
                        <td>{location.city}</td>
                        <td>{location.address}</td>
                        <td>{location.contact}</td>
                        <td>
                          {location.isPrimary ? (
                            <span className="primary-badge">Oui</span>
                          ) : (
                            'Non'
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => openModal(location, 'location')}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(location._id, 'location')}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="tab-content">
            <div className="content-actions">
              <button className="btn-primary" onClick={() => openModal(null, 'partner')}>
                Nouveau Partenaire
              </button>
            </div>

            {isLoadingPartners ? (
              <div className="loading">Chargement des partenaires...</div>
            ) : (
              <div className="partners-table">
                <table>
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Nom</th>
                      <th>Description</th>
                      <th>Site Web</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((partner) => (
                      <tr key={partner._id}>
                        <td>
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="partner-logo-preview"
                            onError={(e) => {
                              e.target.src = '/placeholder-logo.png';
                            }}
                          />
                        </td>
                        <td>{partner.name}</td>
                        <td>{partner.description}</td>
                        <td>
                          <a href={partner.website} target="_blank" rel="noopener noreferrer">
                            {partner.website}
                          </a>
                        </td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => openModal(partner, 'partner')}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(partner._id, 'partner')}
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal pour ajouter/modifier */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {editingItem
                  ? `Modifier ${activeTab === 'locations' ? 'Bureau' : 'Partenaire'}`
                  : `Nouveau ${activeTab === 'locations' ? 'Bureau' : 'Partenaire'}`
                }
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {activeTab === 'locations' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ville *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact *</label>
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Adresse *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isPrimary"
                        checked={formData.isPrimary}
                        onChange={handleInputChange}
                      />
                      Siège principal
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom du partenaire *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Site web</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Logo (URL)</label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
