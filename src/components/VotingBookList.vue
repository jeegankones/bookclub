<template>
    <div class="card mx-auto max-w-7xl bg-base-200 shadow-lg">
        <div class="card-body p-4">
            <div class="mb-2 flex flex-col justify-between sm:flex-row sm:items-end">
                <div :class="{ 'mb-4 sm:mb-0': !areVotesSubmitted }">
                    <h2 class="card-title">Vote</h2>
                    <h3 v-if="!areVotesSubmitted">
                        <span v-if="voteStep"
                            >Choose your
                            <span class="font-bold">{{ voteStep.label }}</span> pick&nbsp;{{
                                voteStep.emoji
                            }}</span
                        >
                        <span v-else>Submit your vote</span>
                    </h3>
                </div>
                <div
                    v-if="!areVotesSubmitted"
                    class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0"
                >
                    <button
                        :disabled="isSubmitLoading || step === 0"
                        class="btn btn-neutral grow"
                        @click="votesStore.deleteVote()"
                    >
                        <span>Back</span>
                    </button>
                    <button
                        class="btn btn-primary grow"
                        :disabled="isSubmitLoading || !canSubmit"
                        @click="openSubmitModal()"
                    >
                        <span>Submit vote{{ step > 1 ? 's' : '' }}</span>
                        <Spinner
                            v-if="isSubmitLoading"
                            size="xs"
                        />
                    </button>
                </div>
            </div>
            <div
                v-if="!isFetchLoading"
                class="grid grid-cols-1 items-start gap-3 md:grid-cols-2"
            >
                <BookCard
                    v-for="book in books"
                    :key="book.id"
                    :book="book"
                    voting
                >
                    <template
                        v-if="canVote(book)"
                        #buttons
                    >
                        <div
                            v-if="getStepByBookId(book.id)"
                            :aria-label="`selected ${getStepByBookId(book.id).label}`"
                            class="flex h-12 items-center border border-transparent px-4 text-3xl sm:h-16 sm:px-6"
                        >
                            {{ getStepByBookId(book.id).emoji }}
                        </div>
                        <button
                            v-else-if="!areVotesSubmitted && voteStep"
                            class="btn text-3xl sm:btn-lg sm:text-3xl"
                            :aria-label="`select ${voteStep.label}`"
                            @click="votesStore.insertVote(book, voteStep.weight)"
                        >
                            <span class="opacity-60">{{ voteStep.emoji }}</span>
                        </button>
                    </template>
                    <template
                        v-if="areVotesSubmitted"
                        #statistics
                    >
                        <RankVoteChart
                            v-if="globalVoteRatiosByBookId[book.id]"
                            :vote-ratios="globalVoteRatiosByBookId[book.id]"
                            class="mb-2"
                        />
                        <div class="px-2 text-center">
                            {{ getPercentOfTotal(book.id) }}%
                            <div class="text-sm text-gray-400">of votes</div>
                        </div>
                    </template>
                </BookCard>
            </div>
            <div
                v-else
                class="flex justify-center p-16"
            >
                <Spinner size="lg" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { supabase } from '../lib/supabase';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useVotesStore } from '../stores/useVotesStore';
import BookCard from './BookCard.vue';
import RankVoteChart from './RankVoteChart.vue';
import Spinner from './Spinner.vue';
import SubmitVoteModal from './SubmitVoteModal.vue';
import VoteStartModal from './VoteStartModal.vue';

const booksStore = useBooksStore();
const votesStore = useVotesStore();
const sessionStore = useSessionStore();
const modalStore = useModalStore();

const voteSteps = {
    0: {
        label: 'first place',
        emoji: '🥇',
        weight: 3,
    },
    1: {
        label: 'second place',
        emoji: '🥈',
        weight: 2,
    },
    2: {
        label: 'third place',
        emoji: '🥉',
        weight: 1,
    },
};

let channel;
const {
    placeByBookId,
    globalVoteRatiosByBookId,
    getPercentOfTotal,
    isSubmitLoading,
    isFetchLoading,
    areVotesSubmitted,
} = storeToRefs(votesStore);
const { booksSortedByUpdatedAt: books } = storeToRefs(booksStore);
const { userRole, userId } = storeToRefs(sessionStore);

const step = computed(() => votesStore.userVotes.length);
const voteStep = computed(() => voteSteps[step.value]);
const canSubmit = computed(() => !areVotesSubmitted.value && step.value > 0);

watch(step, (step) => {
    if (step > 2 && !areVotesSubmitted.value) {
        openSubmitModal();
    }
});

watch(isFetchLoading, (value) => {
    if (!value && !areVotesSubmitted.value) {
        modalStore.open(VoteStartModal, { hasOkButton: true });
    }
});

watch(
    areVotesSubmitted,
    async (value) => {
        if (value) {
            channel = supabase
                .channel('voting-channel')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'votes' },
                    async () => {
                        await votesStore.fetchGlobalVoteCount();
                    },
                )
                .subscribe();
        } else {
            if (channel) {
                await supabase.removeChannel(channel);
            }
        }
    },
    { immediate: true },
);

onMounted(async () => {
    await votesStore.fetchUserVotes();
});

onBeforeUnmount(async () => {
    await supabase.removeChannel(channel);
});

function openSubmitModal() {
    modalStore.open(SubmitVoteModal, {
        hasCancelButton: true,
        hasOkButton: true,
        okButtonText: 'Submit',
        okButtonCallback: () => {
            modalStore.close();
            votesStore.submitVotes();
        },
        componentProps: {
            step,
            voteSteps,
        },
    });
}

function getStepByBookId(id) {
    return voteSteps[placeByBookId.value[id]];
}

function canVote(book) {
    return userRole === 'admin' || userId !== book.submitted_by;
}
</script>
