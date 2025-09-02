import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (page, sectionId = null) => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
    
    // If it's a section within the current page, scroll to it
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => handleNavClick('home')}>
          <img 
            src="/logo.png"
            alt="Sastra Energy Logo" 
            className="logo-image"
          />
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <button className="nav-link" onClick={() => handleNavClick('home', 'home')}>
            Accueil
          </button>
          <button className="nav-link" onClick={() => handleNavClick('about', 'about')}>
            À Propos
          </button>
          <button className="nav-link" onClick={() => handleNavClick('references', 'references')}>
            Nos Références
          </button>
          <button className="nav-link" onClick={() => handleNavClick('home', 'services')}>
            Services
          </button>
          <button className="nav-link" onClick={() => handleNavClick('about', 'locations')}>
            Nos Bureaux
          </button>
          <button className="nav-link contact-btn" onClick={() => handleNavClick('contact', 'contact')}>
            Contact
          </button>
        </div>

        <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;