<template>
    <div
        class="mt-2 text-sm"
        :class="{ 'md:text-lg': size === 'lg' }"
    >
        <button
            class="flex w-full items-center"
            @click="isOpen = !isOpen"
        >
            {{ title }}
            <i
                class="fa-solid fa-chevron-down ml-auto transition-transform"
                :class="{ 'fa-rotate-180': isOpen }"
            ></i>
        </button>
        <p
            v-if="isOpen"
            class="mt-1 text-gray-400"
        >
            <slot>{{ content }}</slot>
        </p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
    size: { type: String, default: 'md' },
    title: { type: String, required: true },
    content: { type: String, required: true },
});
const isOpen = ref(false);
</script>
