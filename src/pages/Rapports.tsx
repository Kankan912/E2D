import React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Search, FileText, Calendar, Users, Download, Eye, Edit, CheckCircle, Clock, MapPin, User } from 'lucide-react'
import { formatDate, formatDateTime } from '../lib/utils'

interface RapportSeance {
  id: string
  date_seance: string
  lieu: string
  hote_membre_id: string
  heure_debut: string | null
  heure_fin: string | null
  nombre_presents: number
  nombre_absents: number
  statut: 'brouillon' | 'finalise' | 'approuve'
  document_pdf_url: string | null
  redige_par: string | null
  created_at: string
  hote?: {
    nom: string
    prenom: string
  }
  points_ordre_jour?: PointOrdreJour[]
}

interface PointOrdreJour {
  id: string
  numero_point: number
  titre: string
  description: string | null
  type_point: 'discussion' | 'decision' | 'information' | 'vote'
  resolutions?: Resolution[]
}

interface Resolution {
  id: string
  resolution: string
  type_resolution: 'decision' | 'recommandation' | 'action'
  responsable_membre_id: string | null
  date_limite: string | null
  statut: 'en_cours' | 'terminee' | 'reportee' | 'annulee'
  responsable?: {
    nom: string
    prenom: string
  }
}

interface CalendrierReception {
  id: string
  mois: number
  annee: number
  hote_membre_id: string
  lieu: string | null
  date_prevue: string | null
  date_effective: string | null
  statut: 'planifiee' | 'confirmee' | 'reportee' | 'annulee'
  notes: string | null
  hote?: {
    nom: string
    prenom: string
  }
}

