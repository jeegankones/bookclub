<template>
    <h2 class="mb-4 font-bold">Submit your book</h2>
    <div class="mb-4 flex flex-row items-center gap-4">
        <div
            v-if="bookInfo.imageLinks"
            class="w-12 flex-none overflow-hidden rounded md:w-16"
        >
            <img
                :src="bookInfo.imageLinks.smallThumbnail"
                alt="Book cover"
            />
        </div>
        <div class="min-w-0">
            <h3 class="text-sm md:text-base">
                {{ bookInfo.title }}
            </h3>
            <p
                v-if="bookInfo.authors"
                class="text-sm text-gray-400 md:text-base"
            >
                {{ bookInfo.authors[0] }}
            </p>
            <p class="mt-1 text-xs text-gray-400 md:text-sm">
                <span v-if="bookInfo.publishedDate">{{
                    formatDateYear(bookInfo.publishedDate)
                }}</span>
                <span v-if="bookInfo.pageCount"
                    >{{ bookInfo.publishedDate ? `, ${bookInfo.pageCount}` : bookInfo.pageCount }}
                    pages
                </span>
            </p>
        </div>
    </div>
    <div class="form-control">
        <label class="label">
            <span class="label-text">Add a note</span>
            <span class="label-text-alt">(Optional)</span>
        </label>
        <textarea
            v-model="userNote"
            class="textarea textarea-bordered h-24"
            placeholder="I picked this book because..."
        ></textarea>
    </div>
    <div class="modal-action">
        <button
            class="btn"
            @click="modalStore.close()"
        >
            Cancel
        </button>
        <button
            class="btn"
            :disabled="isSubmitLoading(book.id)"
            @click="submitBook"
        >
            <Spinner
                v-if="isSubmitLoading(book.id)"
                size="xs"
            />
            <span v-else>Submit</span>
        </button>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { formatDateYear } from '../utils/formatDateYear';
import Spinner from './Spinner.vue';

const modalStore = useModalStore();
const booksStore = useBooksStore();

const props = defineProps({ book: { type: Object, required: true } });

const bookInfo = computed(() => props.book.volumeInfo);
const { isSubmitLoading } = storeToRefs(booksStore);

const userNote = ref('');

async function submitBook() {
    await booksStore.submitBook({ ...props.book, userNote: userNote.value });
}
</script>
