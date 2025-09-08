import React from 'react'
import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { prets } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

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
}

interface EditPretModalProps {
  isOpen: boolean
  pret: Pret | null
  onClose: () => void
  onSuccess: () => void
  membres: any[]
}

export function EditPretModal({ isOpen, pret, onClose, onSuccess, membres }: EditPretModalProps) {
  const [formData, setFormData] = useState({
    montant_principal: 0,
    date_echeance: '',
    statut: 'en_cours' as 'en_cours' | 'rembourse' | 'reconduit' | 'en_retard',
    document_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (pret) {
      setFormData({
        montant_principal: pret.montant_principal,
        date_echeance: pret.date_echeance,
        statut: pret.statut,
        document_url: pret.document_url || ''
      })
    }
  }, [pret])

  const calculateInteret = () => {
    return (formData.montant_principal * 5) / 100 // Taux fixe à 5%
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pret) return
    
    setLoading(true)
    setError('')

    try {
      const { error } = await prets.update(pret.id, {
        montant_principal: formData.montant_principal,
        montant_interet: calculateInteret(),
        date_echeance: formData.date_echeance,
        statut: formData.statut,
        document_url: formData.document_url || null
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la modification du prêt')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !pret) return null

  const emprunteur = membres.find(m => m.id === pret.emprunteur_id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier le prêt
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

        <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-4">
          <div className="text-sm text-blue-800">
            <strong>Emprunteur :</strong> {emprunteur?.prenom} {emprunteur?.nom}<br />
            <strong>Date d'accord :</strong> {new Date(pret.date_pret).toLocaleDateString('fr-FR')}<br />
            <strong>Reconductions :</strong> {pret.nombre_reconductions}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          <div>
            <label className="form-label">Date d'échéance *</label>
            <input
              type="date"
              required
              className="form-input"
              value={formData.date_echeance}
              onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
            >
              <option value="en_cours">En cours</option>
              <option value="rembourse">Remboursé</option>
              <option value="reconduit">Reconduit</option>
              <option value="en_retard">En retard</option>
            </select>
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
              disabled={loading}
            >
              {loading ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}