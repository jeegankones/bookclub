import { supabase } from '../lib/supabase';

export const fetchBooks = () => {
  return supabase
    .from('books')
    .select('*, profiles (id, full_name)')
    .eq('archived', false)
    .order('updated_at', { ascending: false });
};
