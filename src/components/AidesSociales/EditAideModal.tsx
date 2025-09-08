import React from 'react'
import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { aidesSociales } from '../../lib/supabase'
import { formatCurrency } from '../../lib/utils'

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
}

interface EditAideModalProps {
  isOpen: boolean
  aide: AideSociale | null
  onClose: () => void
  onSuccess: () => void
  membres: any[]
  typesAides: any[]
}

export function EditAideModal({ isOpen, aide, onClose, onSuccess, membres, typesAides }: EditAideModalProps) {
  const [formData, setFormData] = useState({
    montant: 0,
    motif: '',
    justificatif_url: '',
    statut: 'accordee' as 'accordee' | 'remboursee',
    date_limite_remboursement: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (aide) {
      setFormData({
        montant: aide.montant,
        motif: aide.motif || '',
        justificatif_url: aide.justificatif_url || '',
        statut: aide.statut,
        date_limite_remboursement: aide.date_limite_remboursement || ''
      })
    }
  }, [aide])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aide) return
    
    setLoading(true)
    setError('')

    try {
      const { error } = await aidesSociales.update(aide.id, {
        montant: formData.montant,
        motif: formData.motif || null,
        justificatif_url: formData.justificatif_url || null,
        statut: formData.statut,
        date_limite_remboursement: formData.date_limite_remboursement || null
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la modification de l\'aide')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !aide) return null

  const beneficiaire = membres.find(m => m.id === aide.beneficiaire_id)
  const typeAide = typesAides.find(t => t.id === aide.type_aide_id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier l'aide sociale
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
            <strong>Bénéficiaire :</strong> {beneficiaire?.prenom} {beneficiaire?.nom}<br />
            <strong>Type d'aide :</strong> {typeAide?.nom}<br />
            <strong>Date d'accord :</strong> {new Date(aide.date_aide).toLocaleDateString('fr-FR')}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          <div>
            <label className="form-label">Date limite de remboursement</label>
            <input
              type="date"
              className="form-input"
              value={formData.date_limite_remboursement}
              onChange={(e) => setFormData({ ...formData, date_limite_remboursement: e.target.value })}
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
            <label className="form-label">Justificatif (URL)</label>
            <div className="flex space-x-2">
              <input
                type="url"
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
          </div>

          <div>
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
            >
              <option value="accordee">Accordée</option>
              <option value="remboursee">Remboursée</option>
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