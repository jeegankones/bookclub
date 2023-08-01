<template>
  <Transition>
    <div
      v-if="useAlert.show"
      class="alert alert-error fixed bottom-0 z-50 shadow-lg"
    >
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ useAlert.message }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { useAlert } from '../stores/useAlert';
</script>

<style>
.v-enter-active,
.v-leave-active {
  @apply transition-all;
}

.v-enter-from,
.v-leave-to {
  @apply -bottom-24;
}
</style>
