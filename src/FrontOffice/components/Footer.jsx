import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Sastra Energy</h3>
            <p className="footer-description">
              Experts en solutions photovoltaïques depuis 2016. 
              Nous offrons des solutions énergétiques renouvelables 
              de haute qualité pour tous vos besoins.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📧</a>
              <a href="#" className="social-link">📞</a>
              <a href="#" className="social-link">📍</a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Nos Services</h4>
            <ul className="footer-links">
              <li><a href="#services">Solaire PV Réseau BT</a></li>
              <li><a href="#services">Solaire PV Réseau MT</a></li>
              <li><a href="#services">Pompage Solaire</a></li>
              <li><a href="#services">Sites Isolés</a></li>
              <li><a href="#services">Maintenance & Réparation</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Nos Bureaux</h4>
            <ul className="footer-links">
              <li><a href="#locations">Le Bardo</a></li>
              <li><a href="#locations">Béja</a></li>
              <li><a href="#locations">Hammamet</a></li>
              <li><a href="#locations">Sousse</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact Principal</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>Résidence MAAROUFI, AV Habib Bourguiba, Bardo 2000</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+216 36 437 473 / +216 93 454 400</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>sastraenergy@yahoo.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Sastra Energy. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Politique de confidentialité</a>
              <a href="#terms">Conditions d'utilisation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
