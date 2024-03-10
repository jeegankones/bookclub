<template>
    <Teleport to="body">
        <Transition>
            <div
                v-if="alertStore.show"
                class="alert alert-error fixed bottom-0 z-50 shadow-lg"
            >
                <i class="fa-solid fa-circle-exclamation"></i>
                <span>{{ alertStore.message }}</span>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { useAlertStore } from '../stores/useAlertStore';
const alertStore = useAlertStore();
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
