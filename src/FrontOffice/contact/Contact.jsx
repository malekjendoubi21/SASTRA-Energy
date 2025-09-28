import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: ''
  });

  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [locations, setLocations] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchProjectTypes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/project-types`);
        setProjectTypes(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        console.error('Erreur lors du chargement des types de projet:', error);
        setProjectTypes([]);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/locations`);
        setLocations(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erreur lors du chargement des bureaux:', error);
        setLocations([]);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchProjectTypes();
    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, formData);
      
      if (response.data.success) {
        setStatusMessage('Message envoyé avec succès ! Nous vous contacterons bientôt.');
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          projectType: ''
        });
      } else {
        setStatusMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setStatusMessage('Erreur lors de l\'envoi du message. Veuillez vérifier votre connexion et réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact" id="contact">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <h1 className="contact-title">Contactez-Nous</h1>
            <p className="contact-subtitle">
              Prêt à passer à l'énergie solaire ? Nos experts sont là pour vous accompagner
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Parlons de Votre Projet</h2>
              <p>
                Que vous soyez un particulier ou une entreprise, nous avons la solution 
                photovoltaïque adaptée à vos besoins. Contactez-nous pour une étude gratuite.
              </p>
              
              <div className="contact-benefits">
                <div className="benefit-item">
                  <div className="benefit-icon">🆓</div>
                  <div>
                    <h4>Étude Gratuite</h4>
                    <p>Analyse complète de vos besoins énergétiques</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">⚡</div>
                  <div>
                    <h4>Réponse Rapide</h4>
                    <p>Réponse sous 24h maximum</p>
                  </div>
                </div>
                
                <div className="benefit-item">
                  <div className="benefit-icon">🎯</div>
                  <div>
                    <h4>Solution Sur Mesure</h4>
                    <p>Projet adapté à votre situation</p>
                  </div>
                </div>
              </div>

              <div className="primary-contact-info">
                <h3>Contact Principal</h3>
                <div className="contact-details">
                  <div className="contact-detail">
                    <span className="detail-icon">📧</span>
                    <span>sastraenergy@yahoo.com</span>
                  </div>
                  <div className="contact-detail">
                    <span className="detail-icon">📞</span>
                    <span>+216 36 437 473 / +216 93 454 400</span>
                  </div>
                  <div className="contact-detail">
                    <span className="detail-icon">📍</span>
                    <span>Résidence MAAROUFI, AV Habib Bourguiba, Bardo 2000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Nom Complet *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="projectType">Type de Projet</label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    disabled={isLoadingTypes}
                  >
                    <option value="">
                      {isLoadingTypes ? 'Chargement...' : 'Sélectionnez un type de projet'}
                    </option>
                    {projectTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Sujet</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Ex: Demande de devis pour installation résidentielle"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    placeholder="Décrivez votre projet, vos besoins ou vos questions..."
                  ></textarea>
                </div>

                {statusMessage && (
                  <div className={`status-message ${statusMessage.includes('succès') ? 'success' : 'error'}`}>
                    {statusMessage}
                  </div>
                )}

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Envoi en cours...' : 'Envoyer le Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="contact-locations">
        <div className="container">
          <div className="section-header">
            <h2>Nos Bureaux</h2>
            <p>Retrouvez-nous dans toute la Tunisie</p>
          </div>
          
          <div className="locations-grid">
            {isLoadingLocations ? (
              <div className="loading-locations">Chargement des bureaux...</div>
            ) : (
              locations.map((location, index) => (
                <div key={location._id || index} className={`location-card ${location.isPrimary ? 'primary' : ''}`}>
                  {location.isPrimary && <div className="primary-badge">Siège Principal</div>}
                  <div className="location-header">
                    <div className="location-icon">📍</div>
                    <h3>{location.city}</h3>
                  </div>
                  <div className="location-info">
                    <div className="location-address">
                      <span className="info-icon">🏢</span>
                      <span>{location.address}</span>
                    </div>
                    <div className="location-contact">
                      <span className="info-icon">📞</span>
                      <span>+216 {location.contact}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Urgence ? Appelez-nous Directement</h2>
            <p>Pour toute urgence ou demande prioritaire</p>
            <div className="urgent-contacts">
              <a href="tel:+21636437473" className="urgent-btn">
                📞 +216 36 437 473
              </a>
              <a href="tel:+21693454400" className="urgent-btn">
                📞 +216 93 454 400
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
