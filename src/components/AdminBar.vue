<template>
  <div class="container mx-auto px-2">
    <div class="card bg-base-200 max-w-7xl mx-auto shadow-md shadow-base-300">
      <div class="card-body p-4">
        <h2 class="card-title mb-2">Admin</h2>
        <div>
          <button
            v-if="voting"
            class="btn btn-sm btn-error mr-2"
            @click="setVoting(false)"
          >
            End voting
          </button>
          <button
            v-else
            class="btn btn-sm btn-success mr-2"
            @click="setVoting(true)"
          >
            Start voting
          </button>
          <button class="btn btn-sm mr-2" @click="pickWinner()">
            Pick a winner
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, toRaw } from 'vue';
import { supabase } from '../lib/supabase';
import { useBookList } from '../stores/useBookList';

const voting = ref(null);
const props = defineProps(['voting']);

onMounted(() => {
  voting.value = props.voting;
});

async function pickWinner() {
  const picks = [];
  const bookList = toRaw(useBookList.bookList);
  bookList.forEach((book) => {
    if (book.voteCount) {
      for (let i = 0; i < book.voteCount; i++) {
        picks.push(book);
      }
    }
  });
  const pick = picks[Math.floor(Math.random() * picks.length)];
  await supabase.from('books').update({ archived: true }).eq('id', pick.id);
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
