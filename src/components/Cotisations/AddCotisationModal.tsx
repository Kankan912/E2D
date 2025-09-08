import React from 'react'
import { useState, useEffect } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cotisations, membres, configurations } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

interface AddCotisationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  mois: number
  annee: number
}

const MOIS_NOMS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

export function AddCotisationModal({ isOpen, onClose, onSuccess, mois, annee }: AddCotisationModalProps) {
  const [membresData, setMembresData] = useState<any[]>([])
  const [selectedMembre, setSelectedMembre] = useState('')
  const [formData, setFormData] = useState({
    montant_paye: 0,
    huile_paye: false,
    savon_paye: false,
    fond_sport_paye: false,
    montant_fond_sport: 0
  })
  const [membreInfo, setMembreInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')

  useEffect(() => {
    if (isOpen) {
      loadMembres()
      loadConfigurations()
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedMembre) {
      const membre = membresData.find(m => m.id === selectedMembre)
      setMembreInfo(membre)
      
      // Vérifier si le montant est inférieur à la cotisation configurée
      if (formData.montant_paye > 0 && membre && formData.montant_paye < membre.montant_cotisation_mensuelle) {
        setWarning(`Attention: Le montant saisi (${formatCurrency(formData.montant_paye)}) est inférieur à la cotisation configurée (${formatCurrency(membre.montant_cotisation_mensuelle)})`)
      } else {
        setWarning('')
      }
    }
  }, [selectedMembre, formData.montant_paye, membresData])

  const loadMembres = async () => {
    try {
      const { data, error } = await membres.getAll()
      if (error) throw error
      setMembresData(data?.filter(m => m.statut === 'actif') || [])
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error)
    }
  }

  const loadConfigurations = async () => {
    try {
      const { data: fondSport } = await configurations.getValue('montant_fond_sport_mensuel')
      if (fondSport) {
        setFormData(prev => ({ ...prev, montant_fond_sport: fondSport }))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des configurations:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMembre || !membreInfo) return
    
    // Vérification du montant minimum
    if (formData.montant_paye < membreInfo.montant_cotisation_mensuelle) {
      setError(`Le montant saisi (${formatCurrency(formData.montant_paye)}) est inférieur à la cotisation configurée (${formatCurrency(membreInfo.montant_cotisation_mensuelle)}). Veuillez saisir le montant correct.`)
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const { error } = await cotisations.create({
        membre_id: selectedMembre,
        mois,
        annee,
        montant_attendu: membreInfo.montant_cotisation_mensuelle,
        montant_paye: formData.montant_paye,
        huile_paye: formData.huile_paye,
        savon_paye: formData.savon_paye,
        fond_sport_paye: formData.fond_sport_paye,
        montant_fond_sport: formData.montant_fond_sport,
        date_paiement: new Date().toISOString()
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la saisie de la cotisation')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedMembre('')
    setFormData({
      montant_paye: 0,
      huile_paye: false,
      savon_paye: false,
      fond_sport_paye: false,
      montant_fond_sport: 0
    })
    setMembreInfo(null)
    setError('')
    setWarning('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Saisir cotisation - {MOIS_NOMS[mois - 1]} {annee}
          </h2>
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

        {warning && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{warning}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Membre *</label>
            <select
              required
              className="form-input"
              value={selectedMembre}
              onChange={(e) => setSelectedMembre(e.target.value)}
            >
              <option value="">Sélectionner un membre</option>
              {membresData.map((membre) => (
                <option key={membre.id} value={membre.id}>
                  {membre.prenom} {membre.nom} - {formatCurrency(membre.montant_cotisation_mensuelle)}
                </option>
              ))}
            </select>
          </div>

          {membreInfo && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded">
              <div className="text-sm text-blue-800">
                <strong>Cotisation configurée:</strong> {formatCurrency(membreInfo.montant_cotisation_mensuelle)}
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Montant cotisation payé (FCFA) *</label>
            <input
              type="number"
              required
              min="0"
              className="form-input"
              value={formData.montant_paye}
              onChange={(e) => setFormData({ ...formData, montant_paye: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="huile_paye"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.huile_paye}
                onChange={(e) => setFormData({ ...formData, huile_paye: e.target.checked })}
              />
              <label htmlFor="huile_paye" className="ml-2 block text-sm text-gray-900">
                Huile payée
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="savon_paye"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.savon_paye}
                onChange={(e) => setFormData({ ...formData, savon_paye: e.target.checked })}
              />
              <label htmlFor="savon_paye" className="ml-2 block text-sm text-gray-900">
                Savon payé
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="fond_sport_paye"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.fond_sport_paye}
                onChange={(e) => setFormData({ ...formData, fond_sport_paye: e.target.checked })}
              />
              <label htmlFor="fond_sport_paye" className="ml-2 block text-sm text-gray-900">
                Fond sport payé ({formatCurrency(formData.montant_fond_sport)})
              </label>
            </div>
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
              disabled={loading || !selectedMembre}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}