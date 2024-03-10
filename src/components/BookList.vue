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
                <TransitionGroup name="bounce">
                    <BookCard
                        v-for="book in books"
                        :key="book.id"
                        :book="book"
                    >
                        <template #buttons>
                            <button
                                v-if="userRole === 'admin' || userId === book.submitted_by"
                                class="btn btn-sm ml-auto"
                                :disabled="isArchiveLoading(book.id)"
                                @click="booksStore.archiveBook(book.id)"
                            >
                                <Spinner
                                    v-if="isArchiveLoading(book.id)"
                                    size="xs"
                                />
                                <i
                                    v-else
                                    class="far fa-trash-can"
                                ></i>
                            </button>
                        </template>
                    </BookCard>
                </TransitionGroup>
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
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useBooksStore } from '../stores/useBooksStore';
import { useSessionStore } from '../stores/useSessionStore';
import BookCard from './BookCard.vue';
import Spinner from './Spinner.vue';

const booksStore = useBooksStore();
const sessionStore = useSessionStore();

const books = computed(() => booksStore.booksSortedByUpdatedAt);
const { userRole, userId } = storeToRefs(sessionStore);
const { isArchiveLoading } = storeToRefs(booksStore);
</script>
