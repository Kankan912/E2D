import React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Search, Heart, FileText, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, Eye, Edit, Download } from 'lucide-react'
import { aidesSociales, membres, typesAides, dettesFondSouverain } from '../lib/supabase'
import { formatCurrency, formatDate } from '../lib/utils'
import { AddAideModal } from '../components/AidesSociales/AddAideModal'
import { EditAideModal } from '../components/AidesSociales/EditAideModal'

interface AideSociale {
  id: string
  beneficiaire_id: string
  type_aide_id: string
  montant: number
  date_aide: string
  date_limite_remboursement: string | null
  motif: string | null
  justificatif_url: string | null
  statut: 'accordee' | 'remboursee'
  accorde_par: string | null
  created_at: string
  beneficiaire?: {
    nom: string
    prenom: string
    photo_url: string | null
  }
  type_aide?: {
    nom: string
    montant_defaut: number
    delai_remboursement_mois: number
    description: string
  }
}

interface TypeAide {
  id: string
  nom: string
  montant_defaut: number
  delai_remboursement_mois: number
  description: string
  actif: boolean
}

interface DetteFondSouverain {
  id: string
  membre_id: string
  aide_sociale_id: string
  montant_dette: number
  montant_paye: number
  montant_restant: number
  date_echeance: string
  statut: 'en_cours' | 'soldee' | 'en_retard'
  membre?: {
    nom: string
    prenom: string
  }
}

