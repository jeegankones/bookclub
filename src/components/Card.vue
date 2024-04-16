<template>
    <div class="card mx-auto bg-base-200 shadow-lg" :class="[small ? 'max-w-2xl' : 'max-w-7xl']">
        <div class="card-body p-4">
            <div v-if="$slots.title" class="card-title">
                <slot name="title"></slot>
            </div>
            <h2 v-else-if="title" class="card-title mb-2">
                {{ title }}
            </h2>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
defineProps({ small: { type: Boolean, default: false }, title: { type: String, default: null } });
</script>
