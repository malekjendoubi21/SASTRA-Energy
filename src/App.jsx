import React, { useState, useEffect } from 'react'
import Navbar from './FrontOffice/components/Navbar'
import Footer from './FrontOffice/components/Footer'
import Home from './FrontOffice/home/home'
import About from './FrontOffice/about/About'
import Contact from './FrontOffice/contact/Contact'
import References from './FrontOffice/references/References'
import Login from './auth/Login'
import Profile from './FrontOffice/profile/Profile'
import './App.css'
import Dashboard from './BackOffice/dashboard/Dashboard'
import ContactManagement from './BackOffice/contacts/Contact'
import LocationsManagement from './BackOffice/location/Locations'
import ProfileAdmin from './BackOffice/profileAdmin/ProfileAdmin'
import UsersManagement from './BackOffice/usersManagement/UsersManagement'
import Region from './BackOffice/region/Region'


function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const typeUser = localStorage.getItem('typeUser')
    
    // Vérifier le hash de l'URL au chargement
    const hash = window.location.hash.replace('#', '') || 'home'
    const validFrontPages = ['home', 'about', 'references', 'contact', 'login', 'profile']
    const isBackOfficePage = ['dashboard', 'contacts', 'locations', 'profileadmin', 'usermanagements', 'region'].includes(hash)
    
    if (token) {
      setIsAuthenticated(true)
      setUserType(typeUser)
      console.log('App loaded - Token:', token, 'UserType:', typeUser)
      
      // Utilisateur authentifié - vérifier les permissions pour les pages backoffice
      if (isBackOfficePage && typeUser === 'admin') {
        setCurrentPage(hash)
      } else if (hash === 'profile' || validFrontPages.includes(hash)) {
        setCurrentPage(hash)
      } else {
        // Page invalide ou non autorisée, aller à home
        setCurrentPage('home')
        window.location.hash = 'home'
      }
    } else {
      // Utilisateur non authentifié - seulement les pages publiques
      if (validFrontPages.includes(hash) && hash !== 'profile') {
        setCurrentPage(hash)
      } else {
        // Page qui nécessite une authentification ou invalide
        setCurrentPage('home')
        window.location.hash = 'home'
      }
    }
    
    setIsLoading(false)
  }, [])

  // Simple navigation handler
  const handleNavigation = (page) => {
    setCurrentPage(page)
    // Mettre à jour l'URL hash pour la persistance lors du refresh
    window.location.hash = page
  }

  const handleLoginSuccess = (typeUser) => {
    setIsAuthenticated(true)
    setUserType(typeUser)
    console.log('Login success - UserType:', typeUser)
    if (typeUser === 'admin') {
      setCurrentPage('dashboard')
      window.location.hash = 'dashboard'
    } else {
      setCurrentPage('profile')
      window.location.hash = 'profile'
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserType(null)
    localStorage.removeItem('token')
    localStorage.removeItem('typeUser')
    setCurrentPage('home')
    window.location.hash = 'home'

  }

  // Render the current page
  const renderFrontOfficePage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} isAuthenticated={isAuthenticated} />
      case 'about':
        return <About />
      case 'references':
        return <References onNavigate={handleNavigation} />
      case 'contact':
        return <Contact />
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />
      case 'profile':
        return <Profile onLogout={handleLogout} />
      default:
        return <Home onNavigate={handleNavigation} />
    }
  }

  const renderBackOfficePage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
      case 'contacts':
        return <ContactManagement onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
      case 'locations':
        return <LocationsManagement onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
      case 'profileadmin':
        return <ProfileAdmin onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
      case 'usermanagements':
        return <UsersManagement onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
        case 'region':
        return <Region onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
      default:
        return <Dashboard onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
    }
  }

  const renderCurrentPage = () => {
    const isBackOffice = ['dashboard', 'contacts', 'locations', 'profileadmin', 'usermanagements', 'region'].includes(currentPage);
    return isBackOffice ? renderBackOfficePage() : renderFrontOfficePage();
  }

  // Vérifier si on est dans le backoffice
  const isBackOffice = ['dashboard', 'contacts', 'locations', 'profileadmin', 'usermanagements', 'region'].includes(currentPage);

  if (isLoading) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'var(--light-gray)'
        }}>
          <div>Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {!isBackOffice && (
        <Navbar 
          onNavigate={handleNavigation} 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
          userTypeUser={userType}
        />
      )}
      <main>
        {renderCurrentPage()}
      </main>
      {!isBackOffice && <Footer />}
    </div>
  )
}

export default App
