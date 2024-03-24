<template>
    <h2 class="mb-4 font-bold">Submit your vote</h2>
    <p class="mb-2">Once you submit you cannot change your votes.</p>
    <p
        v-if="step < 3"
        class="mb-2 font-bold"
    >
        You have not selected a choice for {{ incompleteSteps }}.
    </p>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    step: { type: Number, required: true },
    voteSteps: { type: Object, required: true },
});

const incompleteSteps = computed(() => {
    const steps = [];
    for (let i = props.step; i < 3; i++) {
        steps.push(props.voteSteps[i].label);
    }
    return steps.join(' or ');
});
</script>
