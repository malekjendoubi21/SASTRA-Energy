import React from 'react';
import './BackOfficeMenu.css';

const BackOfficeMenu = ({ onNavigate, onLogout, currentPage }) => {
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'contacts', label: 'Contacts & Types' },
    { key: 'locations', label: 'Bureaux & Partenaires' },
    { key: 'usermanagements', label: 'Gestion Utilisateurs' },
    { key: 'profileadmin', label: 'Profil Admin'}
  ];

  const frontOfficeItems = [
    { key: 'home', label: 'Retour au site' }
  ];

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
            onClick={() => onNavigate(item.key)}
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
            onClick={() => onNavigate(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="menu-footer">
        <button
          className="menu-item logout-btn"
          onClick={onLogout}
        >
          <span className="menu-icon">🚪</span>
          <span className="menu-label">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default BackOfficeMenu;