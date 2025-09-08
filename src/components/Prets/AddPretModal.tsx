import React from 'react'
import { useState } from 'react'
import { X, Upload, AlertTriangle } from 'lucide-react'
import { prets } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

interface AddPretModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  membres: any[]
}

export function AddPretModal({ isOpen, onClose, onSuccess, membres }: AddPretModalProps) {
  const [formData, setFormData] = useState({
    emprunteur_id: '',
    montant_principal: 0,
    taux_interet: 5, // Fixé à 5% selon le cahier des charges
    document_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const calculateEcheance = () => {
    const dateEcheance = new Date()
    dateEcheance.setMonth(dateEcheance.getMonth() + 2) // 2 mois selon le cahier des charges
    return dateEcheance.toISOString().split('T')[0]
  }

  const calculateInteret = () => {
    return (formData.montant_principal * formData.taux_interet) / 100
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.emprunteur_id || formData.montant_principal <= 0) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const { error } = await prets.create({
        emprunteur_id: formData.emprunteur_id,
        montant_principal: formData.montant_principal,
        taux_interet: formData.taux_interet,
        montant_interet: calculateInteret(),
        date_pret: new Date().toISOString().split('T')[0],
        date_echeance: calculateEcheance(),
        statut: 'en_cours',
        nombre_reconductions: 0,
        document_url: formData.document_url || null,
        accorde_par: null // TODO: Récupérer l'utilisateur connecté
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
      resetForm()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la création du prêt')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      emprunteur_id: '',
      montant_principal: 0,
      taux_interet: 5,
      document_url: ''
    })
    setError('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Nouveau prêt</h2>
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
              <strong>Conditions du prêt :</strong>
              <ul className="mt-1 list-disc list-inside">
                <li>Taux d'intérêt : 5%</li>
                <li>Durée : 2 mois</li>
                <li>Possibilité de reconduction</li>
                <li>Reconnaissance de dette recommandée</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Emprunteur *</label>
            <select
              required
              className="form-input"
              value={formData.emprunteur_id}
              onChange={(e) => setFormData({ ...formData, emprunteur_id: e.target.value })}
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
            <label className="form-label">Montant du prêt (FCFA) *</label>
            <input
              type="number"
              required
              min="1000"
              step="1000"
              className="form-input"
              value={formData.montant_principal}
              onChange={(e) => setFormData({ ...formData, montant_principal: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 50000"
            />
          </div>

          <div>
            <label className="form-label">Taux d'intérêt (%)</label>
            <input
              type="number"
              className="form-input bg-gray-100"
              value={formData.taux_interet}
              readOnly
              title="Taux fixé à 5% selon les règles de l'association"
            />
          </div>

          {formData.montant_principal > 0 && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Capital :</span>
                  <span className="font-medium">{formatCurrency(formData.montant_principal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intérêts (5%) :</span>
                  <span className="font-medium">{formatCurrency(calculateInteret())}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total à rembourser :</span>
                  <span>{formatCurrency(formData.montant_principal + calculateInteret())}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Échéance : {new Date(calculateEcheance()).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="form-label">Document de reconnaissance de dette (URL)</label>
            <div className="flex space-x-2">
              <input
                type="url"
                className="form-input flex-1"
                placeholder="https://exemple.com/document.pdf"
                value={formData.document_url}
                onChange={(e) => setFormData({ ...formData, document_url: e.target.value })}
              />
              <button
                type="button"
                className="btn-secondary px-3"
                title="Télécharger un document"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Il est fortement recommandé de joindre une reconnaissance de dette signée
            </p>
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
              disabled={loading || !formData.emprunteur_id || formData.montant_principal <= 0}
            >
              {loading ? 'Création...' : 'Accorder le prêt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}