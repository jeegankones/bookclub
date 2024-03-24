<template>
    <div class="container mx-auto">
        <div class="card mx-auto max-w-7xl bg-base-200 shadow-lg">
            <div class="card-body p-4">
                <h2 class="card-title mb-2">Admin</h2>
                <div>
                    <button
                        v-if="!voting"
                        class="btn btn-success mr-2"
                        @click="updateVoting(true)"
                    >
                        Start voting
                    </button>
                    <button
                        v-if="voting"
                        class="btn btn-error mr-2"
                        @click="updateVoting(false)"
                    >
                        Cancel voting
                    </button>
                    <button
                        v-if="voting"
                        class="btn btn-primary mr-2"
                        @click="confirmPickWinner()"
                    >
                        Pick winner
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalStore } from '../stores/useModalStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useVotesStore } from '../stores/useVotesStore';
import ConfirmPickWinnerModal from './ConfirmPickWinnerModal.vue';

defineProps({ voting: Boolean });

const modalStore = useModalStore();
const votesStore = useVotesStore();
const { updateVoting } = useSettingsStore();

function confirmPickWinner() {
    modalStore.open(ConfirmPickWinnerModal, {
        hasOkButton: true,
        hasCancelButton: true,
        okButtonCallback: pickWinner,
    });
}

async function pickWinner() {
    await votesStore.getNewWinningBook();
}
</script>
