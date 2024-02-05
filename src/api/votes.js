import { supabase } from '../lib/supabase';

const archiveVotesByBookId = (bookId) => {
    return supabase
        .from('votes')
        .update({ archived: true })
        .eq('book_id', bookId)
        .eq('archived', false);
};

export { archiveVotesByBookId };
