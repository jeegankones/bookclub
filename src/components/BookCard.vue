<template>
    <div class="card bg-base-100">
        <Transition
            v-if="voting"
            name="bounce"
        >
            <div
                v-if="book.voteCount"
                class="absolute -left-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-error font-bold"
            >
                {{ book.voteCount }}
            </div>
        </Transition>
        <div
            class="card-body p-4"
            :class="{ 'md:p-6': size === 'lg' }"
        >
            <div
                class="flex flex-row items-center gap-4"
                :class="{ 'md:gap-8': size === 'lg' }"
            >
                <div
                    v-if="size === 'lg' && book.thumbnail"
                    class="w-24 flex-none overflow-hidden rounded"
                    :class="{ 'md:w-32': size === 'lg' }"
                >
                    <img
                        class="w-full"
                        :src="book.thumbnail"
                        alt="Book cover"
                    />
                </div>
                <div
                    v-else-if="book.small_thumbnail"
                    class="w-24 flex-none overflow-hidden rounded"
                >
                    <img
                        class="w-full"
                        :src="book.small_thumbnail"
                        alt="Book cover"
                    />
                </div>
                <div>
                    <h3
                        class="text-sm"
                        :class="{ 'md:text-lg': size === 'lg' }"
                    >
                        {{ book.title }}
                    </h3>
                    <p
                        v-if="book.author"
                        class="text-sm text-gray-400"
                        :class="{ 'md:text-lg': size === 'lg' }"
                    >
                        {{ book.author }}
                    </p>
                    <p
                        class="text-sm text-gray-400"
                        :class="{ 'md:text-lg': size === 'lg' }"
                    >
                        <span v-if="book.published_date">{{
                            formatDateYear(book.published_date)
                        }}</span>
                        <span v-if="book.page_count"
                            >{{ book.published_date ? `, ${book.page_count}` : book.page_count }}
                            pages
                        </span>
                    </p>
                    <p
                        v-if="userSession"
                        class="mt-2 text-xs text-gray-400"
                        :class="{ 'md:text-sm': size === 'lg' }"
                    >
                        Submitted by {{ book.profiles.full_name }}
                    </p>
                </div>
                <slot name="buttons"></slot>
            </div>
            <div
                v-if="book.user_note && userSession"
                class="mt-2 text-sm italic text-gray-400"
                :class="{ 'md:text-lg': size === 'lg' }"
            >
                <p>&ldquo;{{ book.user_note }}&rdquo;</p>
                <p>&ndash;&ensp;{{ book.profiles.full_name }}</p>
            </div>
            <Collapse
                v-if="book.description"
                title="Description"
                :content="book.description"
                :size="size"
            />
        </div>
    </div>
</template>

<script setup>
import { userSession } from '../lib/supabase';
import { formatDateYear } from '../utils/formatDateYear';
import Collapse from './Collapse.vue';

defineProps({
    book: { type: Object, default: null },
    size: { type: String, default: 'md' },
    voting: Boolean,
});
</script>
