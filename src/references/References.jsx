import React, { useState } from 'react';
import './References.css';

const References = ({ onNavigate }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openFullscreen = () => {
    setIsFullscreen(true);
    // Empêcher le scroll du body quand le modal est ouvert
    document.body.style.overflow = 'hidden';
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    // Rétablir le scroll du body
    document.body.style.overflow = 'auto';
  };

  // Fermer avec la touche Escape
  React.useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isFullscreen) {
        closeFullscreen();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Nettoyer le style du body au démontage du composant
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);
  const completedProjects = [
    {
      client: "Rue des oranges - Tunis",
      address: "Tunis",
      power: "19.62 kWc",
      district: "Tunis Sud"
    },
    {
      client: "Rue Amical – Béja Sud",
      address: "Béja Sud",
      power: "20 kWc",
      district: "Béja"
    },
    {
      client: "Route de Tabarka - Kiosque",
      address: "Route de Tabarka",
      power: "16.35 kWc",
      district: "Béja"
    },
    {
      client: "Zone industrielle Teboursouk",
      address: "Teboursouk",
      power: "9.9 kWc",
      district: "Béja"
    },
    {
      client: "Labo. Avenue de la république",
      address: "Avenue de la république",
      power: "19.62 kWc",
      district: "Béja"
    },
    {
      client: "Tunis Nord",
      address: "Tunis Nord",
      power: "9.81 kWc",
      district: "Tunis Nord"
    },
    {
      client: "Route Manzel Bouzalfa, Beni Khalled",
      address: "Beni Khalled",
      power: "28.34 kWc",
      district: "Manzel Bouzalfa"
    },
    {
      client: "Société El Emtiez",
      address: "Jendouba",
      power: "81 kWc",
      district: "Jendouba"
    }
  ];

  const ongoingProjects = [
    {
      client: "Centre de collecte du lait Nord-Ouest",
      address: "Gaafour-Siliana",
      power: "40 kWc",
      district: "Gaafour-Siliana"
    },
    {
      client: "Société Arfaoui",
      address: "Jendouba",
      power: "15.4 kWc",
      district: "Jendouba"
    },
    {
      client: "Société El Kheirat (1)",
      address: "Beja",
      power: "21.8 kWc",
      district: "Beja"
    },
    {
      client: "Société El Kheirat (2)",
      address: "Beja",
      power: "20.16 kWc",
      district: "Beja"
    },
    {
      client: "Société Agrovaga",
      address: "Beja",
      power: "17.98 kWc",
      district: "Beja"
    },
    {
      client: "Société Anouar Express",
      address: "Ben Arous",
      power: "66.49 kWc",
      district: "Ben Arous"
    }
  ];

  const yearlyData = [
    { year: 2016, power: 50 },
    { year: 2017, power: 180 },
    { year: 2018, power: 500 },
    { year: 2019, power: 1250 },
    { year: 2020, power: 1500 },
    { year: 2021, power: 2150 },
    { year: 2022, power: 3200 },
    { year: 2023, power: 4000 }
  ];

  return (
    <div className="references" id="references">
      {/* Hero Section */}
      <section className="references-hero">
        <div className="container">
          <div className="references-hero-content">
              <br />
            <h1 className="references-title">Nos Références</h1>
            <p className="references-subtitle">
                        
              Découvrez nos réalisations et projets en cours depuis 2016
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Section */}
      <section className="evolution-section">
        <div className="container">
          <div className="section-header">
            <h2>Notre Croissance</h2>
            
            <p>
              La société Sastra Solar Energy est active depuis 2016. La puissance totale installée durant
              l'année 2023 s'élève à <strong>4 MWc</strong> comme présenté dans la figure ci-dessous.
            </p>
          </div>

          <div className="evolution-content-large">
            <div className="chart-container-large">
              <div className="chart-title">
                <h3>Figure 2 : Évolution de la puissance totale installée à Sastra entre 2016 et 2023</h3>
              </div>
              
              <div className="power-chart-large">
                <div className="chart-image-large" onClick={openFullscreen}>
                  <img 
                    src="/reference/evolution-chart-official.svg" 
                    alt="Figure 2: Évolution de la puissance installée 2016-2023"
                    className="chart-img-large"
                  />
                  <div className="fullscreen-icon" title="Voir en plein écran">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14H5V19H10V17H7V14Z" fill="currentColor"/>
                      <path d="M19 14V17H16V19H21V14H19Z" fill="currentColor"/>
                      <path d="M5 10H7V7H10V5H5V10Z" fill="currentColor"/>
                      <path d="M17 7H19V10H21V5H16V7H17Z" fill="currentColor"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
