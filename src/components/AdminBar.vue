<template>
    <div class="container mx-auto px-2">
        <div class="card mx-auto max-w-7xl bg-base-200 shadow-lg">
            <div class="card-body p-4">
                <h2 class="card-title mb-2">Admin</h2>
                <div>
                    <button
                        v-if="!voting"
                        class="btn btn-success mr-2"
                        @click="setVoting(true)"
                    >
                        Start voting
                    </button>
                    <button
                        v-if="voting"
                        class="btn btn-error mr-2"
                        @click="setVoting(false)"
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
import ConfirmPickWinnerModal from './ConfirmPickWinnerModal.vue';

defineProps({ voting: Boolean });

const modalStore = useModalStore();
const alertStore = useAlertStore();
const booksStore = useBooksStore();

function confirmPickWinner() {
    modalStore.open(ConfirmPickWinnerModal, [
        {
            label: 'No',
            callback() {
                modalStore.close();
            },
        },
        {
            label: 'Yes',
            async callback() {
                modalStore.close();
                await pickWinner();
            },
        },
    ]);
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
    await setVoting(false);
    await supabase.from('winning_books').insert({ book_id: pick.id });
}

async function setVoting(value) {
    await supabase.from('settings').update({ value }).eq('setting', 'voting').select('value');
}
</script>
