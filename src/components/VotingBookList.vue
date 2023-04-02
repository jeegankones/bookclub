<template>
  <div class="card max-w-7xl mx-auto shadow-md shadow-base-300 bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title">Vote</h2>
      <h3 class="mb-2">
        Choose up to {{ voteLimit }} books ({{ voteCount }}/{{ voteLimit }})
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
        <div
          v-for="book in bookList"
          :key="book.id"
          class="card bg-base-100"
          :class="{ 'outline outline-success': book.vote }"
        >
          <Transition name="bounce">
            <div
              v-if="book.voteCount"
              class="absolute flex justify-center items-center -top-1 -left-1 bg-error rounded-full w-8 h-8 font-bold"
            >
              {{ book.voteCount }}
            </div>
          </Transition>
          <div class="card-body p-4">
            <div class="flex flex-row gap-4 items-center">
              <div
                v-if="book.small_thumbnail"
                class="flex-none w-24 rounded overflow-hidden"
              >
                <img :src="book.small_thumbnail" alt="Book cover" />
              </div>
              <div>
                <h3 class="text-sm">
                  {{ book.title }}
                </h3>
                <p v-if="book.author" class="text-sm text-gray-400">
                  {{ book.author }}
                </p>
                <p class="text-sm text-gray-400">
                  {{ formatDateYear(book.published_date) }}
                </p>
                <p v-if="userSession" class="text-xs mt-4 text-gray-400">
                  Submitted by {{ book.profiles.full_name }}
                </p>
              </div>
              <button
                v-if="book.vote"
                class="btn btn-sm w-10 ml-auto"
                @click="handleVote(book)"
                :disabled="book.loading"
              >
                <i class="fas fa-xmark"></i>
              </button>
              <button
                v-else
                class="btn btn-sm w-10 ml-auto"
                @click="handleVote(book)"
                :disabled="book.loading || voteCount >= voteLimit"
              >
                <i class="fas fa-check"></i>
              </button>
            </div>
            <div
              v-if="book.description"
              class="collapse collapse-arrow rounded-box mt-1"
            >
              <input type="checkbox" class="min-h-8" />
              <div
                class="collapse-title min-h-8 p-0 flex items-center font-bold text-sm"
              >
                Description
              </div>
              <div class="collapse-content p-0">
                <p class="text-sm text-gray-400">{{ book.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { supabase, userSession, profile } from '../lib/supabase';
import { fetchBooks } from '../utils/fetchBooks';
import { formatDateYear } from '../utils/formatDateYear';
import _debounce from 'lodash/debounce';
import { useAlert } from '../stores/useAlert';

const bookList = ref(null);
const voteCount = ref(0);
const voteLimit = 3;
let channel;

onMounted(async () => {
  await updateBookList();
  await updateUserVotes();
  await refreshVoteCounts();

  channel = supabase
    .channel('votes-all-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'votes' },
      refreshVoteCounts
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `profile_id=eq.${profile.value.id}`,
      },
      updateUserVotes
    )
    .subscribe();
});

onBeforeUnmount(async () => {
  await supabase.removeChannel(channel);
});

async function updateUserVotes() {
  const { data: votes } = await supabase
    .from('votes')
    .select('*')
    .eq('profile_id', profile.value.id);
  voteCount.value = votes.length;
  votes.map((vote) => {
    bookList.value.find((book) => book.id === vote.book_id).vote = true;
  });
  const voteBookIds = votes.map((vote) => vote.book_id);
  bookList.value
    .filter((book) => !voteBookIds.includes(book.id))
    .map((book) => (book.vote = false));
}

async function refreshVoteCounts() {
  const { data: voteCounts, error } = await supabase.rpc(
    'count_votes_group_by_book_id'
  );

  bookList.value.forEach((book) => {
    let matchingVoteCount = voteCounts.find(
      (voteCount) => voteCount.book_id === book.id
    );
    if (matchingVoteCount) {
      book.voteCount = matchingVoteCount.vote_count;
    } else {
      book.voteCount = 0;
    }
  });
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
    .eq('book_id', book.id)
    .eq('profile_id', profile.value.id);
}

async function handleVote(book) {
  book.vote = !book.vote;
  book.loading = true;
  let error;
  if (book.vote) {
    ({ error } = await insertVote(book));
    if (!error) {
      voteCount.value++;
    }
  } else {
    ({ error } = await deleteVote(book));
    if (!error) {
      voteCount.value--;
    }
  }
  if (error) {
    useAlert.newAlert();
    book.vote = !book.vote;
  }
  book.loading = false;
}

async function updateBookList() {
  const { data } = await fetchBooks();
  bookList.value = data;
}
</script>
