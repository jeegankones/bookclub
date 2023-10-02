<template>
    <div class="card mx-auto max-w-2xl bg-base-200 shadow-lg">
        <div class="card-body p-4">
            <h2 class="card-title mb-2">Submit a book</h2>
            <input
                ref="bookInput"
                type="search"
                placeholder="Search"
                class="input w-full"
                @input="handleInput($event.target.value)"
            />
            <ul>
                <li
                    v-for="result in results"
                    :key="result.id"
                    class="card my-2 bg-base-100"
                >
                    <div class="card-body p-3 md:p-4">
                        <div class="flex flex-row items-center gap-3 md:gap-4">
                            <div
                                v-if="result.volumeInfo.imageLinks"
                                class="w-12 flex-none overflow-hidden rounded md:w-16"
                            >
                                <img
                                    class="w-full"
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
                                    class="text-sm text-gray-400 md:text-base"
                                >
                                    {{ result.volumeInfo.authors[0] }}
                                </p>
                                <p class="mt-1 text-xs text-gray-400 md:text-sm">
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
                            </div>
                            <button
                                class="btn btn-sm ml-auto"
                                :disabled="isButtonDisabled(result)"
                                @click="openNoteInputModal(result)"
                            >
                                <Spinner
                                    v-if="result.loading"
                                    size="xs"
                                />
                                <i
                                    v-else
                                    class="far fa-plus"
                                ></i>
                            </button>
                        </div>
                        <Collapse
                            v-if="result.volumeInfo.description"
                            title="Description"
                            :content="result.volumeInfo.description"
                        />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import _debounce from 'lodash/debounce';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { getBooks } from '../api/googleBooks';
import { profile, supabase } from '../lib/supabase';
import { useAlert } from '../stores/useAlert';
import { useBookList } from '../stores/useBookList';
import { useModal } from '../stores/useModal';
import { formatDateYear } from '../utils/formatDateYear';
import Collapse from './Collapse.vue';
import NoteInputModal from './NoteInputModal.vue';
import Spinner from './Spinner.vue';

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
            syncGoogleIds,
        )
        .subscribe();
});

onBeforeUnmount(async () => {
    await supabase.removeChannel(channel);
});

const syncGoogleIds = async () => {
    let { data: books } = await supabase.from('books').select('google_id').eq('archived', false);
    submittedBookIds.value = books.map((book) => book.google_id);
};

const isButtonDisabled = (book) => {
    return (
        book.loading ||
        submittedBookIds.value.includes(book.id) ||
        useBookList?.currentlyReading?.google_id === book.id
    );
};

function openNoteInputModal(book) {
    useModal.open(
        NoteInputModal,
        [
            {
                label: 'Cancel',
                callback() {
                    useModal.close();
                },
            },
            {
                label: 'Submit',
                callback() {
                    submitBook(useModal.model);
                    useModal.close();
                },
            },
        ],
        book,
    );
}

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
        const response = await getBooks(query);
        results.value = response.data.items;
    } else {
        results.value = null;
    }
}, 500);

const handleInput = (input) => {
    const query = input.trim().split(' ').join('+');
    searchBooks(query);
};
</script>
