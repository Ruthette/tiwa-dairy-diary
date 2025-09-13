import { observable } from '@legendapp/state'
import { useObservable } from '@legendapp/state/react'
import { persistObservable } from '@legendapp/state/persist'
import { supabase } from '@/integrations/supabase/client'
import { Tables, TablesInsert } from '@/integrations/supabase/types'
import { toast } from '@/components/ui/use-toast'
import { nanoid } from 'nanoid'

type Animal = Tables<'animals'>
type AnimalInsert = TablesInsert<'animals'>

// --------------------
// Observable State
// --------------------
export const animals$ = observable<Animal[]>([])

// --------------------
// Persistence (v2 API)
// --------------------
persistObservable(animals$, {
  local: 'animals', // keep offline cache
  remote: {
    // Fetch from Supabase - correct property name is 'get'
    get: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    // Push changes to Supabase - correct property name is 'set'
    set: async ({ value }: { value: Animal[] }) => {
      const { error } = await supabase
        .from('animals')
        .upsert(value, {
          onConflict: 'id',
          ignoreDuplicates: false,
        })

      if (error) throw error
      return value
    },
  },
  retrySync: true, // retry failed sync when online
})

// --------------------
// Hooks
// --------------------

// Get all animals
export const useAnimals = () => {
  const animalsObs = useObservable(animals$)

  return {
    data: animalsObs.get(),
    isLoading: false,
    refetch: async () => {
      try {
        const { data, error } = await supabase
          .from('animals')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        animals$.set(data || [])
      } catch (error) {
        console.error('Failed to refetch animals:', error)
      }
    },
  }
}

// Get single animal by id
export const useAnimal = (id: string) => {
  const animalsObs = useObservable(animals$)
  const animals = animalsObs.get()

  return {
    data: animals.find(animal => animal.id === id), // Fixed: remove .get() since animal.id is already a string
    isLoading: false,
  };
}

// Create animal
export const useCreateAnimal = () => ({
  mutateAsync: async (animal: Omit<AnimalInsert, 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newAnimal: Animal = {
        id: nanoid(), // offline-first id
        ...animal,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(), // Add this if missing
        deleted_at: null, // Add this if missing
      } as Animal

      animals$.push(newAnimal) // local insert, syncs later

      toast({
        title: 'Success',
        description: 'Animal registered successfully! (syncing in background)',
      })

      return newAnimal
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register animal',
        variant: 'destructive',
      })
      throw error
    }
  },
})

// Update animal
export const useUpdateAnimal = () => ({
  mutateAsync: async ({ id, ...updates }: Partial<Animal> & { id: string }) => {
    try {
      const animals = animals$.get()
      const index = animals.findIndex(a => a.id === id)

      if (index >= 0) {
        animals$[index].assign({
          ...updates,
          updated_at: new Date().toISOString(),
        })
      }

      toast({
        title: 'Success',
        description: 'Animal updated successfully! (syncing in background)',
      })

      return { id, ...updates }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update animal',
        variant: 'destructive',
      })
      throw error
    }
  },
})

// Delete animal
export const useDeleteAnimal = () => ({
  mutateAsync: async (id: string) => {
    try {
      const animals = animals$.get()
      const index = animals.findIndex(a => a.id === id)

      if (index >= 0) {
        animals$.splice(index, 1)
      }

      toast({
        title: 'Success',
        description: 'Animal deleted successfully! (syncing in background)',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete animal',
        variant: 'destructive',
      })
      throw error
    }
  },
})