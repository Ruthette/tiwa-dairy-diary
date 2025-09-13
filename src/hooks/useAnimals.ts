
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

type Animal = Tables<'animals'>;
type AnimalInsert = TablesInsert<'animals'>;

export const useAnimals = () => {
  return useQuery({
    queryKey: ['animals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Animal[];
    },
  });
};

export const useAnimal = (id: string) => {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Animal;
    },
    enabled: !!id,
  });
};

export const useCreateAnimal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (animal: Omit<AnimalInsert, 'user_id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('animals')
        .insert({ ...animal, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      toast({
        title: "Success",
        description: "Cow registered successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAnimal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Animal> & { id: string }) => {
      const { data, error } = await supabase
        .from('animals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      toast({
        title: "Success",
        description: "Cow updated successfully!",
      });
    },
  });
};