const MOIS_NOMS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export function Rapports() {
  const [activeTab, setActiveTab] = useState<'rapports' | 'calendrier' | 'etats'>('rapports')
  const [rapports, setRapports] = useState<RapportSeance[]>([])
  const [calendrier, setCalendrier] = useState<CalendrierReception[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'brouillon' | 'finalise' | 'approuve'>('tous')
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear())

  useEffect(() => {
    loadData()
  }, [selectedAnnee])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Simulation de chargement des données
      // Dans la vraie app, ces données viendraient de Supabase
      
      // Rapports de séances
      setRapports([
        {
          id: '1',
          date_seance: '2024-08-15',
          lieu: 'Chez Marie Diallo',
          hote_membre_id: '2',
          heure_debut: '18:00',
          heure_fin: '20:30',
          nombre_presents: 38,
          nombre_absents: 7,
          statut: 'finalise',
          document_pdf_url: 'https://exemple.com/rapport-aout-2024.pdf',
          redige_par: '1',
          created_at: '2024-08-16T00:00:00Z',
          hote: { nom: 'Diallo', prenom: 'Marie' },
          points_ordre_jour: [
            {
              id: '1',
              numero_point: 1,
              titre: 'Validation du rapport précédent',
              description: 'Lecture et validation du rapport de juillet 2024',
              type_point: 'decision',
              resolutions: [
                {
                  id: '1',
                  resolution: 'Rapport de juillet validé à l\'unanimité',
                  type_resolution: 'decision',
                  responsable_membre_id: null,
                  date_limite: null,
                  statut: 'terminee'
                }
              ]
            },
            {
              id: '2',
              numero_point: 2,
              titre: 'Situation financière',
              description: 'Présentation des comptes par le trésorier',
              type_point: 'information',
              resolutions: [
                {
                  id: '2',
                  resolution: 'Fonds de caisse : 2 450 000 FCFA. Épargnes : 1 850 000 FCFA',
                  type_resolution: 'information',
                  responsable_membre_id: '1',
                  date_limite: null,
                  statut: 'terminee',
                  responsable: { nom: 'Kouassi', prenom: 'Jean' }
                }
              ]
            },
            {
              id: '3',
              numero_point: 3,
              titre: 'Préparation match de gala',
              description: 'Organisation du match de gala annuel',
              type_point: 'decision',
              resolutions: [
                {
                  id: '3',
                  resolution: 'Date fixée au 15 septembre 2024. Recherche de sponsors.',
                  type_resolution: 'action',
                  responsable_membre_id: '3',
                  date_limite: '2024-09-01',
                  statut: 'en_cours',
                  responsable: { nom: 'Traoré', prenom: 'Paul' }
                }
              ]
            }
          ]
        },
        {
          id: '2',
          date_seance: '2024-07-20',
          lieu: 'Chez Jean Kouassi',
          hote_membre_id: '1',
          heure_debut: '17:30',
          heure_fin: '19:45',
          nombre_presents: 42,
          nombre_absents: 3,
          statut: 'approuve',
          document_pdf_url: 'https://exemple.com/rapport-juillet-2024.pdf',
          redige_par: '2',
          created_at: '2024-07-21T00:00:00Z',
          hote: { nom: 'Kouassi', prenom: 'Jean' }
        }
      ])

      // Calendrier des réceptions
      setCalendrier([
        {
          id: '1',
          mois: 9,
          annee: 2024,
          hote_membre_id: '3',
          lieu: 'Domicile Paul Traoré',
          date_prevue: '2024-09-15',
          date_effective: null,
          statut: 'confirmee',
          notes: 'Prévoir 50 personnes',
          hote: { nom: 'Traoré', prenom: 'Paul' }
        },
        {
          id: '2',
          mois: 10,
          annee: 2024,
          hote_membre_id: '4',
          lieu: null,
          date_prevue: '2024-10-20',
          date_effective: null,
          statut: 'planifiee',
          notes: null,
          hote: { nom: 'Sow', prenom: 'Fatou' }
        },
        {
          id: '3',
          mois: 8,
          annee: 2024,
          hote_membre_id: '2',
          lieu: 'Domicile Marie Diallo',
          date_prevue: '2024-08-15',
          date_effective: '2024-08-15',
          statut: 'confirmee',
          notes: 'Réception réussie - 45 participants',
          hote: { nom: 'Diallo', prenom: 'Marie' }
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
      brouillon: 'bg-gray-100 text-gray-800',
      finalise: 'bg-blue-100 text-blue-800',
      approuve: 'bg-green-100 text-green-800',
      planifiee: 'bg-yellow-100 text-yellow-800',
      confirmee: 'bg-green-100 text-green-800',
      reportee: 'bg-orange-100 text-orange-800',
      annulee: 'bg-red-100 text-red-800'
    }
    const labels = {
      brouillon: 'Brouillon',
      finalise: 'Finalisé',
      approuve: 'Approuvé',
      planifiee: 'Planifiée',
      confirmee: 'Confirmée',
      reportee: 'Reportée',
      annulee: 'Annulée'
    }
    return { 
      style: styles[statut as keyof typeof styles] || styles.brouillon, 
      label: labels[statut as keyof typeof labels] || statut 
    }
  }

  const getTypePointBadge = (type: string) => {
    const styles = {
      discussion: 'bg-blue-100 text-blue-800',
      decision: 'bg-green-100 text-green-800',
      information: 'bg-gray-100 text-gray-800',
      vote: 'bg-purple-100 text-purple-800'
    }
    const labels = {
      discussion: 'Discussion',
      decision: 'Décision',
      information: 'Information',
      vote: 'Vote'
    }
    return { 
      style: styles[type as keyof typeof styles] || styles.discussion, 
      label: labels[type as keyof typeof labels] || type 
    }
  }

  const getResolutionBadge = (statut: string) => {
    const styles = {
      en_cours: 'bg-yellow-100 text-yellow-800',
      terminee: 'bg-green-100 text-green-800',
      reportee: 'bg-orange-100 text-orange-800',
      annulee: 'bg-red-100 text-red-800'
    }
    const labels = {
      en_cours: 'En cours',
      terminee: 'Terminée',
      reportee: 'Reportée',
      annulee: 'Annulée'
    }
    return { 
      style: styles[statut as keyof typeof styles] || styles.en_cours, 
      label: labels[statut as keyof typeof labels] || statut 
    }
  }

  const filteredRapports = rapports.filter(rapport => {
    const matchesSearch = 
      rapport.hote?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.hote?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rapport.lieu.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'tous' || rapport.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredCalendrier = calendrier.filter(reception => {
    const matchesSearch = 
      reception.hote?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reception.hote?.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reception.lieu && reception.lieu.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch && reception.annee === selectedAnnee
  })

  const stats = {
    rapportsTotal: rapports.length,
    rapportsBrouillon: rapports.filter(r => r.statut === 'brouillon').length,
    rapportsFinalises: rapports.filter(r => r.statut === 'finalise').length,
    rapportsApprouves: rapports.filter(r => r.statut === 'approuve').length,
    receptionsAnnee: calendrier.filter(c => c.annee === selectedAnnee).length,
    receptionsConfirmees: calendrier.filter(c => c.annee === selectedAnnee && c.statut === 'confirmee').length
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
          <h1 className="text-3xl font-bold text-gray-900">Rapports et Administration</h1>
          <p className="text-gray-600 mt-1">
            {stats.rapportsTotal} rapport{stats.rapportsTotal > 1 ? 's' : ''} • {stats.receptionsAnnee} réception{stats.receptionsAnnee > 1 ? 's' : ''} en {selectedAnnee}
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nouveau rapport</span>
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.rapportsBrouillon}</div>
          <div className="text-sm text-gray-600">Rapports brouillon</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.rapportsFinalises}</div>
          <div className="text-sm text-gray-600">Rapports finalisés</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{stats.rapportsApprouves}</div>
          <div className="text-sm text-gray-600">Rapports approuvés</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.receptionsConfirmees}</div>
          <div className="text-sm text-gray-600">Réceptions confirmées</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('rapports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rapports'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Rapports de séances ({stats.rapportsTotal})
            </button>
            <button
              onClick={() => setActiveTab('calendrier')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendrier'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Calendrier réceptions ({stats.receptionsAnnee})
            </button>
            <button
              onClick={() => setActiveTab('etats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'etats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              États et statistiques
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
                  placeholder="Hôte, lieu..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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

            {activeTab === 'rapports' && (
              <div>
                <label className="form-label">Statut</label>
                <select
                  className="form-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="brouillon">Brouillon</option>
                  <option value="finalise">Finalisé</option>
                  <option value="approuve">Approuvé</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'rapports' && (
          <div className="space-y-6">
            {filteredRapports.map((rapport) => {
              const badge = getStatutBadge(rapport.statut)
              
              return (
                <div key={rapport.id} className="border border-gray-200 rounded-lg p-6">
                  {/* En-tête du rapport */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Séance du {formatDate(rapport.date_seance)}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {rapport.lieu}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Hôte: {rapport.hote?.prenom} {rapport.hote?.nom}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {rapport.heure_debut} - {rapport.heure_fin}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {rapport.nombre_presents} présents, {rapport.nombre_absents} absents
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.style}`}>
                        {badge.label}
                      </span>
                      <div className="flex space-x-2">
                        {rapport.document_pdf_url && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Télécharger le PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button
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
                    </div>
                  </div>

                  {/* Points à l'ordre du jour */}
                  {rapport.points_ordre_jour && rapport.points_ordre_jour.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Points à l'ordre du jour</h4>
                      {rapport.points_ordre_jour.map((point) => {
                        const typeBadge = getTypePointBadge(point.type_point)
                        
                        return (
                          <div key={point.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">
                                  {point.numero_point}. {point.titre}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeBadge.style}`}>
                                  {typeBadge.label}
                                </span>
                              </div>
                            </div>
                            
                            {point.description && (
                              <p className="text-sm text-gray-600 mb-3">{point.description}</p>
                            )}
                            
                            {/* Résolutions */}
                            {point.resolutions && point.resolutions.length > 0 && (
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">Résolutions :</h5>
                                {point.resolutions.map((resolution) => {
                                  const resBadge = getResolutionBadge(resolution.statut)
                                  
                                  return (
                                    <div key={resolution.id} className="bg-white p-3 rounded border">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="text-sm text-gray-900">{resolution.resolution}</p>
                                          {resolution.responsable && (
                                            <p className="text-xs text-gray-500 mt-1">
                                              Responsable: {resolution.responsable.prenom} {resolution.responsable.nom}
                                            </p>
                                          )}
                                          {resolution.date_limite && (
                                            <p className="text-xs text-gray-500">
                                              Échéance: {formatDate(resolution.date_limite)}
                                            </p>
                                          )}
                                        </div>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${resBadge.style} ml-2`}>
                                          {resBadge.label}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            
            {filteredRapports.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  {searchTerm || statusFilter !== 'tous' 
                    ? 'Aucun rapport ne correspond aux critères'
                    : 'Aucun rapport de séance'
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendrier' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mois
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hôte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date prévue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date effective
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
                {filteredCalendrier.map((reception) => {
                  const badge = getStatutBadge(reception.statut)
                  
                  return (
                    <tr key={reception.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {MOIS_NOMS[reception.mois - 1]} {reception.annee}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {reception.hote?.prenom} {reception.hote?.nom}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reception.lieu || 'À définir'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reception.date_prevue ? formatDate(reception.date_prevue) : 'À définir'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {reception.date_effective ? formatDate(reception.date_effective) : '-'}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.style}`}>
                          {badge.label}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900" title="Voir détails">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {filteredCalendrier.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  Aucune réception programmée pour {selectedAnnee}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'etats' && (
          <div className="space-y-6">
            {/* États financiers */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                États financiers - {selectedAnnee}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">2 450 000</div>
                  <div className="text-sm text-gray-600">Fonds de caisse (FCFA)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1 850 000</div>
                  <div className="text-sm text-gray-600">Épargnes totales (FCFA)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">450 000</div>
                  <div className="text-sm text-gray-600">Prêts en cours (FCFA)</div>
                </div>
              </div>
            </div>

            {/* États des membres */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                États des membres - {selectedAnnee}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <div className="text-sm text-gray-600">Membres actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">3</div>
                  <div className="text-sm text-gray-600">Membres inactifs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">0</div>
                  <div className="text-sm text-gray-600">Membres suspendus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Nouveaux membres</div>
                </div>
              </div>
            </div>

            {/* États sportifs */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                États sportifs - {selectedAnnee}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sport E2D</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">42</div>
                      <div className="text-xs text-gray-600">Membres participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">15</div>
                      <div className="text-xs text-gray-600">Matchs joués</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Sport Phoenix</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">28</div>
                      <div className="text-xs text-gray-600">Adhérents actifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">12</div>
                      <div className="text-xs text-gray-600">Matchs joués</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions d'export */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Génération d'états
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>État financier annuel</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>Liste des membres</span>
                </button>
                <button className="btn-secondary flex items-center justify-center space-x-2 p-4">
                  <Download className="w-5 h-5" />
                  <span>Statistiques sportives</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}