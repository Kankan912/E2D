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
      {/* En-tête */}
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in animate-enter-delayed">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animate-enter-delayed">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in animate-enter-delayed">
        {/* Résumé financier */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Situation financière
            </h3>
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Fonds de caisse</span>
              <span className="font-bold text-lg text-gray-900">
                {stats.fondsCaisse.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Épargnes totales</span>
              <span className="font-bold text-lg text-gray-900">1 850 000 FCFA</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Prêts en cours</span>
              <span className="font-bold text-lg text-gray-900">450 000 FCFA</span>
            </div>
            <div className="divider"></div>
            <div className="flex justify-between items-center p-4 bg-success-50 rounded-lg border border-success-200">
              <span className="font-semibold text-success-800">Total disponible</span>
              <span className="font-bold text-xl text-success-700">4 750 000 FCFA</span>
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Activités récentes
            </h3>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Cotisation payée</p>
                <p className="text-xs text-gray-600">Jean Kouassi - il y a 2h</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-danger-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sanction appliquée</p>
                <p className="text-xs text-gray-600">Marie Diallo - retard réunion</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau membre</p>
                <p className="text-xs text-gray-600">Paul Traoré - Sport Phoenix</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Prêt accordé</p>
                <p className="text-xs text-gray-600">Fatou Sow - 100 000 FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card animate-fade-in animate-enter-delayed">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary p-4 text-center flex-col h-auto">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Ajouter membre</span>
          </button>
          <button className="btn-secondary p-4 text-center flex-col h-auto">
            <DollarSign className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Saisir cotisation</span>
          </button>
          <button className="btn-secondary p-4 text-center flex-col h-auto">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Planifier réunion</span>
          </button>
          <button className="btn-secondary p-4 text-center flex-col h-auto">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-medium">Gérer sanctions</span>
          </button>
        </div>
      </div>
    </div>
  )
}