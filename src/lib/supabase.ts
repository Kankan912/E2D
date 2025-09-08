import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Fonctions utilitaires pour l'authentification
export const auth = {
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Fonctions utilitaires pour les membres
export const membres = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('membres')
      .select(`
        *,
        membres_roles!membres_roles_membre_id_fkey (
          roles (*)
        )
      `)
      .order('nom')
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('membres')
      .select(`
        *,
        membres_roles!membres_roles_membre_id_fkey (
          roles (*)
        )
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  create: async (membre: any) => {
    const { data, error } = await supabase
      .from('membres')
      .insert(membre)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('membres')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les cotisations
export const cotisations = {
  getByPeriod: async (mois: number, annee: number) => {
    const { data, error } = await supabase
      .from('cotisations')
      .select(`
        *,
        membre:membres!membre_id (nom, prenom, photo_url)
      `)
      .eq('mois', mois)
      .eq('annee', annee)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  getByMembre: async (membreId: string) => {
    const { data, error } = await supabase
      .from('cotisations')
      .select('*')
      .eq('membre_id', membreId)
      .order('annee', { ascending: false })
      .order('mois', { ascending: false })
    return { data, error }
  },

  create: async (cotisation: any) => {
    const { data, error } = await supabase
      .from('cotisations')
      .insert(cotisation)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('cotisations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les prêts
export const prets = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('prets')
      .select(`
        *,
        emprunteur:membres!emprunteur_id (nom, prenom)
      `)
      .order('date_pret', { ascending: false })
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('prets')
      .select(`
        *,
        emprunteur:membres!emprunteur_id (nom, prenom, photo_url)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  create: async (pret: any) => {
    const { data, error } = await supabase
      .from('prets')
      .insert(pret)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('prets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les sanctions
export const sanctions = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('sanctions')
      .select(`
        *,
        membre:membres!membre_id (nom, prenom, photo_url),
        type_sanction:types_sanctions!type_sanction_id (nom, categorie, description)
      `)
      .order('date_sanction', { ascending: false })
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('sanctions')
      .select(`
        *,
        membre:membres!membre_id (nom, prenom, photo_url),
        type_sanction:types_sanctions!type_sanction_id (nom, categorie, description)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  getByMembre: async (membreId: string) => {
    const { data, error } = await supabase
      .from('sanctions')
      .select(`
        *,
        type_sanction:types_sanctions!type_sanction_id (nom, categorie, description)
      `)
      .eq('membre_id', membreId)
      .order('date_sanction', { ascending: false })
    return { data, error }
  },

  create: async (sanction: any) => {
    const { data, error } = await supabase
      .from('sanctions')
      .insert(sanction)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('sanctions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les types de sanctions
export const typesSanctions = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('types_sanctions')
      .select('*')
      .eq('actif', true)
      .order('categorie', { ascending: true })
      .order('nom', { ascending: true })
    return { data, error }
  },

  getByCategorie: async (categorie: string) => {
    const { data, error } = await supabase
      .from('types_sanctions')
      .select('*')
      .eq('categorie', categorie)
      .eq('actif', true)
      .order('nom', { ascending: true })
    return { data, error }
  },

  create: async (typeSanction: any) => {
    const { data, error } = await supabase
      .from('types_sanctions')
      .insert(typeSanction)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('types_sanctions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les aides sociales
export const aidesSociales = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('aides_sociales')
      .select(`
        *,
        beneficiaire:membres!beneficiaire_id (nom, prenom, photo_url),
        type_aide:types_aides!type_aide_id (nom, montant_defaut, delai_remboursement_mois, description)
      `)
      .order('date_aide', { ascending: false })
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('aides_sociales')
      .select(`
        *,
        beneficiaire:membres!beneficiaire_id (nom, prenom, photo_url),
        type_aide:types_aides!type_aide_id (nom, montant_defaut, delai_remboursement_mois, description)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  getByMembre: async (membreId: string) => {
    const { data, error } = await supabase
      .from('aides_sociales')
      .select(`
        *,
        type_aide:types_aides!type_aide_id (nom, montant_defaut, delai_remboursement_mois, description)
      `)
      .eq('beneficiaire_id', membreId)
      .order('date_aide', { ascending: false })
    return { data, error }
  },

  create: async (aide: any) => {
    const { data, error } = await supabase
      .from('aides_sociales')
      .insert(aide)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('aides_sociales')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les types d'aides
export const typesAides = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('types_aides')
      .select('*')
      .eq('actif', true)
      .order('nom', { ascending: true })
    return { data, error }
  },

  create: async (typeAide: any) => {
    const { data, error } = await supabase
      .from('types_aides')
      .insert(typeAide)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('types_aides')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les dettes de fond souverain
export const dettesFondSouverain = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('dettes_fond_souverain')
      .select(`
        *,
        membre:membres!membre_id (nom, prenom, photo_url)
      `)
      .order('date_echeance', { ascending: true })
    return { data, error }
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('dettes_fond_souverain')
      .select(`
        *,
        membre:membres!membre_id (nom, prenom, photo_url),
        aide_sociale:aides_sociales!aide_sociale_id (*)
      `)
      .eq('id', id)
      .single()
    return { data, error }
  },

  getByMembre: async (membreId: string) => {
    const { data, error } = await supabase
      .from('dettes_fond_souverain')
      .select('*')
      .eq('membre_id', membreId)
      .order('date_echeance', { ascending: true })
    return { data, error }
  },

  create: async (dette: any) => {
    const { data, error } = await supabase
      .from('dettes_fond_souverain')
      .insert(dette)
      .select()
      .single()
    return { data, error }
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('dettes_fond_souverain')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  }
}

// Fonctions utilitaires pour les configurations
export const configurations = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('configurations')
      .select('*')
      .order('categorie', { ascending: true })
    return { data, error }
  },

  getValue: async (cle: string) => {
    const { data, error } = await supabase
      .from('configurations')
      .select('valeur, type_valeur')
      .eq('cle', cle)
      .single()
    
    if (error) return { data: null, error }
    
    // Conversion selon le type
    let valeur = data.valeur
    if (data.type_valeur === 'number') {
      valeur = parseFloat(data.valeur)
    } else if (data.type_valeur === 'boolean') {
      valeur = data.valeur === 'true'
    } else if (data.type_valeur === 'json') {
      valeur = JSON.parse(data.valeur)
    }
    
    return { data: valeur, error: null }
  },

  setValue: async (cle: string, valeur: any) => {
    const { data, error } = await supabase
      .from('configurations')
      .update({ 
        valeur: valeur.toString(),
        updated_at: new Date().toISOString()
      })
      .eq('cle', cle)
      .select()
      .single()
    return { data, error }
  }
}