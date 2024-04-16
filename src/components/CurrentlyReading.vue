<template>
    <Card small>
        <template #title>Currently reading</template>
        <BookCard :book="currentlyReading" size="lg"></BookCard>
    </Card>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useWinningBooksStore } from '../stores/useWinningBooksStore';
import BookCard from './BookCard.vue';
import Card from './Card.vue';

const winningBooksStore = useWinningBooksStore();

const { currentlyReading } = storeToRefs(winningBooksStore);
</script>
