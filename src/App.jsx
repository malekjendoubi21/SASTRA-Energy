import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './home/home'
import About from './about/About'
import Contact from './contact/Contact'
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
        return <Home />
      case 'about':
        return <About />
      case 'contact':
        return <Contact />
      default:
        return <Home />
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
