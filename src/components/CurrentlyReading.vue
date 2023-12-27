<template>
    <Card small>
        <template #title>Currently reading</template>
        <BookCard
            :book="currentlyReading"
            size="lg"
        ></BookCard>
    </Card>
</template>

<script setup>
import { toRef } from 'vue';

import { useBookList } from '../stores/useBookList';
import BookCard from './BookCard.vue';
import Card from './Card.vue';

const currentlyReading = toRef(useBookList, 'currentlyReading');
</script>
