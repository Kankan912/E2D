import React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Search, DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react'
import { cotisations, membres } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'

interface Cotisation {
  id: string
  membre_id: string
  mois: number
  annee: number
  montant_attendu: number
  montant_paye: number
  huile_paye: boolean
  savon_paye: boolean
  fond_sport_paye: boolean
  montant_fond_sport: number
  date_paiement: string | null
  saisi_par: string | null
  created_at: string
  membre?: {
    nom: string
    prenom: string
    photo_url: string | null
  }
}

const MOIS_NOMS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export function Cotisations() {
  const [cotisationsData, setCotisationsData] = useState<Cotisation[]>([])
  const [membresData, setMembresData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMois, setSelectedMois] = useState(new Date().getMonth() + 1)
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear())
  const [statusFilter, setStatusFilter] = useState<'tous' | 'paye' | 'partiel' | 'impaye'>('tous')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [selectedMois, selectedAnnee])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Charger les membres actifs
      const { data: membresResult, error: membresError } = await membres.getAll()
      if (membresError) throw membresError
      setMembresData(membresResult?.filter(m => m.statut === 'actif') || [])

      // Charger les cotisations pour le mois/année sélectionné
      const { data: cotisationsResult, error: cotisationsError } = await cotisations.getByPeriod(selectedMois, selectedAnnee)
      if (cotisationsError) throw cotisationsError
      setCotisationsData(cotisationsResult || [])
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatutCotisation = (cotisation: Cotisation) => {
    if (cotisation.montant_paye >= cotisation.montant_attendu && 
        cotisation.huile_paye && cotisation.savon_paye && cotisation.fond_sport_paye) {
      return 'paye'
    } else if (cotisation.montant_paye > 0 || cotisation.huile_paye || cotisation.savon_paye || cotisation.fond_sport_paye) {
      return 'partiel'
    }
    return 'impaye'
  }

  const getStatutBadge = (statut: string) => {
    const styles = {
      paye: 'bg-green-100 text-green-800',
      partiel: 'bg-yellow-100 text-yellow-800',
      impaye: 'bg-red-100 text-red-800'
    }
    const labels = {
      paye: 'Payé',
      partiel: 'Partiel',
      impaye: 'Impayé'
    }
    return { style: styles[statut as keyof typeof styles], label: labels[statut as keyof typeof labels] }
  }

  const filteredCotisations = cotisationsData.filter(cotisation => {
    const matchesSearch = cotisation.membre ? 
      cotisation.membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotisation.membre.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    const statut = getStatutCotisation(cotisation)
    const matchesStatus = statusFilter === 'tous' || statut === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: cotisationsData.length,
    payes: cotisationsData.filter(c => getStatutCotisation(c) === 'paye').length,
    partiels: cotisationsData.filter(c => getStatutCotisation(c) === 'partiel').length,
    impayes: cotisationsData.filter(c => getStatutCotisation(c) === 'impaye').length,
    montantTotal: cotisationsData.reduce((sum, c) => sum + c.montant_paye, 0),
    montantAttendu: cotisationsData.reduce((sum, c) => sum + c.montant_attendu, 0)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cotisations</h1>
          <p className="text-gray-600 mt-1">
            {MOIS_NOMS[selectedMois - 1]} {selectedAnnee} - {stats.total} cotisation{stats.total > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Saisir cotisation</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.payes}</div>
          <div className="text-sm text-gray-600">Cotisations payées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.partiels}</div>
          <div className="text-sm text-gray-600">Paiements partiels</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.impayes}</div>
          <div className="text-sm text-gray-600">Cotisations impayées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((stats.montantTotal / stats.montantAttendu) * 100) || 0}%
          </div>
          <div className="text-sm text-gray-600">Taux de recouvrement</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Rechercher un membre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Nom ou prénom..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Mois</label>
            <select
              className="form-input"
              value={selectedMois}
              onChange={(e) => setSelectedMois(parseInt(e.target.value))}
            >
              {MOIS_NOMS.map((mois, index) => (
                <option key={index} value={index + 1}>{mois}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">Année</label>
            <select
              className="form-input"
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="paye">Payé</option>
              <option value="partiel">Partiel</option>
              <option value="impaye">Impayé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des cotisations */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cotisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Huile/Savon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fond Sport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date paiement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCotisations.map((cotisation) => {
                const statut = getStatutCotisation(cotisation)
                const badge = getStatutBadge(statut)
                
                return (
                  <tr key={cotisation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {cotisation.membre?.photo_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={cotisation.membre.photo_url}
                              alt={`${cotisation.membre.prenom} ${cotisation.membre.nom}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {cotisation.membre?.prenom?.[0]}{cotisation.membre?.nom?.[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {cotisation.membre?.prenom} {cotisation.membre?.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(cotisation.montant_paye)} / {formatCurrency(cotisation.montant_attendu)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((cotisation.montant_paye / cotisation.montant_attendu) * 100)}% payé
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cotisation.huile_paye ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Huile
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cotisation.savon_paye ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Savon
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cotisation.fond_sport_paye ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {formatCurrency(cotisation.montant_fond_sport)}
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatCurrency(cotisation.montant_fond_sport)}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cotisation.date_paiement ? formatDate(cotisation.date_paiement) : 'Non payé'}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Modifier"
                      >
                        Modifier
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Marquer comme payé"
                      >
                        Payer
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {filteredCotisations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== 'tous' 
                  ? 'Aucune cotisation ne correspond aux critères'
                  : 'Aucune cotisation pour cette période'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Résumé financier */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Résumé financier - {MOIS_NOMS[selectedMois - 1]} {selectedAnnee}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.montantAttendu)}
            </div>
            <div className="text-sm text-gray-600">Montant attendu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.montantTotal)}
            </div>
            <div className="text-sm text-gray-600">Montant collecté</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.montantAttendu - stats.montantTotal)}
            </div>
            <div className="text-sm text-gray-600">Reste à collecter</div>
          </div>
        </div>
      </div>
    </div>
  )
}