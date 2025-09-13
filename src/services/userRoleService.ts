
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types/auth';

export const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid "no rows" error
    
    if (error) {
      console.error('Error fetching user role:', error);
      return 'owner'; // Default to owner for all users
    }
    
    return data?.role || 'owner'; // Default to admin if no role found
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'owner';
  }
};
