import { profile, supabase } from '../lib/supabase';

function archiveVotesByBookId(bookId) {
    return supabase
        .from('votes')
        .update({ archived: true })
        .eq('book_id', bookId)
        .eq('archived', false);
}

function fetchUserVotes() {
    return supabase
        .from('votes')
        .select('*')
        .eq('archived', false)
        .eq('profile_id', profile.value.id);
}

function insertVote(book) {
    return supabase.from('votes').insert({ book_id: book.id, profile_id: profile.value.id });
}

function deleteVote(book) {
    return supabase
        .from('votes')
        .delete()
        .match({
            archived: false,
            book_id: book.id,
            profile_id: profile.value.id,
        })
        .order('created_at')
        .limit(1);
}

export { archiveVotesByBookId, deleteVote, fetchUserVotes, insertVote };
