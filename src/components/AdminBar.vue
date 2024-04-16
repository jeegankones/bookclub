<template>
    <div class="container mx-auto">
        <Card title="Admin">
            <div>
                <button v-if="!voting" class="btn btn-success mr-2" @click="updateVoting(true)">
                    Start voting
                </button>
                <button v-if="voting" class="btn btn-error mr-2" @click="updateVoting(false)">
                    Cancel voting
                </button>
                <button v-if="voting" class="btn btn-primary mr-2" @click="confirmPickWinner()">
                    Pick winner
                </button>
            </div>
        </Card>
    </div>
</template>

<script setup>
import { useModalStore } from '../stores/useModalStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useVotesStore } from '../stores/useVotesStore';
import Card from './Card.vue';
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
