<template>
  <div class="container mx-auto px-2">
    <div class="card bg-base-200 max-w-7xl mx-auto shadow-lg">
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
import { ref, onMounted, toRaw } from 'vue';
import { supabase } from '../lib/supabase';
import { useBookList } from '../stores/useBookList';
import { useModal } from '../stores/useModal';
import { useAlert } from '../stores/useAlert';
import ConfirmPickWinnerModal from './ConfirmPickWinnerModal.vue';

const voting = ref(null);
const props = defineProps(['voting']);

onMounted(() => {
  voting.value = props.voting;
});

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
    useModal.close();
    useAlert.newAlert('Could not pick a winner');
    return;
  }
  const pick = picks[Math.floor(Math.random() * picks.length)];
  await setVoting(false);
  useModal.close();
  await supabase.from('books').update({ archived: true }).eq('archived', false);
  await supabase.from('votes').update({ archived: true }).eq('archived', false);
  await supabase.from('winning_books').insert({ book_id: pick.id });
}

async function setVoting(value) {
  const { data, error } = await supabase
    .from('settings')
    .update({ value })
    .eq('setting', 'voting')
    .select('value');
  voting.value = data[0].value;
}
</script>
