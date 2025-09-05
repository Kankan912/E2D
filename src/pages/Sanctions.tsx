import React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Search, AlertTriangle, Calendar, DollarSign, Ban, CheckCircle, Clock, Filter, Eye, Edit, Trash2 } from 'lucide-react'
import { sanctions, membres, typesSanctions } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'
import { AddSanctionModal } from '../components/Sanctions/AddSanctionModal'
import { EditSanctionModal } from '../components/Sanctions/EditSanctionModal'

interface Sanction {
  id: string
  membre_id: string
  type_sanction_id: string
  montant: number
  motif: string | null
  date_sanction: string
  statut: 'impayee' | 'payee' | 'annulee'
  date_paiement: string | null
  automatique: boolean
  saisi_par: string | null
  created_at: string
  membre?: {
    nom: string
    prenom: string
    photo_url: string | null
  }
  type_sanction?: {
    nom: string
    categorie: 'reunion' | 'sport_e2d' | 'sport_phoenix' | 'disciplinaire'
    description: string
  }
}

interface TypeSanction {
  id: string
  nom: string
  categorie: 'reunion' | 'sport_e2d' | 'sport_phoenix' | 'disciplinaire'
  montant_defaut: number
  description: string
  actif: boolean
}

export function Sanctions() {
  const [sanctionsData, setSanctionsData] = useState<Sanction[]>([])
  const [membresData, setMembresData] = useState<any[]>([])
  const [typesSanctionsData, setTypesSanctionsData] = useState<TypeSanction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'impayee' | 'payee' | 'annulee'>('tous')
  const [categorieFilter, setCategorieFilter] = useState<'tous' | 'reunion' | 'sport_e2d' | 'sport_phoenix' | 'disciplinaire'>('tous')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSanction, setSelectedSanction] = useState<Sanction | null>(null)

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

      // Charger les types de sanctions
      const { data: typesResult, error: typesError } = await typesSanctions.getAll()
      if (typesError) throw typesError
      setTypesSanctionsData(typesResult || [])

      // Charger les sanctions
      const { data: sanctionsResult, error: sanctionsError } = await sanctions.getAll()
      if (sanctionsError) throw sanctionsError
      setSanctionsData(sanctionsResult || [])
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    const styles = {
      impayee: 'bg-red-100 text-red-800',
      payee: 'bg-green-100 text-green-800',
      annulee: 'bg-gray-100 text-gray-800'
    }
    const labels = {
      impayee: 'Impayée',
      payee: 'Payée',
      annulee: 'Annulée'
    }
    return { 
      style: styles[statut as keyof typeof styles] || styles.impayee, 
      label: labels[statut as keyof typeof labels] || statut 
    }
  }

  const getCategorieBadge = (categorie: string) => {
    const styles = {
      reunion: 'bg-blue-100 text-blue-800',
      sport_e2d: 'bg-green-100 text-green-800',
      sport_phoenix: 'bg-purple-100 text-purple-800',
      disciplinaire: 'bg-red-100 text-red-800'
    }
    const labels = {
      reunion: 'Réunion',
      sport_e2d: 'Sport E2D',
      sport_phoenix: 'Sport Phoenix',
      disciplinaire: 'Disciplinaire'
    }
    return { 
      style: styles[categorie as keyof typeof styles] || styles.reunion, 
      label: labels[categorie as keyof typeof labels] || categorie 
    }
  }

  const handleMarquerPayee = async (sanctionId: string) => {
    try {
      const { error } = await sanctions.update(sanctionId, { 
        statut: 'payee',
        date_paiement: new Date().toISOString().split('T')[0]
      })
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
    }
  }

  const handleAnnuler = async (sanctionId: string) => {
    try {
      const { error } = await sanctions.update(sanctionId, { 
        statut: 'annulee'
      })
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error)
    }
  }

  const filteredSanctions = sanctionsData.filter(sanction => {
    const matchesSearch = sanction.membre ? 
      sanction.membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sanction.membre.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    const matchesStatus = statusFilter === 'tous' || sanction.statut === statusFilter
    const matchesCategorie = categorieFilter === 'tous' || sanction.type_sanction?.categorie === categorieFilter
    
    return matchesSearch && matchesStatus && matchesCategorie
  })

  const stats = {
    total: sanctionsData.length,
    impayees: sanctionsData.filter(s => s.statut === 'impayee').length,
    payees: sanctionsData.filter(s => s.statut === 'payee').length,
    annulees: sanctionsData.filter(s => s.statut === 'annulee').length,
    montantTotal: sanctionsData.filter(s => s.statut === 'impayee').reduce((sum, s) => sum + s.montant, 0),
    automatiques: sanctionsData.filter(s => s.automatique).length
  }

  // Calculer les membres avec sanctions cumulées (pour suspension)
  const membresAvecSanctions = membresData.map(membre => {
    const sanctionsImpayees = sanctionsData.filter(s => 
      s.membre_id === membre.id && s.statut === 'impayee'
    ).length
    return { ...membre, sanctionsImpayees }
  }).filter(m => m.sanctionsImpayees > 0)

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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Sanctions</h1>
          <p className="text-gray-600 mt-1">
            {stats.total} sanction{stats.total > 1 ? 's' : ''} • {stats.impayees} impayée{stats.impayees > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle sanction</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.impayees}</div>
          <div className="text-sm text-gray-600">Sanctions impayées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.payees}</div>
          <div className="text-sm text-gray-600">Sanctions payées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.annulees}</div>
          <div className="text-sm text-gray-600">Sanctions annulées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.automatiques}</div>
          <div className="text-sm text-gray-600">Sanctions automatiques</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(stats.montantTotal)}
          </div>
          <div className="text-sm text-gray-600">Montant à recouvrer</div>
        </div>
      </div>

      {/* Alertes de suspension */}
      {membresAvecSanctions.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Membres avec sanctions cumulées
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {membresAvecSanctions.map(membre => (
                  <div key={membre.id} className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-900">
                      {membre.prenom} {membre.nom}
                    </div>
                    <div className="text-sm text-red-600">
                      {membre.sanctionsImpayees} sanction{membre.sanctionsImpayees > 1 ? 's' : ''} impayée{membre.sanctionsImpayees > 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="impayee">Impayées</option>
              <option value="payee">Payées</option>
              <option value="annulee">Annulées</option>
            </select>
          </div>

          <div>
            <label className="form-label">Catégorie</label>
            <select
              className="form-input"
              value={categorieFilter}
              onChange={(e) => setCategorieFilter(e.target.value as any)}
            >
              <option value="tous">Toutes les catégories</option>
              <option value="reunion">Réunion</option>
              <option value="sport_e2d">Sport E2D</option>
              <option value="sport_phoenix">Sport Phoenix</option>
              <option value="disciplinaire">Disciplinaire</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={loadData}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>
      </div>

      {/* Liste des sanctions */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Membre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de sanction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSanctions.map((sanction) => {
                const statutBadge = getStatutBadge(sanction.statut)
                const categorieBadge = getCategorieBadge(sanction.type_sanction?.categorie || 'reunion')
                
                return (
                  <tr key={sanction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {sanction.membre?.photo_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={sanction.membre.photo_url}
                              alt={`${sanction.membre.prenom} ${sanction.membre.nom}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {sanction.membre?.prenom?.[0]}{sanction.membre?.nom?.[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {sanction.membre?.prenom} {sanction.membre?.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sanction.type_sanction?.nom}
                      </div>
                      {sanction.motif && (
                        <div className="text-sm text-gray-500">
                          {sanction.motif}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categorieBadge.style}`}>
                        {categorieBadge.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(sanction.montant)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(sanction.date_sanction)}
                      </div>
                      {sanction.date_paiement && (
                        <div className="text-sm text-gray-500">
                          Payée le {formatDate(sanction.date_paiement)}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statutBadge.style}`}>
                        {statutBadge.label}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {sanction.automatique ? (
                          <span className="text-xs text-blue-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Auto
                          </span>
                        ) : (
                          <span className="text-xs text-gray-600">
                            Manuelle
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {sanction.statut === 'impayee' && (
                          <>
                            <button
                              onClick={() => handleMarquerPayee(sanction.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Marquer comme payée"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleAnnuler(sanction.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Annuler la sanction"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => {
                            setSelectedSanction(sanction)
                            setShowEditModal(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
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
          
          {filteredSanctions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {searchTerm || statusFilter !== 'tous' || categorieFilter !== 'tous'
                  ? 'Aucune sanction ne correspond aux critères'
                  : 'Aucune sanction enregistrée'
                }
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Résumé par catégorie */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Résumé par catégorie
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['reunion', 'sport_e2d', 'sport_phoenix', 'disciplinaire'].map(categorie => {
            const sanctionsCategorie = sanctionsData.filter(s => s.type_sanction?.categorie === categorie)
            const impayees = sanctionsCategorie.filter(s => s.statut === 'impayee').length
            const montant = sanctionsCategorie.filter(s => s.statut === 'impayee').reduce((sum, s) => sum + s.montant, 0)
            const badge = getCategorieBadge(categorie)
            
            return (
              <div key={categorie} className="text-center">
                <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${badge.style} mb-2`}>
                  {badge.label}
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {impayees}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(montant)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      <AddSanctionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
        membres={membresData}
        typesSanctions={typesSanctionsData}
      />

      <EditSanctionModal
        isOpen={showEditModal}
        sanction={selectedSanction}
        onClose={() => {
          setShowEditModal(false)
          setSelectedSanction(null)
        }}
        onSuccess={loadData}
        membres={membresData}
        typesSanctions={typesSanctionsData}
      />
    </div>
  )
}