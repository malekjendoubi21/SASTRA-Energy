import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackOfficeMenu from '../components/BackOfficeMenu';
import './Contact.css';

const Contact = ({ onNavigate, onLogout, currentPage }) => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [authError, setAuthError] = useState(false);

 
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [formData, setFormData] = useState({
    // Pour contacts
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: '',
    // Pour project types
    label: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  // Récupération des données
  useEffect(() => {
    const userType = localStorage.getItem('typeUser');
    if (userType !== 'admin') {
      // Rediriger vers le profil si pas admin
      onNavigate('profile');
      return;
    }

    fetchContacts();
    fetchProjectTypes();
  }, [onNavigate]);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(Array.isArray(response.data.data) ? response.data.data : []);
      setAuthError(false);
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError(true);
        onLogout(); // Rediriger vers login
      }
      setContacts([]); // S'assurer que c'est un tableau
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/project-types`);
      setProjectTypes(Array.isArray(response.data.data) ? response.data.data : []);
      setAuthError(false);
    } catch (error) {
      console.error('Erreur lors du chargement des types de projet:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setAuthError(true);
        onLogout(); // Rediriger vers login
      }
      setProjectTypes([]); // S'assurer que c'est un tableau
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      projectType: '',
      label: ''
    });
    setEditingItem(null);
  };

  const openModal = (item = null, type = 'contact') => {
    setEditingItem(item);
    if (item) {
      if (type === 'contact') {
        setFormData({
          name: item.name || '',
          email: item.email || '',
          phone: item.phone || '',
          subject: item.subject || '',
          message: item.message || '',
          projectType: item.projectType?._id || item.projectType || '',
          label: ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          projectType: '',
          label: item.label || ''
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

  const openDetailModal = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedContact(null);
    setShowResponseForm(false);
    setResponseText('');
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      setStatusMessage('La réponse ne peut pas être vide.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/contacts/${selectedContact._id}/reponse`, 
        { reponse: responseText }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStatusMessage('Réponse ajoutée avec succès !');
      setShowResponseForm(false);
      setResponseText('');
      fetchContacts(); // Recharger la liste pour mettre à jour le statut
      
      // Mettre à jour le contact sélectionné localement
      setSelectedContact(prev => ({ ...prev, reponse: responseText }));
      
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      setStatusMessage('Erreur lors de l\'ajout de la réponse.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    try {
      if (activeTab === 'contacts') {
        const data = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          projectType: formData.projectType
        };

        // Validation côté frontend
        if (!data.name || !data.email || !data.subject || !data.message) {
          setStatusMessage('Tous les champs obligatoires doivent être remplis.');
          return;
        }

        if (editingItem) {
          await axios.put(`${import.meta.env.VITE_API_URL}/contacts/${editingItem._id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setStatusMessage('Contact modifié avec succès !');
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setStatusMessage('Contact créé avec succès !');
        }
        fetchContacts();
      } else {
        const data = { label: formData.label };

        // Validation côté frontend
        if (!data.label || data.label.trim() === '') {
          setStatusMessage('Le label du type de projet est requis.');
          return;
        }

        if (editingItem) {
          await axios.put(`${import.meta.env.VITE_API_URL}/project-types/${editingItem._id}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setStatusMessage('Type de projet modifié avec succès !');
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/project-types`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setStatusMessage('Type de projet créé avec succès !');
        }
        fetchProjectTypes();
      }

      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Afficher le message d'erreur spécifique du serveur si disponible
      const errorMessage = error.response?.data?.message || 'Erreur lors de la sauvegarde. Veuillez réessayer.';
      setStatusMessage(errorMessage);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      if (type === 'contact') {
        await axios.delete(`${import.meta.env.VITE_API_URL}/contacts/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchContacts();
      } else {
        await axios.delete(`${import.meta.env.VITE_API_URL}/project-types/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchProjectTypes();
      }
      setStatusMessage('Élément supprimé avec succès !');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setStatusMessage('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="contact-management">
      <BackOfficeMenu onNavigate={onNavigate} onLogout={onLogout} currentPage={currentPage} />

      <div className="contact-content">
        <div className="content-header">
          <h1>Gestion des Contacts et Types de Projet</h1>
          <p>Administrer les demandes de contact et les catégories de projets</p>
        </div>

        {/* Onglets */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts ({contacts.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'types' ? 'active' : ''}`}
            onClick={() => setActiveTab('types')}
          >
            Types de Projet ({projectTypes.length})
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
        {activeTab === 'contacts' && (
          <div className="tab-content">
            <div className="content-actions">
              <button className="btn-primary" onClick={() => openModal(null, 'contact')}>
                Nouveau Contact
              </button>
            </div>

            {isLoadingContacts ? (
              <div className="loading">Chargement des contacts...</div>
            ) : (
              <div className="contacts-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Téléphone</th>
                      <th>Sujet</th>
                      <th>Type de Projet</th>
                      <th>Statut</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                        <td>{contact.subject}</td>
                        <td>{contact.projectType?.label || 'N/A'}</td>
                        <td>
                          <span className={`status-indicator ${contact.reponse ? 'responded' : 'pending'}`}>
                            {contact.reponse ? '✅ Répondu' : '⏳ En attente'}
                          </span>
                        </td>
                        <td>{new Date(contact.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-detail"
                              onClick={() => openDetailModal(contact)}
                              title="Voir les détails"
                            >
                              👁️ Détails
                            </button>
                            <button
                              className="btn-edit"
                              onClick={() => openModal(contact, 'contact')}
                            >
                              Modifier
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(contact._id, 'contact')}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'types' && (
          <div className="tab-content">
            <div className="content-actions">
              <button className="btn-primary" onClick={() => openModal(null, 'type')}>
                Nouveau Type de Projet
              </button>
            </div>

            {isLoadingTypes ? (
              <div className="loading">Chargement des types de projet...</div>
            ) : (
              <div className="types-table">
                <table>
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Date de création</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectTypes.map((type) => (
                      <tr key={type._id}>
                        <td>{type.label}</td>
                        <td>{new Date(type.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>
                          <button
                            className="btn-edit"
                            onClick={() => openModal(type, 'type')}
                          >
                            Modifier
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(type._id, 'type')}
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
                  ? `Modifier ${activeTab === 'contacts' ? 'Contact' : 'Type de Projet'}`
                  : `Nouveau ${activeTab === 'contacts' ? 'Contact' : 'Type de Projet'}`
                }
              </h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {activeTab === 'contacts' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Téléphone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Type de Projet</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                      >
                        <option value="">Sélectionner un type</option>
                        {projectTypes.map((type) => (
                          <option key={type._id} value={type._id}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Sujet *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Label du type de projet *</label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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

      {/* Modale de détails du contact */}
      {showDetailModal && selectedContact && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails du Contact</h2>
              <button className="modal-close" onClick={closeDetailModal}>×</button>
            </div>

            <div className="contact-detail-card">
              <div className="detail-section">
                <h3>Informations Personnelles</h3>
                <div className="detail-row">
                  <span className="detail-label">Nom complet:</span>
                  <span className="detail-value">{selectedContact.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedContact.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Téléphone:</span>
                  <span className="detail-value">{selectedContact.phone || 'Non spécifié'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Informations du Projet</h3>
                <div className="detail-row">
                  <span className="detail-label">Sujet:</span>
                  <span className="detail-value">{selectedContact.subject}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Type de projet:</span>
                  <span className="detail-value">{selectedContact.projectType?.label || 'Non spécifié'}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>Message</h3>
                <div className="message-content">
                  {selectedContact.message}
                </div>
              </div>

              <div className="detail-section">
                <h3>Réponse {selectedContact.reponse && <span className="response-status">✅ Répondu</span>}</h3>
                {selectedContact.reponse ? (
                  <div className="response-content">
                    {selectedContact.reponse}
                  </div>
                ) : (
                  <div className="no-response">
                    <p>Aucune réponse n'a encore été apportée à ce message.</p>
                  </div>
                )}
                
                {showResponseForm ? (
                  <div className="response-form-card">
                    <h4>Ajouter une réponse</h4>
                    <form onSubmit={handleResponseSubmit}>
                      <div className="form-group">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Écrivez votre réponse ici..."
                          rows="4"
                          required
                        />
                      </div>
                      <div className="response-actions">
                        <button type="button" className="btn-cancel" onClick={() => setShowResponseForm(false)}>
                          Annuler
                        </button>
                        <button type="submit" className="btn-save">
                          Envoyer la réponse
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  !selectedContact.reponse && (
                    <button 
                      className="btn-add-response"
                      onClick={() => setShowResponseForm(true)}
                    >
                      ➕ Ajouter une réponse
                    </button>
                  )
                )}
              </div>

              <div className="detail-section">
                <h3>Informations Système</h3>
                <div className="detail-row">
                  <span className="detail-label">Date de création:</span>
                  <span className="detail-value">
                    {new Date(selectedContact.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value">{selectedContact._id}</span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={closeDetailModal}>
                Fermer
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => {
                  closeDetailModal();
                  openModal(selectedContact, 'contact');
                }}
              >
                Modifier le contact
              </button>
              {!selectedContact.reponse && !showResponseForm && (
                <button 
                  type="button" 
                  className="btn-response"
                  onClick={() => setShowResponseForm(true)}
                >
                  Ajouter une réponse
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
