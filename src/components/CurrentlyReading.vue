<template>
    <div class="card mx-auto max-w-2xl bg-base-200 shadow-lg">
        <div class="card-body p-4">
            <h2 class="card-title mb-2">Currently reading</h2>
            <BookCard
                :book="currentlyReading"
                size="lg"
            ></BookCard>
        </div>
    </div>
</template>

<script setup>
import { toRef } from 'vue';

import { useBookList } from '../stores/useBookList';
import BookCard from './BookCard.vue';

const currentlyReading = toRef(useBookList, 'currentlyReading');
</script>