export function AidesSociales() {
  const [aidesData, setAidesData] = useState<AideSociale[]>([])
  const [membresData, setMembresData] = useState<any[]>([])
  const [typesAidesData, setTypesAidesData] = useState<TypeAide[]>([])
  const [dettesData, setDettesData] = useState<DetteFondSouverain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'accordee' | 'remboursee'>('tous')
  const [typeFilter, setTypeFilter] = useState<'tous' | string>('tous')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAide, setSelectedAide] = useState<AideSociale | null>(null)
  const [activeTab, setActiveTab] = useState<'aides' | 'dettes'>('aides')

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

      // Charger les types d'aides
      const { data: typesResult, error: typesError } = await typesAides.getAll()
      if (typesError) throw typesError
      setTypesAidesData(typesResult || [])

      // Charger les aides sociales
      const { data: aidesResult, error: aidesError } = await aidesSociales.getAll()
      if (aidesError) throw aidesError
      setAidesData(aidesResult || [])

      // Charger les dettes de fond souverain
      const { data: dettesResult, error: dettesError } = await dettesFondSouverain.getAll()
      if (dettesError) throw dettesError
      setDettesData(dettesResult || [])
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    const styles = {
      accordee: 'bg-blue-100 text-blue-800',
      remboursee: 'bg-green-100 text-green-800'
    }
    const labels = {
      accordee: 'Accordée',
      remboursee: 'Remboursée'
    }
    return { 
      style: styles[statut as keyof typeof styles] || styles.accordee, 
      label: labels[statut as keyof typeof labels] || statut 
    }
  }

  const getStatutDetteBadge = (statut: string) => {
    const styles = {
      en_cours: 'bg-yellow-100 text-yellow-800',
      soldee: 'bg-green-100 text-green-800',
      en_retard: 'bg-red-100 text-red-800'
    }
    const labels = {
      en_cours: 'En cours',
      soldee: 'Soldée',
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
    return diffJours <= 30 && diffJours >= 0
  }

  const isEnRetard = (dateEcheance: string, statut: string) => {
    const echeance = new Date(dateEcheance)
    const aujourd_hui = new Date()
    return aujourd_hui > echeance && statut === 'en_cours'
  }

  const handleMarquerRemboursee = async (aideId: string) => {
    try {
      const { error } = await aidesSociales.update(aideId, { 
        statut: 'remboursee'
      })
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Erreur lors du remboursement:', error)
    }
  }

  const filteredAides = aidesData.filter(aide => {
    const matchesSearch = aide.beneficiaire ? 
      aide.beneficiaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aide.beneficiaire.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    const matchesStatus = statusFilter === 'tous' || aide.statut === statusFilter
    const matchesType = typeFilter === 'tous' || aide.type_aide_id === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const filteredDettes = dettesData.filter(dette => {
    const matchesSearch = dette.membre ? 
      dette.membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dette.membre.prenom.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    
    return matchesSearch
  })

  const stats = {
    total: aidesData.length,
    accordees: aidesData.filter(a => a.statut === 'accordee').length,
    remboursees: aidesData.filter(a => a.statut === 'remboursee').length,
    montantTotal: aidesData.reduce((sum, a) => sum + a.montant, 0),
    montantAccorde: aidesData.filter(a => a.statut === 'accordee').reduce((sum, a) => sum + a.montant, 0),
    dettesEnCours: dettesData.filter(d => d.statut === 'en_cours').length,
    montantDettes: dettesData.filter(d => d.statut === 'en_cours').reduce((sum, d) => sum + d.montant_restant, 0)
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
          <h1 className="text-3xl font-bold text-gray-900">Aides Sociales</h1>
          <p className="text-gray-600 mt-1">
            {stats.total} aide{stats.total > 1 ? 's' : ''} • {stats.accordees} en cours • {stats.dettesEnCours} dette{stats.dettesEnCours > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle aide</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.accordees}</div>
          <div className="text-sm text-gray-600">Aides accordées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.remboursees}</div>
          <div className="text-sm text-gray-600">Aides remboursées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.dettesEnCours}</div>
          <div className="text-sm text-gray-600">Dettes en cours</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(stats.montantDettes)}
          </div>
          <div className="text-sm text-gray-600">Montant à recouvrer</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('aides')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'aides'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              Aides accordées ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('dettes')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dettes'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Dettes fond souverain ({stats.dettesEnCours})
            </button>
          </nav>
        </div>

        {/* Filtres */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Rechercher</label>
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
            
            {activeTab === 'aides' && (
              <>
                <div>
                  <label className="form-label">Statut</label>
                  <select
                    className="form-input"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <option value="tous">Tous les statuts</option>
                    <option value="accordee">Accordées</option>
                    <option value="remboursee">Remboursées</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Type d'aide</label>
                  <select
                    className="form-input"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="tous">Tous les types</option>
                    {typesAidesData.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'aides' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bénéficiaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type d'aide
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date aide
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance remb.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justificatif
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAides.map((aide) => {
                  const badge = getStatutBadge(aide.statut)
                  const echeanceProche = aide.date_limite_remboursement && isEcheanceProche(aide.date_limite_remboursement)
                  
                  return (
                    <tr key={aide.id} className={`hover:bg-gray-50 ${echeanceProche ? 'bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {aide.beneficiaire?.photo_url ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={aide.beneficiaire.photo_url}
                                alt={`${aide.beneficiaire.prenom} ${aide.beneficiaire.nom}`}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {aide.beneficiaire?.prenom?.[0]}{aide.beneficiaire?.nom?.[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {aide.beneficiaire?.prenom} {aide.beneficiaire?.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {aide.type_aide?.nom}
                        </div>
                        {aide.motif && (
                          <div className="text-sm text-gray-500">
                            {aide.motif}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(aide.montant)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(aide.date_aide)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {aide.date_limite_remboursement ? (
                          <div className="text-sm text-gray-900">
                            {formatDate(aide.date_limite_remboursement)}
                            {echeanceProche && (
                              <div className="text-xs text-yellow-600 flex items-center">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Échéance proche
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Non définie</span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.style}`}>
                          {badge.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {aide.justificatif_url ? (
                          <button
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="Voir le justificatif"
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
                          {aide.statut === 'accordee' && (
                            <button
                              onClick={() => handleMarquerRemboursee(aide.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Marquer comme remboursée"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setSelectedAide(aide)
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
            
            {filteredAides.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== 'tous' || typeFilter !== 'tous'
                    ? 'Aucune aide ne correspond aux critères'
                    : 'Aucune aide enregistrée'
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant dette
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant payé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reste à payer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Échéance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDettes.map((dette) => {
                  const badge = getStatutDetteBadge(dette.statut)
                  const echeanceProche = isEcheanceProche(dette.date_echeance)
                  const enRetard = isEnRetard(dette.date_echeance, dette.statut)
                  
                  return (
                    <tr key={dette.id} className={`hover:bg-gray-50 ${enRetard ? 'bg-red-50' : echeanceProche ? 'bg-yellow-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {dette.membre?.prenom} {dette.membre?.nom}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(dette.montant_dette)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(dette.montant_paye)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(dette.montant_restant)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(dette.date_echeance)}
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
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Enregistrer paiement"
                          >
                            <DollarSign className="w-4 h-4" />
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
            
            {filteredDettes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm 
                    ? 'Aucune dette ne correspond aux critères'
                    : 'Aucune dette de fond souverain'
                  }
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Résumé par type d'aide */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Résumé par type d'aide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {typesAidesData.map(type => {
            const aidesType = aidesData.filter(a => a.type_aide_id === type.id)
            const accordees = aidesType.filter(a => a.statut === 'accordee').length
            const montant = aidesType.reduce((sum, a) => sum + a.montant, 0)
            
            return (
              <div key={type.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {type.nom}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {accordees}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(montant)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Délai: {type.delai_remboursement_mois} mois
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      <AddAideModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
        membres={membresData}
        typesAides={typesAidesData}
      />

      <EditAideModal
        isOpen={showEditModal}
        aide={selectedAide}
        onClose={() => {
          setShowEditModal(false)
          setSelectedAide(null)
        }}
        onSuccess={loadData}
        membres={membresData}
        typesAides={typesAidesData}
      />
    </div>
  )
}