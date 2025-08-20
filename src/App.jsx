import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './home/home'
import About from './about/About'
import Contact from './contact/Contact'
import References from './references/References'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Simple navigation handler
  const handleNavigation = (page) => {
    setCurrentPage(page)
  }

  // Render the current page
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigation} />
      case 'about':
        return <About />
      case 'references':
        return <References onNavigate={handleNavigation} />
      case 'contact':
        return <Contact />
      default:
        return <Home onNavigate={handleNavigation} />
    }
  }

  return (
    <div className="App">
      <Navbar onNavigate={handleNavigation} />
      <main>
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  )
}

export default App
