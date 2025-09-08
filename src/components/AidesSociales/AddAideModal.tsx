import React from 'react'
import { useState, useEffect } from 'react'
import { X, Upload, AlertTriangle, Heart } from 'lucide-react'
import { aidesSociales, dettesFondSouverain } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

interface AddAideModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  membres: any[]
  typesAides: any[]
}

export function AddAideModal({ isOpen, onClose, onSuccess, membres, typesAides }: AddAideModalProps) {
  const [formData, setFormData] = useState({
    beneficiaire_id: '',
    type_aide_id: '',
    montant: 0,
    motif: '',
    justificatif_url: '',
    creer_dette: true
  })
  const [selectedType, setSelectedType] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (formData.type_aide_id) {
      const type = typesAides.find(t => t.id === formData.type_aide_id)
      setSelectedType(type)
      if (type) {
        setFormData(prev => ({ ...prev, montant: type.montant_defaut }))
      }
    }
  }, [formData.type_aide_id, typesAides])

  const calculateDateLimite = () => {
    if (!selectedType) return null
    const dateLimite = new Date()
    dateLimite.setMonth(dateLimite.getMonth() + selectedType.delai_remboursement_mois)
    return dateLimite.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.beneficiaire_id || !formData.type_aide_id || formData.montant <= 0) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      // Créer l'aide sociale
      const { data: aide, error: aideError } = await aidesSociales.create({
        beneficiaire_id: formData.beneficiaire_id,
        type_aide_id: formData.type_aide_id,
        montant: formData.montant,
        date_aide: new Date().toISOString().split('T')[0],
        date_limite_remboursement: calculateDateLimite(),
        motif: formData.motif || null,
        justificatif_url: formData.justificatif_url || null,
        statut: 'accordee',
        accorde_par: null // TODO: Récupérer l'utilisateur connecté
      })
      
      if (aideError) throw aideError

      // Créer la dette de fond souverain si demandé
      if (formData.creer_dette && aide) {
        const dateLimite = calculateDateLimite()
        if (dateLimite) {
          const { error: detteError } = await dettesFondSouverain.create({
            membre_id: formData.beneficiaire_id,
            aide_sociale_id: aide.id,
            montant_dette: formData.montant,
            montant_paye: 0,
            montant_restant: formData.montant,
            date_echeance: dateLimite,
            statut: 'en_cours'
          })
          
          if (detteError) {
            console.error('Erreur lors de la création de la dette:', detteError)
            // Ne pas bloquer si la dette échoue, l'aide est créée
          }
        }
      }
      
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création de l\'aide')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      beneficiaire_id: '',
      type_aide_id: '',
      montant: 0,
      motif: '',
      justificatif_url: '',
      creer_dette: true
    })
    setSelectedType(null)
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Nouvelle aide sociale</h2>
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
            <Heart className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Information :</strong>
              <ul className="mt-1 list-disc list-inside">
                <li>Les aides sont remboursées collectivement</li>
                <li>Une dette de fond souverain sera créée automatiquement</li>
                <li>Le justificatif est obligatoire pour certaines aides</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Bénéficiaire *</label>
            <select
              required
              className="form-input"
              value={formData.beneficiaire_id}
              onChange={(e) => setFormData({ ...formData, beneficiaire_id: e.target.value })}
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
            <label className="form-label">Type d'aide *</label>
            <select
              required
              className="form-input"
              value={formData.type_aide_id}
              onChange={(e) => setFormData({ ...formData, type_aide_id: e.target.value })}
            >
              <option value="">Sélectionner un type</option>
              {typesAides.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.nom} - {formatCurrency(type.montant_defaut)}
                </option>
              ))}
            </select>
          </div>

          {selectedType && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-700">
                <div><strong>Description :</strong> {selectedType.description}</div>
                <div><strong>Montant par défaut :</strong> {formatCurrency(selectedType.montant_defaut)}</div>
                <div><strong>Délai de remboursement :</strong> {selectedType.delai_remboursement_mois} mois</div>
                {calculateDateLimite() && (
                  <div><strong>Date limite :</strong> {new Date(calculateDateLimite()!).toLocaleDateString('fr-FR')}</div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Montant de l'aide (FCFA) *</label>
            <input
              type="number"
              required
              min="1000"
              step="1000"
              className="form-input"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 50000"
            />
          </div>

          <div>
            <label className="form-label">Motif / Circonstances</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              placeholder="Précisions sur les circonstances de l'aide..."
            />
          </div>

          <div>
            <label className="form-label">Justificatif (URL) *</label>
            <div className="flex space-x-2">
              <input
                type="url"
                required
                className="form-input flex-1"
                placeholder="https://exemple.com/justificatif.pdf"
                value={formData.justificatif_url}
                onChange={(e) => setFormData({ ...formData, justificatif_url: e.target.value })}
              />
              <button
                type="button"
                className="btn-secondary px-3"
                title="Télécharger un justificatif"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Certificat médical, acte de mariage, etc. (obligatoire)
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="creer_dette"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formData.creer_dette}
              onChange={(e) => setFormData({ ...formData, creer_dette: e.target.checked })}
            />
            <label htmlFor="creer_dette" className="ml-2 block text-sm text-gray-900">
              Créer une dette de fond souverain (recommandé)
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
              disabled={loading || !formData.beneficiaire_id || !formData.type_aide_id || formData.montant <= 0}
            >
              {loading ? 'Création...' : 'Accorder l\'aide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}