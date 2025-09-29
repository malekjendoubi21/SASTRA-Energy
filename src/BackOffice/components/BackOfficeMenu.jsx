import React, { useState } from 'react';
import './BackOfficeMenu.css';

const BackOfficeMenu = ({ onNavigate, onLogout, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'region', label: 'Région', icon: '🗺️' },
    { key: 'contacts', label: 'Contacts & Types', icon: '📞' },
    { key: 'locations', label: 'Bureaux & Partenaires', icon: '🏢' },
    { key: 'usermanagements', label: 'Gestion Utilisateurs', icon: '👥' },
    { key: 'profileadmin', label: 'Profil Admin', icon: '👤' },
  ];

  const frontOfficeItems = [
    { key: 'home', label: 'Retour au site', icon: '🏠' }
  ];

  const handleNavigation = (page) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout();
  };

  return (
    <div className="backoffice-menu">
      <div className="menu-header">
        <h2>BackOffice</h2>
        <p>Administration</p>
      </div>

      <nav className="menu-navigation">
        {menuItems.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${currentPage === item.key ? 'active' : ''}`}
            onClick={() => handleNavigation(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <nav className="menu-navigation front-office-section">
        <div className="menu-section-title">Site Web</div>
        {frontOfficeItems.map((item) => (
          <button
            key={item.key}
            className="menu-item front-office-item"
            onClick={() => handleNavigation(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="menu-footer">
        <button
          className="menu-item logout-btn"
          onClick={handleLogout}
        >
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Déconnexion</span>
        </button>
      </div>

      <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="menu-text">Menu</span>
      </div>
    </div>
  );
};

export default BackOfficeMenu;