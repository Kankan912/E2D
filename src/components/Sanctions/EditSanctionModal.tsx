import React from 'react'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { sanctions } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

interface Sanction {
  id: string
  membre_id: string
  type_sanction_id: string
  montant: number
  motif: string | null
  date_sanction: string
  statut: 'impayee' | 'payee' | 'annulee'
  automatique: boolean
}

interface EditSanctionModalProps {
  isOpen: boolean
  sanction: Sanction | null
  onClose: () => void
  onSuccess: () => void
  membres: any[]
  typesSanctions: any[]
}

export function EditSanctionModal({ isOpen, sanction, onClose, onSuccess, membres, typesSanctions }: EditSanctionModalProps) {
  const [formData, setFormData] = useState({
    montant: 0,
    motif: '',
    statut: 'impayee' as 'impayee' | 'payee' | 'annulee'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sanction) {
      setFormData({
        montant: sanction.montant,
        motif: sanction.motif || '',
        statut: sanction.statut
      })
    }
  }, [sanction])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sanction) return
    
    setLoading(true)
    setError('')

    try {
      const updateData: any = {
        montant: formData.montant,
        motif: formData.motif || null,
        statut: formData.statut
      }

      // Si on marque comme payée, ajouter la date de paiement
      if (formData.statut === 'payee' && sanction.statut !== 'payee') {
        updateData.date_paiement = new Date().toISOString().split('T')[0]
      }

      // Si on annule le paiement, supprimer la date de paiement
      if (formData.statut !== 'payee' && sanction.statut === 'payee') {
        updateData.date_paiement = null
      }

      const { error } = await sanctions.update(sanction.id, updateData)
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la modification de la sanction')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !sanction) return null

  const membre = membres.find(m => m.id === sanction.membre_id)
  const typeSanction = typesSanctions.find(t => t.id === sanction.type_sanction_id)

  const getCategorieLabel = (categorie: string) => {
    const labels = {
      reunion: 'Réunion',
      sport_e2d: 'Sport E2D',
      sport_phoenix: 'Sport Phoenix',
      disciplinaire: 'Disciplinaire'
    }
    return labels[categorie as keyof typeof labels] || categorie
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier la sanction
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
            <strong>Membre :</strong> {membre?.prenom} {membre?.nom}<br />
            <strong>Type :</strong> {typeSanction?.nom}<br />
            <strong>Catégorie :</strong> {getCategorieLabel(typeSanction?.categorie || '')}<br />
            <strong>Date :</strong> {new Date(sanction.date_sanction).toLocaleDateString('fr-FR')}<br />
            <strong>Type :</strong> {sanction.automatique ? 'Automatique' : 'Manuelle'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          <div>
            <label className="form-label">Motif</label>
            <textarea
              className="form-input"
              rows={3}
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              placeholder="Précisions sur la sanction..."
            />
          </div>

          <div>
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
            >
              <option value="impayee">Impayée</option>
              <option value="payee">Payée</option>
              <option value="annulee">Annulée</option>
            </select>
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