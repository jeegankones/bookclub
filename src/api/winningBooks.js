import { supabase } from '../lib/supabase';

function fetchMostRecentWinningBook() {
    return supabase
        .from('winning_books')
        .select(`books(*, profiles(id, full_name))`)
        .order('created_at', { ascending: false })
        .limit(1);
}

function insertWinningBook(bookId) {
    return supabase.from('winning_books').insert({ book_id: bookId });
}

export { fetchMostRecentWinningBook, insertWinningBook };
