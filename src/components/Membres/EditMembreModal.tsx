import React from 'react'
import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { membres } from '../../lib/supabase'

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
}

interface EditMembreModalProps {
  isOpen: boolean
  membre: Membre | null
  onClose: () => void
  onSuccess: () => void
}

export function EditMembreModal({ isOpen, membre, onClose, onSuccess }: EditMembreModalProps) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    montant_cotisation_mensuelle: 0,
    photo_url: '',
    statut: 'actif' as 'actif' | 'inactif' | 'suspendu'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (membre) {
      setFormData({
        nom: membre.nom,
        prenom: membre.prenom,
        email: membre.email,
        telephone: membre.telephone || '',
        montant_cotisation_mensuelle: membre.montant_cotisation_mensuelle,
        photo_url: membre.photo_url || '',
        statut: membre.statut
      })
    }
  }, [membre])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!membre) return
    
    setLoading(true)
    setError('')

    try {
      const { error } = await membres.update(membre.id, {
        ...formData,
        telephone: formData.telephone || null,
        photo_url: formData.photo_url || null
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la modification du membre')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !membre) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier {membre.prenom} {membre.nom}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Prénom *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Nom *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Téléphone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Cotisation mensuelle (FCFA) *</label>
            <input
              type="number"
              required
              min="0"
              className="form-input"
              value={formData.montant_cotisation_mensuelle}
              onChange={(e) => setFormData({ ...formData, montant_cotisation_mensuelle: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>

          <div>
            <label className="form-label">Photo (URL)</label>
            <div className="flex space-x-2">
              <input
                type="url"
                className="form-input flex-1"
                placeholder="https://exemple.com/photo.jpg"
                value={formData.photo_url}
                onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              />
              <button
                type="button"
                className="btn-secondary px-3"
                title="Télécharger une photo"
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