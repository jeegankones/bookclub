<template>
    <h2 class="mb-4 font-bold">Submit your book</h2>
    <div class="mb-4 flex flex-row items-center gap-4">
        <div
            v-if="modelValue.volumeInfo.imageLinks"
            class="w-12 flex-none overflow-hidden rounded md:w-16"
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
                class="text-sm text-gray-400 md:text-base"
            >
                {{ modelValue.volumeInfo.authors[0] }}
            </p>
            <p class="mt-1 text-xs text-gray-400 md:text-sm">
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
            class="textarea textarea-bordered h-24"
            placeholder="I picked this book because..."
            @input="
                $emit('update:modelValue', {
                    ...modelValue,
                    userNote: $event.target.value,
                })
            "
        ></textarea>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatDateYear } from '../utils/formatDateYear';

defineProps({ modelValue: { type: Object, required: true } });
defineEmits(['update:modelValue']);
const note = ref(null);
</script>
