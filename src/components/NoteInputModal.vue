<template>
  <h2 class="font-bold mb-4">Submit your book</h2>
  <div class="flex flex-row gap-4 items-center mb-4">
    <div
      v-if="modelValue.volumeInfo.imageLinks"
      class="flex-none w-12 md:w-16 rounded overflow-hidden"
    >
      <img
        :src="modelValue.volumeInfo.imageLinks.smallThumbnail"
        alt="Book cover"
      />
    </div>
    <div class="min-w-0">
      <h3 class="text-sm md:text-base">
        {{ modelValue.volumeInfo.title }}
      </h3>
      <p
        v-if="modelValue.volumeInfo.authors"
        class="text-sm md:text-base text-gray-400"
      >
        {{ modelValue.volumeInfo.authors[0] }}
      </p>
      <p class="mt-1 text-xs md:text-sm text-gray-400">
        <span v-if="modelValue.volumeInfo.publishedDate">{{
          formatDateYear(modelValue.volumeInfo.publishedDate)
        }}</span>
        <span v-if="modelValue.volumeInfo.pageCount"
          >{{
            modelValue.volumeInfo.publishedDate
              ? `, ${modelValue.volumeInfo.pageCount}`
              : modelValue.volumeInfo.pageCount
          }}
          pages
        </span>
      </p>
    </div>
  </div>
  <div class="form-control">
    <label class="label">
      <span class="label-text">Add a note</span>
      <span class="label-text-alt">(Optional)</span>
    </label>
    <textarea
      ref="note"
      :value="modelValue.userNote"
      @input="
        $emit('update:modelValue', {
          ...modelValue,
          userNote: $event.target.value,
        })
      "
      class="textarea textarea-bordered h-24"
      placeholder="I picked this book because..."
    ></textarea>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatDateYear } from '../utils/formatDateYear';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
const note = ref(null);
</script>
