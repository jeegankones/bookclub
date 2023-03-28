<template>
  <div class="card max-w-2xl mx-auto shadow-xl bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">Submit a book</h2>
      <input
        type="search"
        v-model="input"
        placeholder="Search"
        class="input w-full"
        @input="handleInput($event.target.value)"
      />
      <ul>
        <li v-for="result in results" class="card bg-base-100 my-2">
          <div class="card-body p-3 flex flex-row gap-3 items-center">
            <div
              v-if="result.volumeInfo.imageLinks"
              class="flex-none w-12 md:w-16 rounded overflow-hidden"
            >
              <img
                :src="result.volumeInfo.imageLinks.smallThumbnail"
                alt="Book cover"
              />
            </div>
            <div>
              <h3 class="text-sm">
                {{ result.volumeInfo.title }}
              </h3>
              <p v-if="result.volumeInfo.authors" class="text-sm text-gray-400">
                {{ result.volumeInfo.authors[0] }}
              </p>
              <p class="text-xs text-gray-400">
                {{ formatDateYear(result.volumeInfo.publishedDate) }}
              </p>
            </div>
            <button
              class="btn btn-sm ml-auto"
              @click="submitBook(result)"
              :disabled="isButtonDisabled(result)"
            >
              <Spinner v-if="result.loading" size="xs" />
              <i v-else class="far fa-plus"></i>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import _debounce from 'lodash/debounce';
import { profile, supabase } from '../lib/supabase';
import Spinner from './Spinner.vue';
import { formatDateYear } from '../utils/formatDateYear';
import _pull from 'lodash/pull';

const input = ref('');
const results = ref(null);
const submittedBookIds = ref(null);
let channel;

onMounted(async () => {
  await syncGoogleIds();

  channel = supabase
    .channel('book-input-change-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'books' },
      syncGoogleIds
    )
    .subscribe();
});

onBeforeUnmount(async () => {
  await supabase.removeChannel(channel);
});

const syncGoogleIds = async () => {
  let { data: books, error } = await supabase
    .from('books')
    .select('google_id')
    .eq('archived', false);
  submittedBookIds.value = books.map((book) => book.google_id);
};

const isButtonDisabled = (book) => {
  return book.loading || submittedBookIds.value.includes(book.id);
};

const submitBook = async (book) => {
  const result = results.value.find((result) => result.id === book.id);
  result.loading = true;
  const { data, error } = await supabase
    .from('books')
    .upsert(
      {
        title: book.volumeInfo.title,
        submitted_by: profile.value.id,
        google_id: book.id,
        published_date: book.volumeInfo.publishedDate,
        archived: false,
        ...(book.volumeInfo.authors && { author: book.volumeInfo.authors[0] }),
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
      { onConflict: 'google_id' }
    )
    .select('google_id');
  submittedBookIds.value.push(data[0].google_id);
  result.loading = false;
};

const searchBooks = _debounce(async (query) => {
  const response = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=${query}`
  );
  results.value = response.data.items.slice(0, 3);
}, 500);

const handleInput = (input) => {
  const query = input.trim().split(' ').join('+');
  if (query) {
    searchBooks(query);
  } else {
    results.value = null;
  }
};
</script>
