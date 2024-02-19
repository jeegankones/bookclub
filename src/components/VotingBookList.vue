<template>
    <div class="card mx-auto max-w-7xl bg-base-200 shadow-lg">
        <div class="card-body p-4">
            <h2 class="card-title">Vote</h2>
            <h3 class="mb-2">Vote up to {{ voteLimit }} times ({{ voteCount }}/{{ voteLimit }})</h3>
            <div class="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
                <BookCard
                    v-for="book in books"
                    :key="book.id"
                    :book="book"
                    voting
                >
                    <template #buttons>
                        <div
                            v-if="canVote(book)"
                            class="ml-auto flex flex-col text-center"
                        >
                            <button
                                class="btn btn-sm w-10"
                                :disabled="voteCount >= voteLimit"
                                @click="votesStore.insertVote(book)"
                            >
                                <i class="fas fa-plus"></i>
                            </button>
                            <p class="my-1">{{ book.userVoteCount }}</p>
                            <button
                                class="btn btn-sm w-10"
                                :disabled="book.userVoteCount <= 0"
                                @click="votesStore.deleteVote(book)"
                            >
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </template>
                </BookCard>
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { supabase } from '../lib/supabase';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useVotesStore } from '../stores/useVotesStore';
import BookCard from './BookCard.vue';
import VoteStartModal from './VoteStartModal.vue';

const booksStore = useBooksStore();
const votesStore = useVotesStore();
const sessionStore = useSessionStore();
const modalStore = useModalStore();

const voteLimit = 3;
let channel;

const voteCount = computed(() => votesStore.userVotes.length);
const books = computed(() => booksStore.booksSortedByUpdatedAt);
const { userRole, userId } = storeToRefs(sessionStore);

onMounted(async () => {
    modalStore.open(VoteStartModal);
    await votesStore.fetchUserVotes();
    await booksStore.updateGlobalVoteCounts();

    channel = supabase
        .channel('votes-all-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
            booksStore.updateGlobalVoteCounts();
        })
        .subscribe();
});

onBeforeUnmount(async () => {
    await supabase.removeChannel(channel);
});

function canVote(book) {
    return userRole === 'admin' || userId !== book.submitted_by;
}
</script>
