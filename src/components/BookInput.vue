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
                                    v-if="isSubmitLoading(result.id)"
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
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { fetchGoogleBooksResults } from '../api/googleBooks';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { formatDateYear } from '../utils/formatDateYear';
import Collapse from './Collapse.vue';
import NoteInputModal from './NoteInputModal.vue';
import Spinner from './Spinner.vue';

const bookInput = ref(null);
const results = ref([]);

const modalStore = useModalStore();
const booksStore = useBooksStore();

const { isSubmitLoading, bookIds, currentlyReading } = storeToRefs(booksStore);

function isButtonDisabled(result) {
    return (
        isSubmitLoading.value(result.id) ||
        bookIds.value.includes(result.id) ||
        currentlyReading.value?.google_id === result.id
    );
}

function openNoteInputModal(result) {
    modalStore.open(NoteInputModal, {
        props: { book: result },
        onModalClose: () => {
            bookInput.value.focus();
        },
    });
}

const searchBooks = _debounce(async (input) => {
    const query = input.trim().split(' ').join('+');
    if (query) {
        const response = await fetchGoogleBooksResults(query);
        results.value = response.data.items;
    }
}, 500);

function handleInput(input) {
    if (!input) {
        results.value = [];
    }

    searchBooks(input);
}
</script>
