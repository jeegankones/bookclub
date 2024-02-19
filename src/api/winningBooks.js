import { supabase } from '../lib/supabase';

function getMostRecentWinningBook() {
    return supabase
        .from('winning_books')
        .select(`books(*, profiles(id, full_name))`)
        .order('created_at', { ascending: false })
        .limit(1);
}

export { getMostRecentWinningBook };
