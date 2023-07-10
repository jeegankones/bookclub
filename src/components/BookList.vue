<template>
  <div class="card max-w-7xl mx-auto shadow-lg bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title" :class="{ 'mb-2': bookListRef.length > 0 }">
        Submitted books
        <span v-if="bookListRef.length">({{ bookListRef.length }})</span>
      </h2>
      <div
        v-if="bookListRef.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 items-center gap-3"
      >
        <div
          v-for="book in bookListRef"
          :key="book.id"
          class="card bg-base-100"
        >
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
                  <span v-if="book.published_date">{{
                    formatDateYear(book.published_date)
                  }}</span>
                  <span v-if="book.page_count"
                    >{{
                      book.published_date
                        ? `, ${book.page_count}`
                        : book.page_count
                    }}
                    pages
                  </span>
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
      <div v-else class="my-4 flex justify-center text-gray-400">
        Submit the first book 🙂
      </div>
    </div>
  </div>
</template>

<script setup>
import { supabase, userSession, profile } from '../lib/supabase';
import { formatDateYear } from '../utils/formatDateYear';
import { useBookList } from '../stores/useBookList';
import { toRef } from 'vue';

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
