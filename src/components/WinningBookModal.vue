<template>
    <h2 class="mb-4 font-bold">And the winner is...</h2>
    <WinnerWheel
        v-if="showWheel && currentlyReading"
        :book-data="modelValue"
        :winning-book="currentlyReading"
        @close="showWheel = false"
    />
    <div
        v-else-if="currentlyReading"
        class="flex flex-col items-center text-center"
    >
        <p class="mb-2 text-2xl font-bold">
            {{ currentlyReading.title }}
        </p>
        <p v-if="currentlyReading.author">By {{ currentlyReading.author }}</p>
        <img
            v-if="currentlyReading.thumbnail"
            class="my-6 w-36 md:w-60"
            :src="currentlyReading.thumbnail"
            alt="currentlyReading cover"
        />
        <p class="text-gray-400">Submitted by {{ currentlyReading.profiles.full_name }}</p>
    </div>
    <div
        v-else
        class="flex justify-center"
    >
        <Spinner />
    </div>
</template>

<script setup>
import { ref, toRef } from 'vue';

import { useBookList } from '../stores/useBookList';
import Spinner from './Spinner.vue';
import WinnerWheel from './WinnerWheel.vue';

// Props
defineProps({
    modelValue: { type: Array, required: true },
});

// Data
const currentlyReading = toRef(useBookList, 'currentlyReading');
const showWheel = ref(true);
</script>
