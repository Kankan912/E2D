import React from 'react'
import { useState } from 'react'
import { Menu, X, User, LogOut, Bell, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  user?: {
    nom: string
    prenom: string
    roles: string[]
  }
  onLogout: () => void
}

export function Header({ user, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/app/dashboard', label: 'Tableau de bord' },
    { path: '/app/membres', label: 'Membres' },
    { path: '/app/cotisations', label: 'Cotisations' },
    { path: '/app/prets', label: 'Prêts' },
    { path: '/app/sanctions', label: 'Sanctions' },
    { path: '/app/aides', label: 'Aides' },
    { path: '/app/sport', label: 'Sport' },
    { path: '/app/rapports', label: 'Rapports' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E2D</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-gray-900">
                  Association E2D
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* Notifications */}
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {user.prenom} {user.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.roles.join(', ')}
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom} {user.nom}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.roles.join(', ')}
                        </div>
                      </div>
                      
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center">
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                      </button>
                      
                      <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}