import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  Heart, 
  Trophy, 
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react'

export function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">E2D</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Application de Gestion
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Association E2D
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gestion complète des membres, cotisations, prêts, sanctions, aides sociales et activités sportives. 
              Une solution moderne et efficace pour votre association.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app/dashboard"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Accéder à l'application</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Voir la démonstration
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fonctionnalités principales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-lg text-gray-600">
            Tout ce dont vous avez besoin pour gérer efficacement votre association
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Gestion des Membres */}
          <Link to="/app/membres" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestion des Membres</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enregistrement complet, rôles, permissions, historique des statuts et connexions
              </p>
              <div className="flex items-center text-sm text-blue-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span>45 membres actifs</span>
              </div>
            </div>
          </Link>

          {/* Cotisations */}
          <Link to="/app/cotisations" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cotisations</h3>
              <p className="text-gray-600 text-sm mb-4">
                Cotisations variables, huile/savon obligatoires, fond sport, suivi des paiements
              </p>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>92% de recouvrement</span>
              </div>
            </div>
          </Link>

          {/* Prêts */}
          <Link to="/app/prets" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prêts</h3>
              <p className="text-gray-600 text-sm mb-4">
                Prêts à 5% d'intérêt, remboursement 2 mois, reconduction possible
              </p>
              <div className="flex items-center text-sm text-purple-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>8 prêts en cours</span>
              </div>
            </div>
          </Link>

          {/* Sanctions */}
          <Link to="/app/sanctions" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sanctions</h3>
              <p className="text-gray-600 text-sm mb-4">
                Sanctions réunion, sportives, disciplinaires. Suspension automatique
              </p>
              <div className="flex items-center text-sm text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span>7 sanctions impayées</span>
              </div>
            </div>
          </Link>

          {/* Aides Sociales */}
          <Link to="/app/aides" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aides Sociales</h3>
              <p className="text-gray-600 text-sm mb-4">
                Aide maladie, mariage, décès. Gestion des dettes de fond souverain
              </p>
              <div className="flex items-center text-sm text-pink-600">
                <Heart className="w-4 h-4 mr-1" />
                <span>12 aides accordées</span>
              </div>
            </div>
          </Link>

          {/* Sport */}
          <Link to="/app/sport" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activités Sportives</h3>
              <p className="text-gray-600 text-sm mb-4">
                Sport E2D (membres) et Phoenix (externes). Matchs, statistiques, gala
              </p>
              <div className="flex items-center text-sm text-orange-600">
                <Trophy className="w-4 h-4 mr-1" />
                <span>70 participants total</span>
              </div>
            </div>
          </Link>

          {/* Rapports */}
          <Link to="/app/rapports" className="group">
            <div className="card hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapports</h3>
              <p className="text-gray-600 text-sm mb-4">
                Rapports de séances, calendrier des réceptions, états financiers
              </p>
              <div className="flex items-center text-sm text-indigo-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>8 rapports cette année</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Statistiques de l'Association
            </h2>
            <p className="text-gray-300">
              Aperçu des activités et de la santé financière
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">45</div>
              <div className="text-gray-300">Membres Total</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">4.75M</div>
              <div className="text-gray-300">Patrimoine (FCFA)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">70</div>
              <div className="text-gray-300">Sportifs Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">27</div>
              <div className="text-gray-300">Matchs Joués</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Technologies Modernes
          </h2>
          <p className="text-lg text-gray-600">
            Application web responsive, sécurisée et performante
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">⚛️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">React + TypeScript</h3>
            <p className="text-gray-600">Interface moderne et réactive avec typage strict</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">🗄️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Supabase</h3>
            <p className="text-gray-600">Base de données PostgreSQL avec authentification intégrée</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">🎨</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
            <p className="text-gray-600">Design system cohérent et responsive</p>
          </div>
        </div>
      </div>

      {/* Fonctionnalités détaillées */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités Complètes
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gestion Financière */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                Gestion Financière
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Cotisations variables</div>
                    <div className="text-sm text-gray-600">Montants personnalisés par membre avec huile/savon obligatoires</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Prêts à 5% d'intérêt</div>
                    <div className="text-sm text-gray-600">Remboursement en 2 mois avec possibilité de reconduction</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Épargnes avec redistribution</div>
                    <div className="text-sm text-gray-600">Fonds de caisse et d'investissement avec intérêts</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Aides sociales</div>
                    <div className="text-sm text-gray-600">Maladie, mariage, décès avec remboursement collectif</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gestion Sportive */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-orange-600" />
                Activités Sportives
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Sport E2D</div>
                    <div className="text-sm text-gray-600">Réservé aux membres de l'association</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Sport Phoenix</div>
                    <div className="text-sm text-gray-600">Ouvert aux adhérents externes avec cotisations</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Statistiques complètes</div>
                    <div className="text-sm text-gray-600">Buts, cartons, présences, éligibilité au gala</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">Gestion des matchs</div>
                    <div className="text-sm text-gray-600">Calendrier, résultats, types de compétitions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à moderniser votre association ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Découvrez toutes les fonctionnalités en action
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <span>Tableau de bord</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-colors">
              Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E2D</span>
                </div>
                <span className="text-xl font-semibold">Association E2D</span>
              </div>
              <p className="text-gray-400">
                Application moderne de gestion d'association avec toutes les fonctionnalités essentielles.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Gestion des membres</li>
                <li>Cotisations et prêts</li>
                <li>Sanctions et aides</li>
                <li>Activités sportives</li>
                <li>Rapports et états</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation complète</li>
                <li>Formation utilisateurs</li>
                <li>Support technique</li>
                <li>Mises à jour régulières</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Association E2D. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}