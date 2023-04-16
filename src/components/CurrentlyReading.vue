<template>
  <div class="card bg-base-200 max-w-7xl mx-auto shadow-md shadow-base-300">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">Currently reading</h2>
      <div v-if="useBookList.currentlyReading" class="card bg-base-100">
        <div class="card-body p-4">
          <div class="flex flex-row gap-4 items-center">
            <div
              v-if="useBookList.currentlyReading.small_thumbnail"
              class="flex-none w-24 rounded overflow-hidden"
            >
              <img
                :src="useBookList.currentlyReading.small_thumbnail"
                alt="Book cover"
              />
            </div>
            <div>
              <h3 class="text-sm">
                {{ useBookList.currentlyReading.title }}
              </h3>
              <p
                v-if="useBookList.currentlyReading.author"
                class="text-sm text-gray-400"
              >
                {{ useBookList.currentlyReading.author }}
              </p>
              <p class="text-sm text-gray-400">
                {{
                  formatDateYear(useBookList.currentlyReading.published_date)
                }}
              </p>
              <p v-if="userSession" class="text-xs mt-2 text-gray-400">
                Submitted by
                {{ useBookList.currentlyReading.profiles.full_name }}
              </p>
            </div>
          </div>
          <div
            v-if="useBookList.currentlyReading.description"
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
                {{ useBookList.currentlyReading.description }}
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
</script>
