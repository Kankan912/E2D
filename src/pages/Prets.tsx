import React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Search, DollarSign, Calendar, AlertTriangle, FileText, Download, Eye, Edit, CheckCircle, Clock, RefreshCw } from 'lucide-react'
import { prets, membres } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'
import { AddPretModal } from '../components/Prets/AddPretModal'
import { EditPretModal } from '../components/Prets/EditPretModal'
import { RemboursementModal } from '../components/Prets/RemboursementModal'

interface Pret {
  id: string
  emprunteur_id: string
  montant_principal: number
  taux_interet: number
  montant_interet: number
  date_pret: string
  date_echeance: string
  statut: 'en_cours' | 'rembourse' | 'reconduit' | 'en_retard'
  nombre_reconductions: number
  document_url: string | null
  accorde_par: string | null
  created_at: string
  emprunteur?: {
    nom: string
    prenom: string
    photo_url: string | null
  }
}

export function Prets() {
  const [pretsData, setPretsData] = useState<Pret[]>([])
  const [membresData, setMembresData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'en_cours' | 'rembourse' | 'reconduit' | 'en_retard'>('tous')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRemboursementModal, setShowRemboursementModal] = useState(false)
  const [selectedPret, setSelectedPret] = useState<Pret | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Charger les membres actifs
      const { data: membresResult, error: membresError } = await membres.getAll()
      if (membresError) throw membresError
      setMembresData(membresResult?.filter(m => m.statut === 'actif') || [])

      // Charger les prêts
      const { data: pretsResult, error: pretsError } = await prets.getAll()
      if (pretsError) throw pretsError
      setPretsData(pretsResult || [])
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    const styles = {
      en_cours: 'bg-blue-100 text-blue-800',
      rembourse: 'bg-green-100 text-green-800',
      reconduit: 'bg-yellow-100 text-yellow-800',
      en_retard: 'bg-red-100 text-red-800'
    }
    const labels = {
      en_cours: 'En cours',
      rembourse: 'Remboursé',
      reconduit: 'Reconduit',
      en_retard: 'En retard'
    }
    return { 
      style: styles[statut as keyof typeof styles] || styles.en_cours, 
      label: labels[statut as keyof typeof labels] || statut 
    }
  }

  const isEcheanceProche = (dateEcheance: string) => {
    const echeance = new Date(dateEcheance)
    const aujourd_hui = new Date()
    const diffJours = Math.ceil((echeance.getTime() - aujourd_hui.getTime()) / (1000 * 3600 * 24))
    return diffJours <= 7 && diffJours >= 0
  }

  const isEnRetard = (dateEcheance: string, statut: string) => {
    const echeance = new Date(dateEcheance)
    const aujourd_hui = new Date()
    return aujourd_hui > echeance && statut === 'en_cours'
  }

  const filteredPrets = pretsData.filter(pret => {
    const matchesSearch = pret.emprunteur ? 
      pret.emprunteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pret.emprunteur.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    const matchesStatus = statusFilter === 'tous' || pret.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: pretsData.length,
    enCours: pretsData.filter(p => p.statut === 'en_cours').length,
    rembourses: pretsData.filter(p => p.statut === 'rembourse').length,
    enRetard: pretsData.filter(p => isEnRetard(p.date_echeance, p.statut)).length,
    montantTotal: pretsData.filter(p => p.statut === 'en_cours').reduce((sum, p) => sum + p.montant_principal, 0),
    interetsTotal: pretsData.reduce((sum, p) => sum + p.montant_interet, 0)
  }

  const handleRembourser = async (pretId: string) => {
    try {
      const { error } = await prets.update(pretId, { 
        statut: 'rembourse',
        date_remboursement: new Date().toISOString().split('T')[0]
      })
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erreur lors du remboursement:', error)
    }
  }

  const handleReconduire = async (pretId: string) => {
    try {
      const pret = pretsData.find(p => p.id === pretId)
      if (!pret) return

      // Calculer nouvelle échéance (2 mois)
      const nouvelleEcheance = new Date()
      nouvelleEcheance.setMonth(nouvelleEcheance.getMonth() + 2)

      const { error } = await prets.update(pretId, { 
        statut: 'reconduit',
        date_echeance: nouvelleEcheance.toISOString().split('T')[0],
        nombre_reconductions: pret.nombre_reconductions + 1
      })
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erreur lors de la reconduction:', error)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Prêts</h1>
          <p className="text-gray-600 mt-1">
            {stats.total} prêt{stats.total > 1 ? 's' : ''} • Taux d'intérêt : 5% • Durée : 2 mois
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau prêt</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.enCours}</div>
          <div className="text-sm text-gray-600">Prêts en cours</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.rembourses}</div>
          <div className="text-sm text-gray-600">Prêts remboursés</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.enRetard}</div>
          <div className="text-sm text-gray-600">Prêts en retard</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(stats.montantTotal)}
          </div>
          <div className="text-sm text-gray-600">Capital en cours</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">Rechercher un emprunteur</label>
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
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_cours">En cours</option>
              <option value="rembourse">Remboursé</option>
              <option value="reconduit">Reconduit</option>
              <option value="en_retard">En retard</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadData}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des prêts */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emprunteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intérêts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reconductions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrets.map((pret) => {
                const badge = getStatutBadge(pret.statut)
                const echeanceProche = isEcheanceProche(pret.date_echeance)
                const enRetard = isEnRetard(pret.date_echeance, pret.statut)
                
                return (
                  <tr key={pret.id} className={`hover:bg-gray-50 ${enRetard ? 'bg-red-50' : echeanceProche ? 'bg-yellow-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {pret.emprunteur?.photo_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={pret.emprunteur.photo_url}
                              alt={`${pret.emprunteur.prenom} ${pret.emprunteur.nom}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {pret.emprunteur?.prenom?.[0]}{pret.emprunteur?.nom?.[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pret.emprunteur?.prenom} {pret.emprunteur?.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            Accordé le {formatDate(pret.date_pret)}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(pret.montant_principal)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Capital
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(pret.montant_interet)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pret.taux_interet}%
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(pret.date_echeance)}
                      </div>
                      {echeanceProche && !enRetard && (
                        <div className="text-xs text-yellow-600 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Échéance proche
                        </div>
                      )}
                      {enRetard && (
                        <div className="text-xs text-red-600 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          En retard
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900">
                        {pret.nombre_reconductions}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pret.document_url ? (
                        <button
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Voir le document"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          <span className="text-xs">Voir</span>
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">Aucun</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPret(pret)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {pret.statut === 'en_cours' && (
                          <>
                            <button
                              onClick={() => handleRembourser(pret.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Marquer comme remboursé"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleReconduire(pret.id)}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Reconduire le prêt"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {filteredPrets.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== 'tous' 
                  ? 'Aucun prêt ne correspond aux critères'
                  : 'Aucun prêt enregistré'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Résumé financier */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Résumé financier des prêts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.montantTotal)}
            </div>
            <div className="text-sm text-gray-600">Capital en circulation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.interetsTotal)}
            </div>
            <div className="text-sm text-gray-600">Intérêts générés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(stats.montantTotal + stats.interetsTotal)}
            </div>
            <div className="text-sm text-gray-600">Total à rembourser</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPretModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
        membres={membresData}
      />

      <EditPretModal
        isOpen={showEditModal}
        pret={selectedPret}
        onClose={() => {
          setShowEditModal(false)
          setSelectedPret(null)
        }}
        onSuccess={loadData}
        membres={membresData}
      />

      <RemboursementModal
        isOpen={showRemboursementModal}
        pret={selectedPret}
        onClose={() => {
          setShowRemboursementModal(false)
          setSelectedPret(null)
        }}
        onSuccess={loadData}
      />
    </div>
  )
}