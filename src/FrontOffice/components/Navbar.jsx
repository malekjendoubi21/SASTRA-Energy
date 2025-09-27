import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';

const Navbar = ({ onNavigate, isAuthenticated, onLogout, userTypeUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await axios.get(`${API_URL}/auth/profile`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
          } catch (err) {
            console.error('Erreur lors du chargement du profil:', err);
          }
        }
      };
      fetchUser();
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleNavClick = (page, sectionId = null) => {
    setIsMenuOpen(false);
    setUserMenuOpen(false);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserMenuOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
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
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button className="nav-link user-btn" onClick={toggleUserMenu}>
                {user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
                <span className={`dropdown-arrow ${userMenuOpen ? 'open' : ''}`}>▼</span>
              </button>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <button onClick={() => handleNavClick('profile')}>Profile</button>
                  {userTypeUser === 'admin' && (
                    <button onClick={() => handleNavClick('dashboard')}>Administration</button>
                  )}
                  <button onClick={handleLogout}>Se déconnecter</button>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-link login-btn" onClick={() => handleNavClick('login')}>
              Se connecter / S'inscrire
            </button>
          )}
        </div>

        <div className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="menu-text">Sastra Energy</span>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;