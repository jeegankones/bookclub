<template>
  <div class="card max-w-2xl mx-auto shadow-lg bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">Submit a book</h2>
      <input
        type="search"
        ref="bookInput"
        placeholder="Search"
        class="input w-full"
        @input="handleInput($event.target.value)"
      />
      <ul>
        <li v-for="result in results" class="card bg-base-100 my-2">
          <div class="card-body p-3">
            <div class="flex flex-row gap-3 items-center">
              <div
                v-if="result.volumeInfo.imageLinks"
                class="flex-none w-12 md:w-16 rounded overflow-hidden"
              >
                <img
                  :src="result.volumeInfo.imageLinks.smallThumbnail"
                  alt="Book cover"
                />
              </div>
              <div class="min-w-0">
                <h3 class="text-sm md:text-base">
                  {{ result.volumeInfo.title }}
                </h3>
                <p
                  v-if="result.volumeInfo.authors"
                  class="text-sm md:text-base text-gray-400"
                >
                  {{ result.volumeInfo.authors[0] }}
                </p>
                <p class="mt-1 text-xs md:text-sm text-gray-400">
                  <span v-if="result.volumeInfo.publishedDate">{{
                    formatDateYear(result.volumeInfo.publishedDate)
                  }}</span>
                  <span v-if="result.volumeInfo.pageCount"
                    >{{
                      result.volumeInfo.publishedDate
                        ? `, ${result.volumeInfo.pageCount}`
                        : result.volumeInfo.pageCount
                    }}
                    pages
                  </span>
                </p>
                <p class="text-xs text-gray-400"></p>
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
            <div
              v-if="result.volumeInfo.description"
              class="collapse collapse-arrow rounded-box mt-1"
            >
              <input type="checkbox" class="min-h-8" />
              <div
                class="collapse-title min-h-8 p-0 flex items-center font-bold text-sm"
              >
                Description
              </div>
              <div class="collapse-content p-0">
                <p class="text-sm text-gray-400">
                  {{ result.volumeInfo.description }}
                </p>
              </div>
            </div>
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
import { useBookList } from '../stores/useBookList';
import { useAlert } from '../stores/useAlert';

const bookInput = ref(null);
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
  return (
    book.loading ||
    submittedBookIds.value.includes(book.id) ||
    useBookList?.currentlyReading?.google_id === book.id
  );
};

const submitBook = async (book) => {
  bookInput.value.focus();
  const result = results.value.find((result) => result.id === book.id);
  result.loading = true;
  const { data, error } = await supabase
    .from('books')
    .upsert(
      {
        title: book.volumeInfo.title,
        submitted_by: profile.value.id,
        google_id: book.id,
        archived: false,
        ...(book.volumeInfo.publishedDate && {
          published_date: book.volumeInfo.publishedDate,
        }),
        ...(book.volumeInfo.pageCount && {
          page_count: book.volumeInfo.pageCount,
        }),
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
  result.loading = false;
  if (error) {
    useAlert.newAlert();
    return;
  }
  submittedBookIds.value.push(data[0].google_id);
};

const searchBooks = _debounce(async (query) => {
  if (query) {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    results.value = response.data.items.slice(0, 3);
  } else {
    results.value = null;
  }
}, 500);

const handleInput = (input) => {
  const query = input.trim().split(' ').join('+');
  searchBooks(query);
};
</script>
