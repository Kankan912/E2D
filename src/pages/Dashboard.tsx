import React from 'react'
import { Users, DollarSign, Calendar, AlertTriangle } from 'lucide-react'
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
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Membres actifs"
          value={`${stats.membresActifs}/${stats.totalMembres}`}
          icon={Users}
          description="Membres participant aux cotisations"
          trend={{ value: 5, isPositive: true }}
        />
        
        <DashboardCard
          title="Cotisations à jour"
          value={stats.cotisationsEnCours}
          icon={DollarSign}
          description="Membres ayant payé ce mois"
          trend={{ value: -2, isPositive: false }}
        />
        
        <DashboardCard
          title="Prochaine réunion"
          value={stats.prochainReunion}
          icon={Calendar}
          description="Chez Marie Dupont"
        />
        
        <DashboardCard
          title="Sanctions impayées"
          value={stats.sanctionsImpayees}
          icon={AlertTriangle}
          description="Nécessitent un suivi"
          trend={{ value: -15, isPositive: true }}
        />
      </div>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Situation financière
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fonds de caisse</span>
              <span className="font-semibold">
                {stats.fondsCaisse.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Épargnes totales</span>
              <span className="font-semibold">1 850 000 FCFA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Prêts en cours</span>
              <span className="font-semibold">450 000 FCFA</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold text-gray-900">Total disponible</span>
              <span className="font-bold text-green-600">4 750 000 FCFA</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activités récentes
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Cotisation payée</p>
                <p className="text-xs text-gray-500">Jean Kouassi - il y a 2h</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Sanction appliquée</p>
                <p className="text-xs text-gray-500">Marie Diallo - retard réunion</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Nouveau membre</p>
                <p className="text-xs text-gray-500">Paul Traoré - Sport Phoenix</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">Prêt accordé</p>
                <p className="text-xs text-gray-500">Fatou Sow - 100 000 FCFA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Ajouter membre</span>
          </button>
          <button className="btn-secondary p-4 text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Saisir cotisation</span>
          </button>
          <button className="btn-secondary p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Planifier réunion</span>
          </button>
          <button className="btn-secondary p-4 text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm">Gérer sanctions</span>
          </button>
        </div>
      </div>
    </div>
  )
}