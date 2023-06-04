<template>
  <div class="card bg-base-300 max-w-3xl mx-auto shadow-md shadow-base-300">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">Currently reading</h2>
      <div v-if="currentlyReading" class="card bg-base-200">
        <div class="card-body p-4 md:p-6">
          <div class="flex flex-row gap-4 md:gap-8 items-center">
            <div
              v-if="currentlyReading.thumbnail"
              class="flex-none w-24 md:w-32 rounded overflow-hidden"
            >
              <img :src="currentlyReading.thumbnail" alt="Book cover" />
            </div>
            <div>
              <h3 class="text-sm md:text-lg">
                {{ currentlyReading.title }}
              </h3>
              <p
                v-if="currentlyReading.author"
                class="text-sm md:text-lg text-gray-400"
              >
                {{ currentlyReading.author }}
              </p>
              <p class="text-sm md:text-lg text-gray-400">
                {{ formatDateYear(currentlyReading.published_date) }}
              </p>
              <p
                v-if="userSession"
                class="text-xs md:text-sm mt-2 text-gray-400"
              >
                Submitted by
                {{ currentlyReading.profiles.full_name }}
              </p>
            </div>
          </div>
          <div
            v-if="currentlyReading.description"
            class="collapse collapse-arrow rounded-box mt-1"
          >
            <input type="checkbox" class="min-h-8" />
            <div
              class="collapse-title min-h-8 p-0 flex items-center font-bold text-sm"
            >
              Description
            </div>
            <div class="collapse-content p-0">
              <p class="text-sm text-gray-400">
                {{ currentlyReading.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userSession } from '../lib/supabase';
import { formatDateYear } from '../utils/formatDateYear';
import { useBookList } from '../stores/useBookList';
import { toRef } from 'vue';

const currentlyReading = toRef(useBookList, 'currentlyReading');
</script>
