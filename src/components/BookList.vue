<template>
    <div class="card mx-auto max-w-7xl bg-base-200 shadow-lg">
        <div class="card-body p-4">
            <h2
                class="card-title"
                :class="{ 'mb-2': books.length > 0 }"
            >
                Submitted books
                <span v-if="books.length">({{ books.length }})</span>
            </h2>
            <div
                v-if="books.length > 0"
                class="grid grid-cols-1 items-start gap-3 md:grid-cols-2"
            >
                <BookCard
                    v-for="book in books"
                    :key="book.id"
                    :book="book"
                >
                    <template #buttons>
                        <button
                            v-if="
                                profile?.role === 'admin' ||
                                userSession?.user?.id === book.submitted_by
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
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

import { profile, supabase, userSession } from '../lib/supabase';
import { useBooksStore } from '../stores/useBooksStore';
import BookCard from './BookCard.vue';

const booksStore = useBooksStore();

const books = computed(() => booksStore.books);

async function archiveBook(bookId) {
    await supabase.from('books').update({ archived: true }).eq('id', bookId);
    await supabase
        .from('votes')
        .update({ archived: true })
        .eq('book_id', bookId)
        .eq('archived', false);
}
</script>
