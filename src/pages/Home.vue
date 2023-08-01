<template>
  <Modal />
  <Alert />
  <Navbar />
  <div class="mt-28">
    <AdminBar
      v-if="!loading && profile?.role === 'admin'"
      class="mt-5"
      :voting="voting"
    />
    <div v-if="!loading" class="container mx-auto px-2">
      <CurrentlyReading
        v-if="!voting && useBookList.currentlyReading"
        class="mt-5"
      />
      <BookInput v-if="!voting && userSession" class="mt-5" />
      <VotingBookList v-if="voting && userSession" class="mt-5" />
      <BookList v-else class="my-5" />
    </div>
  </div>
</template>

<script setup>
import BookList from '../components/BookList.vue';
import BookInput from '../components/BookInput.vue';
import Navbar from '../components/Navbar.vue';
import AdminBar from '../components/AdminBar.vue';
import { setProfile, supabase, userSession, profile } from '../lib/supabase';
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue';
import VotingBookList from '../components/VotingBookList.vue';
import Alert from '../components/Alert.vue';
import Modal from '../components/Modal.vue';
import VotingStartModal from '../components/VoteStartModal.vue';
import { useModal } from '../stores/useModal';
import { useBookList } from '../stores/useBookList';
import WinningBookModal from '../components/WinningBookModal.vue';
import CurrentlyReading from '../components/CurrentlyReading.vue';

const voting = ref(null);
const loading = ref(null);
let channel;

onBeforeMount(async () => {
  loading.value = true;
  userSession.value = (await supabase.auth.getSession()).data?.session;
  await setProfile();

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('setting', 'voting');
  voting.value = data[0]?.value;
  loading.value = false;
});

onMounted(async () => {
  await useBookList.updateBookList();
  await useBookList.updateCurrentlyReading();

  channel = supabase
    .channel('home-channel')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'settings' },
      (payload) => {
        if (payload.new.setting === 'voting') {
          voting.value = payload.new.value;
          if (voting.value) {
            useModal.open(VotingStartModal);
          }
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'winning_books' },
      async () => {
        await useBookList.updateCurrentlyReading();
        useModal.open(WinningBookModal);
      }
    )
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'books' },
      () => {
        useBookList.updateBookList();
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'books' },
      () => {
        useBookList.updateBookList();
      }
    )
    .subscribe();
});

onBeforeUnmount(async () => {
  await supabase.removeChannel(channel);
});
</script>
