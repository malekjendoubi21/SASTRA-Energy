import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './About.css';

const About = () => {
  const [locations, setLocations] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isLoadingPartners, setIsLoadingPartners] = useState(true);

  useEffect(() => {
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

    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/partners`);
        setPartners(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Erreur lors du chargement des partenaires:', error);
        setPartners([]);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    fetchLocations();
    fetchPartners();
  }, []);

  return (
    <div className="about" id="about">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1 className="about-title">À Propos de Sastra Energy</h1>
            <p className="about-subtitle">
              Pionniers de l'énergie solaire en Tunisie depuis 2016
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2>Notre Histoire</h2>
              <p>
                Fondée en 2016, <strong>Sastra Energy</strong> est née de la passion d'une équipe d'experts 
                pour les énergies renouvelables. Nous avons commencé avec une vision claire : 
                démocratiser l'accès à l'énergie solaire en Tunisie et contribuer à un avenir plus durable.
              </p>
              <p>
                Au fil des années, nous avons développé notre expertise et étendu nos services 
                pour devenir l'un des acteurs de référence dans le domaine photovoltaïque en Tunisie.
              </p>
            </div>
            <div className="story-image">
              <div className="year-highlight">
                <span className="year">2016</span>
                <span className="year-text">Année de fondation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-grid">
              <div className="mission-card">
                <div className="mission-icon">🎯</div>
                <h3>Notre Mission</h3>
                <p>
                  Fournir des solutions d'énergie solaire respectueuses de l'environnement 
                  pour accompagner la transition énergétique de nos clients.
                </p>
              </div>
              
              <div className="mission-card">
                <div className="mission-icon">👁️</div>
                <h3>Notre Vision</h3>
                <p>
                  Être le leader en Tunisie dans les solutions photovoltaïques innovantes 
                  et contribuer à un avenir énergétique durable.
                </p>
              </div>
              
              <div className="mission-card">
                <div className="mission-icon">⭐</div>
                <h3>Nos Valeurs</h3>
                <p>
                  Excellence, innovation, respect de l'environnement et satisfaction client 
                  sont au cœur de toutes nos actions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="activities-section">
        <div className="container">
          <div className="section-header">
            <h2>Nos Activités Principales</h2>
            <p>Notre expertise couvre l'ensemble des solutions photovoltaïques</p>
          </div>
          
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-header">
                <div className="activity-icon">⚡</div>
                <h3>Solaire PV Raccordé au Réseau BT</h3>
              </div>
              <p>
                Installations photovoltaïques connectées au réseau basse tension, 
                idéales pour les particuliers et petites entreprises souhaitant 
                réduire leur facture énergétique.
              </p>
              <ul className="activity-features">
                <li>Installation résidentielle</li>
                <li>Revente d'énergie</li>
                <li>Maintenance incluse</li>
              </ul>
            </div>

            <div className="activity-card">
              <div className="activity-header">
                <div className="activity-icon">🏭</div>
                <h3>Solaire PV Raccordé au Réseau MT</h3>
              </div>
              <p>
                Solutions industrielles connectées au réseau moyenne tension, 
                parfaites pour les grandes entreprises et complexes industriels 
                avec des besoins énergétiques importants.
              </p>
              <ul className="activity-features">
                <li>Installations industrielles</li>
                <li>Haute capacité</li>
                <li>ROI optimisé</li>
              </ul>
            </div>

            <div className="activity-card">
              <div className="activity-header">
                <div className="activity-icon">💧</div>
                <h3>Pompage Solaire</h3>
              </div>
              <p>
                Systèmes de pompage alimentés par l'énergie solaire pour 
                l'irrigation agricole et l'approvisionnement en eau potable 
                dans les zones rurales.
              </p>
              <ul className="activity-features">
                <li>Irrigation agricole</li>
                <li>Approvisionnement en eau</li>
                <li>Solution autonome</li>
              </ul>
            </div>

            <div className="activity-card">
              <div className="activity-header">
                <div className="activity-icon">🏝️</div>
                <h3>Sites Isolés</h3>
              </div>
              <p>
                Solutions énergétiques autonomes pour les sites non raccordés 
                au réseau électrique, incluant stockage et gestion intelligente 
                de l'énergie.
              </p>
              <ul className="activity-features">
                <li>Autonomie complète</li>
                <li>Stockage d'énergie</li>
                <li>Gestion intelligente</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section" id="partners">
        <div className="container">
          <div className="section-header">
            <h2>Nos Partenaires</h2>
            <p>Nous collaborons avec les meilleures marques internationales pour garantir qualité et performance</p>
          </div>
          
          <div className="partners-grid">
            {isLoadingPartners ? (
              <div className="loading-partners">Chargement des partenaires...</div>
            ) : (
              partners.map((partner) => (
                <div key={partner._id} className="partner-card">
                  <a href={partner.website} target="_blank" rel="noopener noreferrer">
                    <div className="partner-logo">
                      <img src={partner.logo} alt={partner.name} />
                    </div>
                    <div className="partner-info">
                      <h3>{partner.name}</h3>
                      <p>{partner.description}</p>
                    </div>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="locations-section" id="locations">
        <div className="container">
          <div className="section-header">
            <h2>Nos Bureaux en Tunisie</h2>
            <p>Nous sommes présents dans les principales régions pour mieux vous servir</p>
          </div>
          
          <div className="locations-grid">
            {isLoadingLocations ? (
              <div className="loading-locations">Chargement des bureaux...</div>
            ) : (
              locations.map((location) => (
                <div key={location._id} className={`location-card ${location.isPrimary ? 'primary' : ''}`}>
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
          
          <div className="contact-highlight">
            <h3>Contact Principal</h3>
            <div className="primary-contact">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>sastraenergy@yahoo.com</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+216 36 437 473 / +216 93 454 400</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-highlight">
        <div className="container">
          <div className="services-content">
            <h2>Services Complémentaires</h2>
            <div className="services-list">
              <div className="service-item">
                <div className="service-icon">🔧</div>
                <div>
                  <h4>Maintenance & Réparation</h4>
                  <p>Services après-vente et maintenance préventive pour assurer la performance optimale de vos installations.</p>
                </div>
              </div>
              
              <div className="service-item">
                <div className="service-icon">📊</div>
                <div>
                  <h4>Études Personnalisées</h4>
                  <p>Analyse approfondie de vos besoins énergétiques et conception de solutions sur mesure.</p>
                </div>
              </div>
              
              <div className="service-item">
                <div className="service-icon">🎓</div>
                <div>
                  <h4>Formation & Conseil</h4>
                  <p>Accompagnement et formation pour optimiser l'utilisation de vos équipements solaires.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
