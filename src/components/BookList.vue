<template>
  <div class="card max-w-7xl mx-auto shadow-lg bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title" :class="{ 'mb-2': bookListRef.length > 0 }">
        Submitted books
        <span v-if="bookListRef.length">({{ bookListRef.length }})</span>
      </h2>
      <div
        v-if="bookListRef.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 items-start gap-3"
      >
        <BookCard v-for="book in bookListRef" :key="book.id" :book="book">
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
      <div v-else class="my-4 flex justify-center text-gray-400">
        Submit the first book 🙂
      </div>
    </div>
  </div>
</template>

<script setup>
import { supabase, userSession, profile } from '../lib/supabase';
import { useBookList } from '../stores/useBookList';
import { toRef } from 'vue';
import BookCard from './BookCard.vue';

const bookListRef = toRef(useBookList, 'bookList');

async function archiveBook(bookId) {
  await supabase.from('books').update({ archived: true }).eq('id', bookId);
  await supabase
    .from('votes')
    .update({ archived: true })
    .eq('book_id', bookId)
    .eq('archived', false);
}
</script>
