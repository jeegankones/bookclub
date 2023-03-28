<template>
  <div class="card max-w-7xl mx-auto shadow-md shadow-base-300 bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">
        Submitted books
        <span v-if="bookList">({{ bookList.length }})</span>
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
        <div v-for="book in bookList" :key="book.id" class="card bg-base-100">
          <div class="card-body p-4">
            <div class="flex flex-row gap-4 items-center">
              <div
                v-if="book.small_thumbnail"
                class="flex-none w-24 rounded overflow-hidden"
              >
                <img :src="book.small_thumbnail" alt="Book cover" />
              </div>
              <div>
                <h3 class="text-sm">
                  {{ book.title }}
                </h3>
                <p v-if="book.author" class="text-sm text-gray-400">
                  {{ book.author }}
                </p>
                <p class="text-sm text-gray-400">
                  {{ formatDateYear(book.published_date) }}
                </p>
                <p v-if="userSession" class="text-xs mt-2 text-gray-400">
                  Submitted by {{ book.profiles.full_name }}
                </p>
              </div>
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
            </div>
            <div
              v-if="book.description"
              class="collapse collapse-arrow rounded-box mt-1"
            >
              <input type="checkbox" class="min-h-8" />
              <div
                class="collapse-title min-h-8 p-0 flex items-center font-bold text-sm"
              >
                Description
              </div>
              <div class="collapse-content p-0">
                <p class="text-sm text-gray-400">{{ book.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { supabase, userSession, profile } from '../lib/supabase';
import { fetchBooks } from '../utils/fetchBooks';
import { formatDateYear } from '../utils/formatDateYear';

const bookList = ref(null);
let channel;

onMounted(async () => {
  await updateBookList();

  channel = supabase
    .channel('book-list-change-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'books' },
      updateBookList
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'books' },
      updateBookList
    )
    .subscribe();
});

onBeforeUnmount(async () => {
  await supabase.removeChannel(channel);
});

async function updateBookList() {
  const { data } = await fetchBooks();
  bookList.value = data;
}

async function archiveBook(bookId) {
  await supabase.from('books').update({ archived: true }).eq('id', bookId);
}
</script>
