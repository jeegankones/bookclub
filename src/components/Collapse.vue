<template>
  <div class="text-sm mt-2" :class="{ 'md:text-lg': size === 'lg' }">
    <button class="flex items-center w-full mb-1" @click="isOpen = !isOpen">
      <slot name="title"></slot>
      <i
        class="fa-solid fa-chevron-down transition-transform ml-auto"
        :class="{ 'fa-rotate-180': isOpen }"
      ></i>
    </button>
    <div v-if="isOpen" class="text-gray-400">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ size: String });
const isOpen = ref(false);
</script>
