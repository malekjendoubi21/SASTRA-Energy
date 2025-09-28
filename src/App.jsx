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


function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const typeUser = localStorage.getItem('typeUser')
    
    if (token) {
      setIsAuthenticated(true)
      setUserType(typeUser)
      console.log('App loaded - Token:', token, 'UserType:', typeUser)
      
      // Vérifier si on refresh sur une page backoffice
      const hash = window.location.hash.replace('#', '')
      const isBackOfficePage = ['dashboard', 'contacts', 'locations', 'profileadmin', 'usermanagements'].includes(hash)
      
      if (isBackOfficePage && typeUser === 'admin') {
        setCurrentPage(hash)
      } else if (hash && !isBackOfficePage) {
        // Si c'est une page frontoffice valide, aller dessus
        const validFrontPages = ['home', 'about', 'references', 'contact', 'login', 'profile']
        if (validFrontPages.includes(hash)) {
          setCurrentPage(hash)
        }
      }
      // Sinon garder 'home' par défaut
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
      default:
        return <Dashboard onNavigate={handleNavigation} onLogout={handleLogout} currentPage={currentPage} />
    }
  }

  const renderCurrentPage = () => {
    const isBackOffice = ['dashboard', 'contacts', 'locations', 'profileadmin', 'usermanagements'].includes(currentPage);
    return isBackOffice ? renderBackOfficePage() : renderFrontOfficePage();
  }

  // Vérifier si on est dans le backoffice
  const isBackOffice = ['dashboard', 'contacts', 'locations', 'profileadmin', 'usermanagements'].includes(currentPage);

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
