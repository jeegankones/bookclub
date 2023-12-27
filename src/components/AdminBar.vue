<template>
    <div class="container mx-auto px-2">
        <Card>
            <template #title>Admin</template>
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
        </Card>
    </div>
</template>

<script setup>
import { toRaw } from 'vue';

import { supabase } from '../lib/supabase';
import { useAlert } from '../stores/useAlert';
import { useBookList } from '../stores/useBookList';
import { useModal } from '../stores/useModal';
import Card from './Card.vue';
import ConfirmPickWinnerModal from './ConfirmPickWinnerModal.vue';

defineProps({ voting: Boolean });

function confirmPickWinner() {
    useModal.open(ConfirmPickWinnerModal, [
        {
            label: 'No',
            callback() {
                useModal.close();
            },
        },
        {
            label: 'Yes',
            async callback() {
                useModal.close();
                await pickWinner();
            },
        },
    ]);
}

async function pickWinner() {
    const picks = [];
    const bookList = toRaw(useBookList.bookList);
    bookList.forEach((book) => {
        if (book.voteCount) {
            const numberOfPicks = Math.round(Math.pow(book.voteCount, 1.5));
            for (let i = 0; i < numberOfPicks; i++) {
                picks.push(book);
            }
        }
    });
    if (picks.length === 0) {
        useAlert.newAlert('Could not pick a winner');
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
