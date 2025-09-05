import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Index } from './pages/Index'
import { Membres } from './pages/Membres'
import { Cotisations } from './pages/Cotisations'
import { Prets } from './pages/Prets'
import { Sanctions } from './pages/Sanctions'
import { AidesSociales } from './pages/AidesSociales'
import { Sport } from './pages/Sport'
import { Rapports } from './pages/Rapports'

// Mock user pour le développement
const mockUser = {
  nom: 'Kouassi',
  prenom: 'Jean',
  roles: ['tresorier', 'membre']
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<typeof mockUser | null>(null)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true)
    setLoginError('')

    try {
      // Simulation d'une authentification
      // Dans la vraie application, ceci ferait appel à Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (credentials.email === 'admin@e2d.com' && credentials.password === 'admin123') {
        setUser(mockUser)
        setIsAuthenticated(true)
      } else {
        setLoginError('Email ou mot de passe incorrect')
      }
    } catch (error) {
      setLoginError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={handleLogin} 
        isLoading={isLoading}
        error={loginError}
      />
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/app/*" element={
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/membres" element={<Membres />} />
              <Route path="/cotisations" element={<Cotisations />} />
              <Route path="/prets" element={<Prets />} />
              <Route path="/sanctions" element={<Sanctions />} />
              <Route path="/aides" element={<AidesSociales />} />
              <Route path="/sport" element={<Sport />} />
              <Route path="/rapports" element={<Rapports />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}
export default App