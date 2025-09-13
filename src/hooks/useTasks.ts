
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { toast } from '@/hooks/use-toast';

type Task = Tables<'tasks'>;
type TaskInsert = TablesInsert<'tasks'>;

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      console.log('Fetching tasks from database...');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }
      
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          animals (
            name,
            tag
          )
        `)
        .eq('user_id', user.id)
        .order('status', {
          ascending: false,
          nullsFirst: false,
        })
        .order('due_date', { ascending: true });
        ;
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Tasks fetched successfully:', data?.length || 0, 'tasks');
      return data as (Task & { animals?: { name: string; tag: string | null } })[];
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (task: Omit<TaskInsert, 'user_id'>) => {
      console.log('Creating new task:', task);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User authentication error:', userError);
        throw new Error('Authentication failed');
      }
      
      if (!user) {
        console.error('User not authenticated');
        throw new Error('Not authenticated');
      }

      const taskData = {
        ...task,
        user_id: user.id
      };

      console.log('Task data to insert:', taskData);

      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }
      
      console.log('Task created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success ✅",
        description: "Task created successfully!",
      });
    },
    onError: (error) => {
      console.error('Task creation failed:', error);
      toast({
        title: "Error ❌",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      console.log('Updating task:', id, updates);
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }
      
      console.log('Task updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success ✅",
        description: "Task updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Task update failed:', error);
      toast({
        title: "Error ❌",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting task:', id);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
      
      console.log('Task deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success ✅",
        description: "Task deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Task deletion failed:', error);
      toast({
        title: "Error ❌",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });
};
