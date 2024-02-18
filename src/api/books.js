import { supabase } from '../lib/supabase';

function getActiveBooksWithProfiles() {
    return supabase.from('books').select('*, profiles (id, full_name)').eq('archived', false);
}

function archiveBook(id) {
    return supabase.from('books').update({ archived: true }).eq('id', id);
}

function submitBook(book, userId) {
    return supabase.from('books').upsert(
        {
            title: book.volumeInfo.title,
            submitted_by: userId,
            google_id: book.id,
            archived: false,
            user_note: book.userNote ? book.userNote.trim() : null,
            ...(book.volumeInfo.publishedDate && {
                published_date: book.volumeInfo.publishedDate,
            }),
            ...(book.volumeInfo.pageCount && {
                page_count: book.volumeInfo.pageCount,
            }),
            ...(book.volumeInfo.authors && {
                author: book.volumeInfo.authors[0],
            }),
            ...(book.volumeInfo.description && {
                description: book.volumeInfo.description,
            }),
            ...(book.volumeInfo.imageLinks?.smallThumbnail && {
                small_thumbnail: book.volumeInfo.imageLinks.smallThumbnail,
            }),
            ...(book.volumeInfo.imageLinks?.thumbnail && {
                thumbnail: book.volumeInfo.imageLinks.thumbnail,
            }),
        },
        { onConflict: 'google_id' },
    );
}

export { archiveBook, getActiveBooksWithProfiles, submitBook };
