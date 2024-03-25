<template>
    <h2 class="mb-4 font-bold">And the winner is...</h2>
    <WinnerWheel
        v-if="showWheel && winningBook"
        :book-list="bookList"
        :winning-book="winningBook"
        :votes-by-book-id="votesByBookId"
        @close="showWheel = false"
    />
    <div
        v-else-if="winningBook"
        class="flex flex-col items-center text-center"
    >
        <p class="mb-2 text-2xl font-bold">
            {{ winningBook.title }}
        </p>
        <p v-if="winningBook.author">By {{ winningBook.author }}</p>
        <img
            v-if="winningBook.thumbnail"
            class="my-6 w-36 md:w-60"
            :src="winningBook.thumbnail"
            alt="winningBook cover"
        />
        <p class="text-gray-400">Submitted by {{ winningBook.profiles.full_name }}</p>
    </div>
    <div
        v-else
        class="flex justify-center"
    >
        <Spinner />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Spinner from './Spinner.vue';
import WinnerWheel from './WinnerWheel.vue';

defineProps({
    bookList: { type: Array, required: true },
    winningBook: { type: Object, required: true },
    votesByBookId: { type: Object, required: true },
});

const showWheel = ref(true);
</script>
