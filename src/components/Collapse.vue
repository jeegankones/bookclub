<template>
  <div class="text-sm mt-2" :class="{ 'md:text-lg': size === 'lg' }">
    <button class="flex items-center w-full" @click="isOpen = !isOpen">
      {{ title }}
      <i
        class="fa-solid fa-chevron-down transition-transform ml-auto"
        :class="{ 'fa-rotate-180': isOpen }"
      ></i>
    </button>
    <p v-if="isOpen" class="text-gray-400 mt-1">
      <slot>{{ content }}</slot>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({ size: String, title: String, content: String });
const isOpen = ref(false);
</script>
