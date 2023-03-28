<template>
  <Transition>
    <div
      v-if="alertStore.show"
      class="alert alert-error fixed bottom-0 z-50 shadow-lg"
    >
      <div>
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ alertStore.message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { alertStore } from '../stores/alertStore';
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