<br />
          <div className="stats-section">
            <div className="stats-summary">
              <div className="stat-card primary">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <h4>4 MWc</h4>
                  <p>Puissance totale installée en 2023</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-info">
                  <h4>8000%</h4>
                  <p>Croissance depuis 2016</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-info">
                  <h4>8 ans</h4>
                  <p>D'expérience continue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Completed Projects Section */}
      <section className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Projets Réalisés</h2>
            <p>
              Quelques références de Sastra dont la puissance est supérieure à 10 kWc. 
              Les détails complets sont disponibles en document ANNEXE.
            </p>
          </div>

          <div className="projects-table-container">
            <div className="table-header">
              <h3>Références de projets réalisés (puissance &gt; 10kWc)</h3>
            </div>
            
            <div className="projects-table">
              <div className="table-header-row">
                <div className="table-cell header">Client</div>
                <div className="table-cell header">Adresse</div>
                <div className="table-cell header">Puissance</div>
                <div className="table-cell header">District</div>
              </div>
              
              {completedProjects.map((project, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell" data-label="Client:">{project.client}</div>
                  <div className="table-cell" data-label="Adresse:">{project.address}</div>
                  <div className="table-cell power" data-label="Puissance:">{project.power}</div>
                  <div className="table-cell district" data-label="District:">{project.district}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ongoing Projects Section */}
      <section className="ongoing-projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Projets en Cours</h2>
            <p>
              Plusieurs projets sont en cours de réalisation. Le tableau ci-dessous résume quelques-uns 
              de nos projets en cours dont la puissance est supérieure à 10kWc.
            </p>
          </div>

          <div className="projects-table-container">
            <div className="table-header">
              <h3>Projets en cours de réalisation (puissance &gt; 10kWc)</h3>
            </div>
            
            <div className="projects-table ongoing">
              <div className="table-header-row">
                <div className="table-cell header">Client</div>
                <div className="table-cell header">Adresse</div>
                <div className="table-cell header">Puissance</div>
                <div className="table-cell header">District</div>
              </div>
              
              {ongoingProjects.map((project, index) => (
                <div key={index} className="table-row">
                  <div className="table-cell" data-label="Client:">{project.client}</div>
                  <div className="table-cell" data-label="Adresse:">{project.address}</div>
                  <div className="table-cell power" data-label="Puissance:">{project.power}</div>
                  <div className="table-cell district" data-label="District:">{project.district}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="references-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Rejoignez Nos Références</h2>
            <p>Faites confiance à notre expertise pour votre projet solaire</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => onNavigate && onNavigate('contact')}>
                Demander un Devis
              </button>
              <button className="btn-outline" onClick={() => onNavigate && onNavigate('home')}>
                Voir Plus de Projets
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Plein Écran */}
      {isFullscreen && (
        <div className="fullscreen-modal" onClick={closeFullscreen}>
          <div className="fullscreen-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-fullscreen-btn" onClick={closeFullscreen} title="Fermer (Échap)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="fullscreen-chart-title">
              <h3>Figure 2 : Évolution de la puissance totale installée à Sastra entre 2016 et 2023</h3>
            </div>
            <div className="fullscreen-chart-container">
              <img 
                src="/reference/evolution-chart-official.svg" 
                alt="Figure 2: Évolution de la puissance installée 2016-2023"
                className="fullscreen-chart-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default References;
