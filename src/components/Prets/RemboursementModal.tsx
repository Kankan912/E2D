import React from 'react'
import { useState } from 'react'
import { X, CheckCircle, RefreshCw } from 'lucide-react'
import { prets } from '../../lib/supabase'
import { formatCurrency, formatDate } from '../../lib/utils'

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
  emprunteur?: {
    nom: string
    prenom: string
  }
}

interface RemboursementModalProps {
  isOpen: boolean
  pret: Pret | null
  onClose: () => void
  onSuccess: () => void
}

export function RemboursementModal({ isOpen, pret, onClose, onSuccess }: RemboursementModalProps) {
  const [action, setAction] = useState<'rembourser' | 'reconduire' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRembourser = async () => {
    if (!pret) return
    
    setLoading(true)
    setError('')

    try {
      const { error } = await prets.update(pret.id, {
        statut: 'rembourse',
        date_remboursement: new Date().toISOString().split('T')[0]
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors du remboursement')
    } finally {
      setLoading(false)
    }
  }

  const handleReconduire = async () => {
    if (!pret) return
    
    setLoading(true)
    setError('')

    try {
      // Calculer nouvelle échéance (2 mois)
      const nouvelleEcheance = new Date()
      nouvelleEcheance.setMonth(nouvelleEcheance.getMonth() + 2)

      const { error } = await prets.update(pret.id, {
        statut: 'reconduit',
        date_echeance: nouvelleEcheance.toISOString().split('T')[0],
        nombre_reconductions: pret.nombre_reconductions + 1
      })
      
      if (error) throw error
      
      onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message || 'Erreur lors de la reconduction')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !pret) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Gestion du prêt
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

        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Détails du prêt</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><strong>Emprunteur :</strong> {pret.emprunteur?.prenom} {pret.emprunteur?.nom}</div>
            <div><strong>Capital :</strong> {formatCurrency(pret.montant_principal)}</div>
            <div><strong>Intérêts :</strong> {formatCurrency(pret.montant_interet)}</div>
            <div><strong>Total à rembourser :</strong> {formatCurrency(pret.montant_principal + pret.montant_interet)}</div>
            <div><strong>Échéance :</strong> {formatDate(pret.date_echeance)}</div>
            <div><strong>Reconductions :</strong> {pret.nombre_reconductions}</div>
          </div>
        </div>

        {!action && (
          <div className="space-y-3">
            <p className="text-gray-600 mb-4">
              Que souhaitez-vous faire avec ce prêt ?
            </p>
            
            <button
              onClick={() => setAction('rembourser')}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Marquer comme remboursé</span>
            </button>
            
            <button
              onClick={() => setAction('reconduire')}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Reconduire le prêt (2 mois)</span>
            </button>
          </div>
        )}

        {action === 'rembourser' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-3 rounded">
              <p className="text-green-800 text-sm">
                <strong>Remboursement complet</strong><br />
                Le prêt sera marqué comme entièrement remboursé.
                Le montant total de <strong>{formatCurrency(pret.montant_principal + pret.montant_interet)}</strong> sera considéré comme reçu.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setAction(null)}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Retour
              </button>
              <button
                onClick={handleRembourser}
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? 'Traitement...' : 'Confirmer le remboursement'}
              </button>
            </div>
          </div>
        )}

        {action === 'reconduire' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
              <p className="text-yellow-800 text-sm">
                <strong>Reconduction du prêt</strong><br />
                Le prêt sera reconduit pour 2 mois supplémentaires.
                L'emprunteur doit rembourser les intérêts actuels ({formatCurrency(pret.montant_interet)}) 
                et le capital reste dû avec de nouveaux intérêts.
              </p>
            </div>
            
            <div className="text-sm text-gray-600">
              <div><strong>Nouvelle échéance :</strong> {new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</div>
              <div><strong>Nombre de reconductions :</strong> {pret.nombre_reconductions + 1}</div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setAction(null)}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Retour
              </button>
              <button
                onClick={handleReconduire}
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? 'Traitement...' : 'Confirmer la reconduction'}
              </button>
            </div>
          </div>
        )}

        {!action && (
          <div className="mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full btn-secondary"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}