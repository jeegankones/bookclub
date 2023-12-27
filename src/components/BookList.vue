<template>
    <Card>
        <template #title>
            Submitted books
            <span v-if="bookList.length">({{ bookList.length }})</span>
        </template>

        <div
            v-if="bookList.length > 0"
            class="grid grid-cols-1 items-start gap-3 md:grid-cols-2"
        >
            <BookCard
                v-for="book in bookList"
                :key="book.id"
                :book="book"
            >
                <template #buttons>
                    <button
                        v-if="
                            profile?.role === 'admin' || userSession?.user?.id === book.submitted_by
                        "
                        class="btn btn-sm ml-auto"
                        @click="archiveBook(book.id)"
                    >
                        <i class="far fa-trash-can"></i>
                    </button>
                </template>
            </BookCard>
        </div>
        <div
            v-else
            class="my-4 flex justify-center text-gray-400"
        >
            Submit the first book 🙂
        </div>
    </Card>
</template>

<script setup>
import { toRef } from 'vue';

import { profile, supabase, userSession } from '../lib/supabase';
import { useBookList } from '../stores/useBookList';
import BookCard from './BookCard.vue';
import Card from './Card.vue';

const bookList = toRef(useBookList, 'bookList');

async function archiveBook(bookId) {
    await supabase.from('books').update({ archived: true }).eq('id', bookId);
    await supabase
        .from('votes')
        .update({ archived: true })
        .eq('book_id', bookId)
        .eq('archived', false);
}
</script>
