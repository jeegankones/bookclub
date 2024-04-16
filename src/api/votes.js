import { supabase } from '../lib/supabase';

function archiveVotesByBookId(bookId) {
    return supabase
        .from('votes')
        .update({ archived: true })
        .eq('book_id', bookId)
        .eq('archived', false);
}

function fetchUserVotes(userId) {
    return supabase.from('votes').select('*').eq('archived', false).eq('profile_id', userId);
}

function insertVotes(votes) {
    return supabase.from('votes').insert(votes).select();
}

function fetchGlobalVoteCount() {
    return supabase.from('votes').select('book_id, weight').eq('archived', false);
}

function archiveActiveVotes() {
    return supabase.from('votes').update({ archived: true }).eq('archived', false);
}

export {
    archiveActiveVotes,
    archiveVotesByBookId,
    fetchGlobalVoteCount,
    fetchUserVotes,
    insertVotes,
};
