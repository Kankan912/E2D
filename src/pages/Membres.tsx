import React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react'
import { membres } from '../lib/supabase'
import { formatDate } from '../lib/utils'

interface Membre {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string | null
  photo_url: string | null
  statut: 'actif' | 'inactif' | 'suspendu'
  montant_cotisation_mensuelle: number
  date_adhesion: string
  created_at: string
  membres_roles?: Array<{
    roles: {
      nom: string
      description: string
    }
  }>
}

export function Membres() {
  const [membresData, setMembresData] = useState<Membre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'tous' | 'actif' | 'inactif' | 'suspendu'>('tous')

  useEffect(() => {
    loadMembres()
  }, [])

  const loadMembres = async () => {
    try {
      const { data, error } = await membres.getAll()
      if (error) throw error
      setMembresData(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMembres = membresData.filter(membre => {
    const matchesSearch = 
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'tous' || membre.statut === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (membreId: string, newStatus: 'actif' | 'inactif' | 'suspendu') => {
    try {
      const { error } = await membres.update(membreId, { statut: newStatus })
      if (error) throw error
      
      // Recharger les données
      loadMembres()
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
    }
  }

  const getStatusBadge = (statut: string) => {
    const styles = {
      actif: 'badge-success',
      inactif: 'badge-gray',
      suspendu: 'badge-danger'
    }
    return styles[statut as keyof typeof styles] || styles.inactif
  }

  const getRoles = (membre: Membre) => {
    return membre.membres_roles?.map(mr => mr.roles.nom).join(', ') || 'Membre'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Membres</h1>
          <p className="text-gray-600 mt-1">
            {membresData.length} membre{membresData.length > 1 ? 's' : ''} enregistré{membresData.length > 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary">
          <Plus className="w-5 h-5" />
          Nouveau membre
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="actif">Actifs</option>
              <option value="inactif">Inactifs</option>
              <option value="suspendu">Suspendus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des membres */}
      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Membre</th>
              <th className="table-header-cell">Contact</th>
              <th className="table-header-cell">Rôles</th>
              <th className="table-header-cell">Statut</th>
              <th className="table-header-cell">Cotisation</th>
              <th className="table-header-cell">Adhésion</th>
              <th className="table-header-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {filteredMembres.map((membre) => (
              <tr key={membre.id} className="table-row">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {membre.photo_url ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={membre.photo_url}
                          alt={`${membre.prenom} ${membre.nom}`}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
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
                        ID: {membre.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">{membre.email}</div>
                  <div className="text-sm text-gray-500">{membre.telephone || 'Non renseigné'}</div>
                </td>
                <td className="table-cell">
                  <div className="text-sm text-gray-900">{getRoles(membre)}</div>
                </td>
                <td className="table-cell">
                  <span className={`badge ${getStatusBadge(membre.statut)}`}>
                    {membre.statut}
                  </span>
                </td>
                <td className="table-cell">
                  {membre.montant_cotisation_mensuelle.toLocaleString()} FCFA
                </td>
                <td className="table-cell">
                  {formatDate(membre.date_adhesion)}
                </td>
                <td className="table-cell text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {membre.statut === 'actif' ? (
                      <button
                        onClick={() => handleStatusChange(membre.id, 'inactif')}
                        className="text-orange-600 hover:text-orange-900 p-1"
                        title="Désactiver"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(membre.id, 'actif')}
                        className="text-success-600 hover:text-success-900 p-1"
                        title="Activer"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      className="text-primary-600 hover:text-primary-900 p-1"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      className="text-danger-600 hover:text-danger-900 p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredMembres.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm || statusFilter !== 'tous' 
                ? 'Aucun membre ne correspond aux critères de recherche'
                : 'Aucun membre enregistré'
              }
            </div>
          </div>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-success-600">
            {membresData.filter(m => m.statut === 'actif').length}
          </div>
          <div className="text-sm text-gray-600">Membres actifs</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-600">
            {membresData.filter(m => m.statut === 'inactif').length}
          </div>
          <div className="text-sm text-gray-600">Membres inactifs</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-danger-600">
            {membresData.filter(m => m.statut === 'suspendu').length}
          </div>
          <div className="text-sm text-gray-600">Membres suspendus</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600">
            {membresData.reduce((sum, m) => sum + m.montant_cotisation_mensuelle, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total cotisations (FCFA)</div>
        </div>
      </div>
    </div>
  )
}