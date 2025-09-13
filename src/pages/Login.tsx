import React from 'react'
import { useState } from 'react'
import { Eye, EyeOff, LogIn, Shield, Users, TrendingUp } from 'lucide-react'

interface LoginProps {
  onLogin: (credentials: { email: string; password: string }) => void
  isLoading?: boolean
  error?: string
}

export function Login({ onLogin, isLoading, error }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Arrière-plan décoratif subtil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo et titre */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">E2D</span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Connectez-vous à votre espace
          </p>
          <p className="text-sm text-gray-500">
            Association E2D - Gestion moderne
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in animate-enter-delayed">
          <div className="text-center p-3 bg-white bg-opacity-80 rounded-xl border border-gray-200 shadow-sm">
            <Users className="w-5 h-5 text-primary-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">45</div>
            <div className="text-xs text-gray-600">Membres</div>
          </div>
          <div className="text-center p-3 bg-white bg-opacity-80 rounded-xl border border-gray-200 shadow-sm">
            <TrendingUp className="w-5 h-5 text-success-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">4.7M</div>
            <div className="text-xs text-gray-600">Patrimoine</div>
          </div>
          <div className="text-center p-3 bg-white bg-opacity-80 rounded-xl border border-gray-200 shadow-sm">
            <Shield className="w-5 h-5 text-warning-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">100%</div>
            <div className="text-xs text-gray-600">Sécurisé</div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in animate-enter-delayed">
        <div className="card shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="alert-danger animate-slide-down">
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="form-input pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="form-checkbox"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary btn-lg"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Se connecter
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Compte de démonstration
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="alert-info">
                <div className="text-sm">
                  <strong>Identifiants de test :</strong><br />
                  Email: <code className="bg-primary-100 px-1 rounded text-xs">admin@e2d.com</code><br />
                  Mot de passe: <code className="bg-primary-100 px-1 rounded text-xs">admin123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 Association E2D. Application sécurisée.
        </p>
      </div>
    </div>
  )
}