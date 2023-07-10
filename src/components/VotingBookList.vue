<template>
  <div class="card max-w-7xl mx-auto shadow-lg bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title">Vote</h2>
      <h3 class="mb-2">
        Vote up to {{ voteLimit }} times ({{ voteCount }}/{{ voteLimit }})
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-3">
        <div
          v-for="book in useBookList.bookList"
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
                  <span v-if="book.published_date">{{
                    formatDateYear(book.published_date)
                  }}</span>
                  <span v-if="book.page_count"
                    >{{
                      book.published_date
                        ? `, ${book.page_count}`
                        : book.page_count
                    }}
                    pages
                  </span>
                </p>
                <p v-if="userSession" class="text-xs mt-4 text-gray-400">
                  Submitted by {{ book.profiles.full_name }}
                </p>
              </div>
              <div v-if="canVote(book)" class="flex flex-col text-center">
                <button
                  class="btn btn-sm w-10 ml-auto"
                  @click="handleAddVote(book)"
                  :disabled="voteCount >= voteLimit"
                >
                  <i class="fas fa-plus"></i>
                </button>
                <p class="my-1">{{ book.userVoteCount }}</p>
                <button
                  class="btn btn-sm w-10 ml-auto"
                  @click="handleRemoveVote(book)"
                  :disabled="book.userVoteCount === 0"
                >
                  <i class="fas fa-minus"></i>
                </button>
              </div>
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
import { formatDateYear } from '../utils/formatDateYear';
import _debounce from 'lodash/debounce';
import { useAlert } from '../stores/useAlert';
import { useBookList } from '../stores/useBookList';

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
    profile?.value.role === 'admin' || book.profiles.id !== book.submitted_by
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
