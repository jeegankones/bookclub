import { supabase } from '../lib/supabase';

const getMostRecentWinningBook = () => {
    return supabase
        .from('winning_books')
        .select(`books(*, profiles(id, full_name))`)
        .order('created_at', { ascending: false })
        .limit(1);
};

export { getMostRecentWinningBook };
