<template>
  <h2 class="font-bold mb-4">And the winner is...</h2>
  <div v-if="currentlyReading" class="flex flex-col items-center text-center">
    <p class="font-bold mb-2 text-2xl">
      {{ currentlyReading.title }}
    </p>
    <p v-if="currentlyReading.author" class="mb-4">
      By {{ currentlyReading.author }}
    </p>
    <img
      class="w-36 mb-4"
      v-if="currentlyReading.thumbnail"
      :src="currentlyReading.thumbnail"
      alt="currentlyReading cover"
    />
    <p class="text-gray-400">
      Submitted by {{ currentlyReading.profiles.full_name }}
    </p>
  </div>
  <div v-else class="flex justify-center">
    <Spinner />
  </div>
</template>

<script setup>
import Spinner from './Spinner.vue';
import { useBookList } from '../stores/useBookList';
import { toRef } from 'vue';

const currentlyReading = toRef(useBookList, 'currentlyReading');
</script>
