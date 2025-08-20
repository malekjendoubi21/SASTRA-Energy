import React, { useState, useEffect } from 'react';
import SastraLogo from '../components/SastraLogo';
import './Home.css';

const Home = () => {
  const [showPrompt, setShowPrompt] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Masquer le prompt après 8 secondes
    const timer = setTimeout(() => {
      handleClosePrompt();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClosePrompt = () => {
    setIsClosing(true);
    // Attendre la fin de l'animation avant de masquer complètement
    setTimeout(() => {
      setShowPrompt(false);
    }, 500);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero hexagon-bg" id="home">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                L'Énergie Solaire
                <span className="gradient-text"> Pour Votre Avenir</span>
              </h1>
              <p className="hero-description">
                Sastra Energy vous accompagne depuis 2016 dans vos projets d'énergie renouvelable. 
                Nos experts passionnés conçoivent des solutions photovoltaïques sur mesure pour 
                votre maison, entreprise ou industrie.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">9+</span>
                  <span className="stat-label">Années d'expérience</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4</span>
                  <span className="stat-label">Bureaux en Tunisie</span>
                </div>
                <div className="stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Solutions sur mesure</span>
                </div>
              </div>
              <div className="hero-buttons">
                <button className="btn-primary">Nos Solutions</button>
                <button className="btn-secondary">Contactez-nous</button>
              </div>
            </div>
            <div className="hero-image">
              <div className="solar-panel-animation">
                <div className="panel panel-1"></div>
                <div className="panel panel-2"></div>
                <div className="panel panel-3"></div>
                <div className="floating-logo">
                  <SastraLogo size={80} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Nos Solutions Énergétiques</h2>
            <p className="section-subtitle">
              Découvrez notre gamme complète de services photovoltaïques adaptés à tous vos besoins
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h3>Solaire PV Réseau BT</h3>
              <p>Installations photovoltaïques raccordées au réseau basse tension pour particuliers et petites entreprises.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🏭</div>
              <h3>Solaire PV Réseau MT</h3>
              <p>Solutions industrielles raccordées au réseau moyenne tension pour grandes entreprises et industries.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">💧</div>
              <h3>Pompage Solaire</h3>
              <p>Systèmes de pompage solaire pour l'irrigation agricole et l'approvisionnement en eau.</p>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🏝️</div>
              <h3>Sites Isolés</h3>
              <p>Solutions autonomes pour sites non raccordés au réseau électrique traditionnel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us hexagon-bg">
        <div className="why-choose-content">
          <div className="why-choose-text">
            <h2>Pourquoi Choisir Sastra Energy ?</h2>
            <div className="features-list">
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <h4>Expertise Reconnue</h4>
                  <p>Plus de 9 ans d'expérience dans le domaine photovoltaïque</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <h4>Équipe Passionnée</h4>
                  <p>Des experts dédiés aux énergies renouvelables</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <h4>Solutions Complètes</h4>
                  <p>De l'installation à la maintenance, nous vous accompagnons</p>
                </div>
              </div>
              
              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <h4>Respect de l'Environnement</h4>
                  <p>Engagement fort pour les solutions écologiques</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="why-choose-image">
            <div className="image-placeholder">
              <div className="eco-icon">🌱</div>
              <p>Solutions Écologiques</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prompt STEG Section */}
      {showPrompt && (
        <section className="steg-prompt-section">
          <div className="container">
            <div className={`steg-prompt ${isClosing ? 'closing' : ''}`}>
              <div className="prompt-content">
                <button className="prompt-close" onClick={handleClosePrompt}>
                  ×
                </button>
                <p>
                  <strong>Vous avez un problème avec votre facture STEG ?</strong><br/>
                  <span className="highlight">Vous rêvez d'une facture à 0 DT ?</span><br/>
                  Avec <strong>SASTRA Energy</strong>, ce rêve devient réalité.
                </p>
                <div className="flags">
                  <span>Grâce à la technologie allemande 🇩🇪 et à l'expertise tunisienne 🇹🇳</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à Passer à l'Énergie Solaire ?</h2>
          <p>Contactez nos experts pour une étude personnalisée de votre projet</p>
          <div className="cta-buttons">
            <button className="btn-primary">Demander un Devis</button>
            <button className="btn-outline">En Savoir Plus</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;