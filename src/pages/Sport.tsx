import React from 'react'
import { useState, useEffect } from 'react'
import { Users, Trophy, Calendar, Target, Plus, Search, Filter, Eye, Edit, UserPlus } from 'lucide-react'
import { formatDate } from '../lib/utils'

// Types pour les activités sportives
interface AdherentPhoenix {
  id: string
  membre_id: string | null
  nom: string
  prenom: string
  telephone: string | null
  email: string | null
  photo_url: string | null
  statut: 'actif' | 'inactif' | 'suspendu'
  date_adhesion: string
  montant_adhesion: number
  adhesion_payee: boolean
  date_limite_paiement: string | null
  fond_souverain_paye: boolean
  montant_fond_souverain: number
  est_comite_organisation: boolean
  created_at: string
}

interface SeanceEntrainement {
  id: string
  type_sport: 'e2d' | 'phoenix'
  date_seance: string
  heure_debut: string | null
  heure_fin: string | null
  lieu: string | null
  description: string | null
  annulee: boolean
  motif_annulation: string | null
  created_at: string
}

interface Match {
  id: string
  type_sport: 'e2d' | 'phoenix'
  date_match: string
  heure_match: string | null
  adversaire: string
  logo_adversaire_url: string | null
  lieu: string | null
  score_equipe: number
  score_adversaire: number
  resultat: 'victoire' | 'defaite' | 'nul' | null
  type_match: 'amical' | 'championnat' | 'coupe' | 'gala'
  description: string | null
  created_at: string
}

