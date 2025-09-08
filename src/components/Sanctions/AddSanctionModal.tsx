import React from 'react'
import { useState, useEffect } from 'react'
import { X, AlertTriangle, Plus } from 'lucide-react'
import { sanctions } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

interface AddSanctionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  membres: any[]
  typesSanctions: any[]
}

export function AddSanctionModal({ isOpen, onClose, onSuccess, membres, typesSanctions }: AddSanctionModalProps) {
  const [formData, setFormData] = useState({
    membre_id: '',
    type_sanction_id: '',
    montant: 0,
    motif: '',
    automatique: false
  })
  const [selectedType, setSelectedType] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (formData.type_sanction_id) {
      const type = typesSanctions.find(t => t.id === formData.type_sanction_id)
      setSelectedType(type)
      if (type) {
        setFormData(prev => ({ ...prev, montant: type.montant_defaut }))
      }
    }
  }, [formData.type_sanction_id, typesSanctions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.membre_id || !formData.type_sanction_id || formData.montant <= 0) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const { error } = await sanctions.create({
        membre_id: formData.membre_id,
        type_sanction_id: formData.type_sanction_id,
        montant: formData.montant,
        motif: formData.motif || null,
        date_sanction: new Date().toISOString().split('T')[0],
        statut: 'impayee',
        automatique: formData.automatique,
        saisi_par: null // TODO: Récupérer l'utilisateur connecté
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de la sanction')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      membre_id: '',
      type_sanction_id: '',
      montant: 0,
      motif: '',
      automatique: false
    })
    setSelectedType(null)
    setError('')
  }

  const getCategorieLabel = (categorie: string) => {
    const labels = {
      reunion: 'Réunion',
      sport_e2d: 'Sport E2D',
      sport_phoenix: 'Sport Phoenix',
      disciplinaire: 'Disciplinaire'
    }
    return labels[categorie as keyof typeof labels] || categorie
  }

  const typesSanctionsGrouped = typesSanctions.reduce((acc, type) => {
    if (!acc[type.categorie]) {
      acc[type.categorie] = []
    }
    acc[type.categorie].push(type)
    return acc
  }, {} as Record<string, any[]>)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Nouvelle sanction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Information :</strong>
              <ul className="mt-1 list-disc list-inside">
                <li>Les sanctions peuvent être automatiques (cartons) ou manuelles</li>
                <li>Le montant par défaut peut être modifié</li>
                <li>Les sanctions cumulées peuvent entraîner une suspension</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Membre sanctionné *</label>
            <select
              required
              className="form-input"
              value={formData.membre_id}
              onChange={(e) => setFormData({ ...formData, membre_id: e.target.value })}
            >
              <option value="">Sélectionner un membre</option>
              {membres.map((membre) => (
                <option key={membre.id} value={membre.id}>
                  {membre.prenom} {membre.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Type de sanction *</label>
            <select
              required
              className="form-input"
              value={formData.type_sanction_id}
              onChange={(e) => setFormData({ ...formData, type_sanction_id: e.target.value })}
            >
              <option value="">Sélectionner un type</option>
              {Object.entries(typesSanctionsGrouped).map(([categorie, types]) => (
                <optgroup key={categorie} label={getCategorieLabel(categorie)}>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nom} - {formatCurrency(type.montant_defaut)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedType && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-700">
                <div><strong>Catégorie :</strong> {getCategorieLabel(selectedType.categorie)}</div>
                <div><strong>Description :</strong> {selectedType.description}</div>
                <div><strong>Montant par défaut :</strong> {formatCurrency(selectedType.montant_defaut)}</div>
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Montant de la sanction (FCFA) *</label>
            <input
              type="number"
              required
              min="0"
              step="100"
              className="form-input"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 1000"
            />
          </div>

          <div>
            <label className="form-label">Motif (optionnel)</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              placeholder="Précisions sur la sanction..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="automatique"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.automatique}
              onChange={(e) => setFormData({ ...formData, automatique: e.target.checked })}
            />
            <label htmlFor="automatique" className="ml-2 block text-sm text-gray-900">
              Sanction automatique (ex: carton en match)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !formData.membre_id || !formData.type_sanction_id || formData.montant <= 0}
            >
              {loading ? 'Création...' : 'Créer la sanction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}