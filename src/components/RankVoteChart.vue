<template>
    <div>
        <div
            v-for="voteRatio in voteRatios"
            :key="voteRatio.weight"
            class="relative my-1 h-2 w-full overflow-hidden rounded"
        >
            <div class="absolute h-full w-full bg-gray-600"></div>
            <div
                class="absolute h-full overflow-hidden rounded transition-width"
                :class="weightColorClasses[voteRatio.weight]"
                :style="{ width: `${voteRatio.ratio * 100}%` }"
            ></div>
        </div>
    </div>
</template>

<script setup>
const weightColorClasses = { 3: 'bg-amber-400', 2: 'bg-slate-400', 1: 'bg-yellow-800' };
defineProps({ voteRatios: { type: Array, required: true } });
</script>