export function Sport() {
  const [activeTab, setActiveTab] = useState<'e2d' | 'phoenix' | 'seances' | 'matchs'>('e2d')
  const [membresE2D, setMembresE2D] = useState<any[]>([])
  const [adherentsPhoenix, setAdherentsPhoenix] = useState<AdherentPhoenix[]>([])
  const [seances, setSeances] = useState<SeanceEntrainement[]>([])
  const [matchs, setMatchs] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'actif' | 'inactif' | 'suspendu'>('tous')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Simulation de chargement des données
      // Dans la vraie app, ces données viendraient de Supabase
      
      // Membres E2D (membres de l'association)
      setMembresE2D([
        {
          id: '1',
          nom: 'Kouassi',
          prenom: 'Jean',
          photo_url: null,
          statut: 'actif',
          date_adhesion: '2024-01-15',
          statistiques: {
            matchs_joues: 12,
            buts: 8,
            passes_decisives: 5,
            cartons_jaunes: 2,
            cartons_rouges: 0
          }
        },
        {
          id: '2',
          nom: 'Diallo',
          prenom: 'Marie',
          photo_url: null,
          statut: 'actif',
          date_adhesion: '2024-02-01',
          statistiques: {
            matchs_joues: 10,
            buts: 3,
            passes_decisives: 7,
            cartons_jaunes: 1,
            cartons_rouges: 0
          }
        }
      ])

      // Adhérents Phoenix (externes)
      setAdherentsPhoenix([
        {
          id: '1',
          membre_id: null,
          nom: 'Traoré',
          prenom: 'Paul',
          telephone: '+225 07 12 34 56',
          email: 'paul.traore@email.com',
          photo_url: null,
          statut: 'actif',
          date_adhesion: '2024-03-01',
          montant_adhesion: 15000,
          adhesion_payee: true,
          date_limite_paiement: null,
          fond_souverain_paye: false,
          montant_fond_souverain: 5000,
          est_comite_organisation: false,
          created_at: '2024-03-01T00:00:00Z'
        },
        {
          id: '2',
          membre_id: null,
          nom: 'Sow',
          prenom: 'Fatou',
          telephone: '+225 05 98 76 54',
          email: 'fatou.sow@email.com',
          photo_url: null,
          statut: 'actif',
          date_adhesion: '2024-03-15',
          montant_adhesion: 15000,
          adhesion_payee: false,
          date_limite_paiement: '2024-04-15',
          fond_souverain_paye: true,
          montant_fond_souverain: 5000,
          est_comite_organisation: true,
          created_at: '2024-03-15T00:00:00Z'
        }
      ])

      // Séances d'entraînement
      setSeances([
        {
          id: '1',
          type_sport: 'e2d',
          date_seance: '2024-08-20',
          heure_debut: '18:00',
          heure_fin: '20:00',
          lieu: 'Terrain municipal',
          description: 'Entraînement technique',
          annulee: false,
          motif_annulation: null,
          created_at: '2024-08-18T00:00:00Z'
        },
        {
          id: '2',
          type_sport: 'phoenix',
          date_seance: '2024-08-22',
          heure_debut: '16:00',
          heure_fin: '18:00',
          lieu: 'Terrain Phoenix',
          description: 'Match amical interne',
          annulee: false,
          motif_annulation: null,
          created_at: '2024-08-18T00:00:00Z'
        }
      ])

      // Matchs
      setMatchs([
        {
          id: '1',
          type_sport: 'e2d',
          date_match: '2024-08-25',
          heure_match: '15:00',
          adversaire: 'FC Rivaux',
          logo_adversaire_url: null,
          lieu: 'Stade central',
          score_equipe: 2,
          score_adversaire: 1,
          resultat: 'victoire',
          type_match: 'championnat',
          description: 'Match de championnat',
          created_at: '2024-08-18T00:00:00Z'
        },
        {
          id: '2',
          type_sport: 'phoenix',
          date_match: '2024-08-30',
          heure_match: '17:00',
          adversaire: 'Phoenix United',
          logo_adversaire_url: null,
          lieu: 'Terrain Phoenix',
          score_equipe: 0,
          score_adversaire: 0,
          resultat: null,
          type_match: 'amical',
          description: 'Match à venir',
          created_at: '2024-08-18T00:00:00Z'
        }
      ])

    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    const styles = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-gray-100 text-gray-800',
      suspendu: 'bg-red-100 text-red-800'
    }
    return styles[statut as keyof typeof styles] || styles.actif
  }

  const getResultatBadge = (resultat: string | null) => {
    if (!resultat) return { style: 'bg-gray-100 text-gray-800', label: 'À venir' }
    
    const styles = {
      victoire: 'bg-green-100 text-green-800',
      defaite: 'bg-red-100 text-red-800',
      nul: 'bg-yellow-100 text-yellow-800'
    }
    const labels = {
      victoire: 'Victoire',
      defaite: 'Défaite',
      nul: 'Match nul'
    }
    return { 
      style: styles[resultat as keyof typeof styles], 
      label: labels[resultat as keyof typeof labels] 
    }
  }

  const filteredMembresE2D = membresE2D.filter(membre => {
    const matchesSearch = 
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'tous' || membre.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredAdherentsPhoenix = adherentsPhoenix.filter(adherent => {
    const matchesSearch = 
      adherent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adherent.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'tous' || adherent.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredSeances = seances.filter(seance => {
    if (activeTab === 'e2d' || activeTab === 'phoenix') {
      return seance.type_sport === activeTab
    }
    return true
  })

  const filteredMatchs = matchs.filter(match => {
    if (activeTab === 'e2d' || activeTab === 'phoenix') {
      return match.type_sport === activeTab
    }
    return true
  })

  const stats = {
    membresE2D: membresE2D.length,
    adherentsPhoenix: adherentsPhoenix.length,
    adherentsPhoenixActifs: adherentsPhoenix.filter(a => a.statut === 'actif').length,
    adhesionsImpayees: adherentsPhoenix.filter(a => !a.adhesion_payee).length,
    fondSouverainImpaye: adherentsPhoenix.filter(a => !a.fond_souverain_paye).length,
    seancesE2D: seances.filter(s => s.type_sport === 'e2d').length,
    seancesPhoenix: seances.filter(s => s.type_sport === 'phoenix').length,
    matchsE2D: matchs.filter(m => m.type_sport === 'e2d').length,
    matchsPhoenix: matchs.filter(m => m.type_sport === 'phoenix').length
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
          <h1 className="text-3xl font-bold text-gray-900">Activités Sportives</h1>
          <p className="text-gray-600 mt-1">
            Sport E2D ({stats.membresE2D} membres) • Sport Phoenix ({stats.adherentsPhoenixActifs} adhérents actifs)
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nouvelle activité</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.membresE2D}</div>
          <div className="text-sm text-gray-600">Membres E2D</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.adherentsPhoenixActifs}</div>
          <div className="text-sm text-gray-600">Adhérents Phoenix</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">{stats.adhesionsImpayees}</div>
          <div className="text-sm text-gray-600">Adhésions impayées</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.fondSouverainImpaye}</div>
          <div className="text-sm text-gray-600">Fond souverain impayé</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('e2d')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'e2d'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Sport E2D ({stats.membresE2D})
            </button>
            <button
              onClick={() => setActiveTab('phoenix')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'phoenix'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Trophy className="w-4 h-4 inline mr-2" />
              Sport Phoenix ({stats.adherentsPhoenixActifs})
            </button>
            <button
              onClick={() => setActiveTab('seances')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seances'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Entraînements ({stats.seancesE2D + stats.seancesPhoenix})
            </button>
            <button
              onClick={() => setActiveTab('matchs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'matchs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Target className="w-4 h-4 inline mr-2" />
              Matchs ({stats.matchsE2D + stats.matchsPhoenix})
            </button>
          </nav>
        </div>

        {/* Filtres */}
        {(activeTab === 'e2d' || activeTab === 'phoenix') && (
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
              
              <div>
                <label className="form-label">Statut</label>
                <select
                  className="form-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="actif">Actifs</option>
                  <option value="inactif">Inactifs</option>
                  <option value="suspendu">Suspendus</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="btn-secondary flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu des onglets */}
        {activeTab === 'e2d' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistiques
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adhésion
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembresE2D.map((membre) => (
                  <tr key={membre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {membre.photo_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={membre.photo_url}
                              alt={`${membre.prenom} ${membre.nom}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {membre.prenom[0]}{membre.nom[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {membre.prenom} {membre.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            Membre E2D
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {membre.statistiques.matchs_joues} matchs
                      </div>
                      <div className="text-sm text-gray-500">
                        {membre.statistiques.buts} buts • {membre.statistiques.passes_decisives} passes
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {membre.statistiques.cartons_jaunes} J
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          {membre.statistiques.cartons_rouges} R
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutBadge(membre.statut)}`}>
                        {membre.statut}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(membre.date_adhesion)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredMembresE2D.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  Aucun membre E2D ne correspond aux critères
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'phoenix' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adhérent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adhésion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fond souverain
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAdherentsPhoenix.map((adherent) => (
                  <tr key={adherent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {adherent.photo_url ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={adherent.photo_url}
                              alt={`${adherent.prenom} ${adherent.nom}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-purple-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {adherent.prenom[0]}{adherent.nom[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {adherent.prenom} {adherent.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            Adhérent Phoenix
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{adherent.email || 'Non renseigné'}</div>
                      <div className="text-sm text-gray-500">{adherent.telephone || 'Non renseigné'}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {adherent.montant_adhesion.toLocaleString()} FCFA
                      </div>
                      <div className={`text-sm ${adherent.adhesion_payee ? 'text-green-600' : 'text-red-600'}`}>
                        {adherent.adhesion_payee ? 'Payée' : 'Impayée'}
                      </div>
                      {!adherent.adhesion_payee && adherent.date_limite_paiement && (
                        <div className="text-xs text-gray-500">
                          Limite: {formatDate(adherent.date_limite_paiement)}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {adherent.montant_fond_souverain.toLocaleString()} FCFA
                      </div>
                      <div className={`text-sm ${adherent.fond_souverain_paye ? 'text-green-600' : 'text-red-600'}`}>
                        {adherent.fond_souverain_paye ? 'Payé' : 'Impayé'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatutBadge(adherent.statut)}`}>
                        {adherent.statut}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {adherent.est_comite_organisation ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Comité
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Joueur</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Voir détails">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAdherentsPhoenix.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  Aucun adhérent Phoenix ne correspond aux critères
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'seances' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type Sport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                {filteredSeances.map((seance) => (
                  <tr key={seance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(seance.date_seance)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {seance.heure_debut} - {seance.heure_fin}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        seance.type_sport === 'e2d' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {seance.type_sport === 'e2d' ? 'Sport E2D' : 'Sport Phoenix'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seance.lieu || 'Non défini'}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {seance.description || 'Aucune description'}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {seance.annulee ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Annulée
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Programmée
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" title="Voir présences">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredSeances.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  Aucune séance d'entraînement programmée
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'matchs' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adversaire
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Résultat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMatchs.map((match) => {
                  const resultatBadge = getResultatBadge(match.resultat)
                  
                  return (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(match.date_match)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.heure_match || 'Heure à définir'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {match.adversaire}
                        </div>
                        <div className="text-sm text-gray-500">
                          {match.lieu || 'Lieu à définir'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {match.resultat ? `${match.score_equipe} - ${match.score_adversaire}` : 'À jouer'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${resultatBadge.style}`}>
                          {resultatBadge.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          match.type_match === 'championnat' ? 'bg-green-100 text-green-800' :
                          match.type_match === 'coupe' ? 'bg-yellow-100 text-yellow-800' :
                          match.type_match === 'gala' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {match.type_match}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          match.type_sport === 'e2d' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {match.type_sport === 'e2d' ? 'E2D' : 'Phoenix'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="Voir statistiques">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {filteredMatchs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  Aucun match programmé
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}