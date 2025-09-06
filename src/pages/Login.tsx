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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo et titre */}
        <div className="text-center animate-slide-down">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl flex items-center justify-center shadow-large">
              <span className="text-white font-bold text-2xl">E2D</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenue
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Connectez-vous à votre espace
          </p>
          <p className="text-sm text-gray-500">
            Association E2D - Gestion moderne et efficace
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-8 grid grid-cols-3 gap-4 animate-slide-up">
          <div className="text-center p-3 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl border border-white border-opacity-20">
            <Users className="w-6 h-6 text-primary-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">45</div>
            <div className="text-xs text-gray-600">Membres</div>
          </div>
          <div className="text-center p-3 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl border border-white border-opacity-20">
            <TrendingUp className="w-6 h-6 text-success-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">4.7M</div>
            <div className="text-xs text-gray-600">Patrimoine</div>
          </div>
          <div className="text-center p-3 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl border border-white border-opacity-20">
            <Shield className="w-6 h-6 text-warning-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">100%</div>
            <div className="text-xs text-gray-600">Sécurisé</div>
          </div>
        </div>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up animate-enter-delayed">
        <div className="card card-large glass shadow-large">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="alert-danger animate-slide-down">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
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
                  className="form-input pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
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
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
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

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Première connexion ?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="alert-info">
                <div className="text-sm">
                  <strong>Compte de démonstration :</strong><br />
                  Email: <code className="bg-primary-100 px-1 rounded">admin@e2d.com</code><br />
                  Mot de passe: <code className="bg-primary-100 px-1 rounded">admin123</code>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Contactez l'administrateur pour obtenir vos identifiants personnels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-8 text-center">
        <p className="text-sm text-gray-500">
          © 2024 Association E2D. Application sécurisée et moderne.
        </p>
      </div>
    </div>
  )
}