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
import { toRaw } from 'vue';
import { supabase } from '../lib/supabase';
import { useAlertStore } from '../stores/useAlertStore';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import ConfirmPickWinnerModal from './ConfirmPickWinnerModal.vue';

defineProps({ voting: Boolean });

const modalStore = useModalStore();
const alertStore = useAlertStore();
const booksStore = useBooksStore();
const { updateVoting } = useSettingsStore();

function confirmPickWinner() {
    modalStore.open(ConfirmPickWinnerModal, {
        hasOkButton: true,
        hasCancelButton: true,
        okButtonCallback: pickWinner,
    });
}

async function pickWinner() {
    const picks = [];
    const bookList = toRaw(booksStore.books);
    bookList.forEach((book) => {
        if (book.voteCount) {
            const numberOfPicks = Math.round(Math.pow(book.voteCount, 1.5));
            for (let i = 0; i < numberOfPicks; i++) {
                picks.push(book);
            }
        }
    });
    if (picks.length === 0) {
        alertStore.newAlert('Could not pick a winner.');
        return;
    }
    const pick = picks[Math.floor(Math.random() * picks.length)];
    updateVoting(false);
    await supabase.from('winning_books').insert({ book_id: pick.id });
}
</script>
