<template>
  <div class="card bg-base-200 max-w-2xl mx-auto shadow-lg">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">Currently reading</h2>
      <BookCard :book="currentlyReading" size="lg"></BookCard>
    </div>
  </div>
</template>

<script setup>
import { useBookList } from '../stores/useBookList';
import { toRef } from 'vue';
import BookCard from './BookCard.vue';

const currentlyReading = toRef(useBookList, 'currentlyReading');
</script>
