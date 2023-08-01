<template>
  <div class="card max-w-7xl mx-auto shadow-lg bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title">Vote</h2>
      <h3 class="mb-2">
        Vote up to {{ voteLimit }} times ({{ voteCount }}/{{ voteLimit }})
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 items-start gap-3">
        <BookCard
          v-for="book in useBookList.bookList"
          :book="book"
          :key="book.id"
          voting
        >
          <template #buttons>
            <div v-if="canVote(book)" class="flex flex-col text-center ml-auto">
              <button
                class="btn btn-sm w-10"
                @click="handleAddVote(book)"
                :disabled="voteCount >= voteLimit"
              >
                <i class="fas fa-plus"></i>
              </button>
              <p class="my-1">{{ book.userVoteCount }}</p>
              <button
                class="btn btn-sm w-10"
                @click="handleRemoveVote(book)"
                :disabled="book.userVoteCount === 0"
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
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { supabase, profile } from '../lib/supabase';
import _debounce from 'lodash/debounce';
import { useAlert } from '../stores/useAlert';
import { useBookList } from '../stores/useBookList';
import BookCard from './BookCard.vue';

const voteCount = ref(0);
const voteLimit = 3;
let channel;

onMounted(async () => {
  await fetchAndUpdateUserVotes();
  await useBookList.updateVoteCounts();

  channel = supabase
    .channel('votes-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'votes' },
      () => {
        useBookList.updateVoteCounts();
      }
    )
    .subscribe();
});

onBeforeUnmount(async () => {
  await supabase.removeChannel(channel);
});

async function fetchAndUpdateUserVotes() {
  const { data: votes } = await supabase
    .from('votes')
    .select('*')
    .eq('archived', false)
    .eq('profile_id', profile.value.id);
  voteCount.value = votes.length;
  useBookList.updateUserVotes(votes);
}

function canVote(book) {
  return (
    profile?.value.role === 'admin' || profile.value.id !== book.submitted_by
  );
}

function insertVote(book) {
  return supabase
    .from('votes')
    .insert({ book_id: book.id, profile_id: profile.value.id });
}

function deleteVote(book) {
  return supabase
    .from('votes')
    .delete()
    .match({ archived: false, book_id: book.id, profile_id: profile.value.id })
    .order('created_at')
    .limit(1);
}

async function handleAddVote(book) {
  book.userVoteCount++;
  voteCount.value++;
  const { error } = await insertVote(book);
  if (error) {
    book.userVoteCount--;
    voteCount.value--;
    useAlert.newAlert();
  }
}

async function handleRemoveVote(book) {
  book.userVoteCount--;
  voteCount.value--;
  const { error } = await deleteVote(book);
  if (error) {
    book.userVoteCount++;
    voteCount.value++;
    useAlert.newAlert();
  }
}
</script>
