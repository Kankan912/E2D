import React from 'react'
import { Users, DollarSign, Calendar, AlertTriangle, TrendingUp, CreditCard, Heart, Trophy } from 'lucide-react'
import { DashboardCard } from '../components/Dashboard/DashboardCard'

export function Dashboard() {
  // Ces données seraient récupérées depuis l'API
  const stats = {
    totalMembres: 45,
    membresActifs: 42,
    cotisationsEnCours: 38,
    sanctionsImpayees: 7,
    prochainReunion: '15 Janvier 2025',
    fondsCaisse: 2450000,
    pretsEnCours: 8,
    aidesAccordees: 12
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec animation */}
      <div className="text-center animate-slide-down">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-lg text-gray-600">
          Vue d'ensemble de l'Association E2D
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <DashboardCard
          title="Membres actifs"
          value={`${stats.membresActifs}/${stats.totalMembres}`}
          icon={Users}
          description="Membres participant aux cotisations"
          trend={{ value: 5, isPositive: true }}
          color="primary"
        />
        
        <DashboardCard
          title="Cotisations à jour"
          value={stats.cotisationsEnCours}
          icon={DollarSign}
          description="Membres ayant payé ce mois"
          trend={{ value: 2, isPositive: false }}
          color="success"
        />
        
        <DashboardCard
          title="Prochaine réunion"
          value={stats.prochainReunion}
          icon={Calendar}
          description="Chez Marie Dupont"
          color="secondary"
        />
        
        <DashboardCard
          title="Sanctions impayées"
          value={stats.sanctionsImpayees}
          icon={AlertTriangle}
          description="Nécessitent un suivi"
          trend={{ value: 15, isPositive: true }}
          color="warning"
        />
      </div>

      {/* Statistiques secondaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up animate-enter-delayed">
        <DashboardCard
          title="Prêts en cours"
          value={stats.pretsEnCours}
          icon={CreditCard}
          description="Prêts actifs à 5%"
          color="secondary"
        />
        
        <DashboardCard
          title="Aides accordées"
          value={stats.aidesAccordees}
          icon={Heart}
          description="Cette année"
          color="danger"
        />
        
        <DashboardCard
          title="Activités sportives"
          value="70"
          icon={Trophy}
          description="Participants total"
          color="warning"
        />
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        {/* Résumé financier */}
        <div className="card card-large">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Situation financière
            </h3>
            <div className="w-12 h-12 bg-success-100 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Fonds de caisse</span>
              <span className="font-bold text-lg text-gray-900">
                {stats.fondsCaisse.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Épargnes totales</span>
              <span className="font-bold text-lg text-gray-900">1 850 000 FCFA</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Prêts en cours</span>
              <span className="font-bold text-lg text-gray-900">450 000 FCFA</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200">
              <span className="font-semibold text-success-800">Total disponible</span>
              <span className="font-bold text-2xl text-success-700">4 750 000 FCFA</span>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="card card-large">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Activités récentes
            </h3>
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-3 h-3 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cotisation payée</p>
                <p className="text-xs text-gray-600">Jean Kouassi - il y a 2h</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-3 h-3 bg-danger-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sanction appliquée</p>
                <p className="text-xs text-gray-600">Marie Diallo - retard réunion</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-3 h-3 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau membre</p>
                <p className="text-xs text-gray-600">Paul Traoré - Sport Phoenix</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-3 h-3 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Prêt accordé</p>
                <p className="text-xs text-gray-600">Fatou Sow - 100 000 FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card card-large animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary p-6 text-center flex-col h-auto hover:scale-105 transition-transform">
            <Users className="w-8 h-8 mx-auto mb-3" />
            <span className="text-sm font-medium">Ajouter membre</span>
          </button>
          <button className="btn-secondary p-6 text-center flex-col h-auto hover:scale-105 transition-transform">
            <DollarSign className="w-8 h-8 mx-auto mb-3" />
            <span className="text-sm font-medium">Saisir cotisation</span>
          </button>
          <button className="btn-secondary p-6 text-center flex-col h-auto hover:scale-105 transition-transform">
            <Calendar className="w-8 h-8 mx-auto mb-3" />
            <span className="text-sm font-medium">Planifier réunion</span>
          </button>
          <button className="btn-secondary p-6 text-center flex-col h-auto hover:scale-105 transition-transform">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
            <span className="text-sm font-medium">Gérer sanctions</span>
          </button>
        </div>
      </div>
    </div>
  )
}