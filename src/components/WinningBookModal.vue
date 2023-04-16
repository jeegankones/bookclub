<template>
  <h2 class="font-bold mb-4">And the winner is...</h2>
  <div
    v-if="useBookList.currentlyReading"
    class="flex flex-col items-center text-center"
  >
    <h1 class="font-bold mb-2">{{ useBookList.currentlyReading.title }}</h1>
    <p v-if="useBookList.currentlyReading.author" class="mb-4">
      By {{ useBookList.currentlyReading.author }}
    </p>
    <img
      v-if="useBookList.currentlyReading.thumbnail"
      :src="useBookList.currentlyReading.thumbnail"
      alt="useBookList.currentlyReading cover"
    />
  </div>
  <div v-else class="flex justify-center">
    <Spinner />
  </div>
</template>

<script setup>
import Spinner from './Spinner.vue';
import { useBookList } from '../stores/useBookList';
</script>
