<template>
    <Modal v-if="userSession" />
    <Alert />
    <Navbar />
    <div class="mt-28">
        <div
            v-if="!loading"
            class="container mx-auto space-y-5 px-2"
        >
            <AdminBar
                v-if="profile?.role === 'admin'"
                :voting="voting"
            />
            <CurrentlyReading v-if="!voting && booksStore.currentlyReading" />
            <BookInput v-if="!voting && userSession" />
            <VotingBookList v-if="voting && userSession" />
            <BookList v-else />
        </div>
        <div
            v-else
            class="absolute top-0 flex h-screen w-screen items-center justify-center"
        >
            <Spinner size="lg" />
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';
import AdminBar from '../components/AdminBar.vue';
import Alert from '../components/Alert.vue';
import BookInput from '../components/BookInput.vue';
import BookList from '../components/BookList.vue';
import CurrentlyReading from '../components/CurrentlyReading.vue';
import Modal from '../components/Modal.vue';
import Navbar from '../components/Navbar.vue';
import Spinner from '../components/Spinner.vue';
import VotingBookList from '../components/VotingBookList.vue';
import WinningBookModal from '../components/WinningBookModal.vue';
import { profile, setProfile, supabase, userSession } from '../lib/supabase';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { useSettingsStore } from '../stores/useSettingsStore';

let channel;
const loading = ref(null);

const modalStore = useModalStore();
const booksStore = useBooksStore();
const settingsStore = useSettingsStore();

const voting = computed(() => settingsStore.voting);

onBeforeMount(async () => {
    loading.value = true;
    userSession.value = (await supabase.auth.getSession()).data?.session;
    await setProfile();
    await settingsStore.fetchSettings();
});

onMounted(async () => {
    await booksStore.fetchBookList();
    await booksStore.fetchCurrentlyReading();

    channel = supabase
        .channel('home-channel')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'settings' },
            (payload) => {
                if (payload.new.setting === 'voting') {
                    settingsStore.updateVoting(payload.new.value);
                }
            },
        )
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'winning_books' },
            async () => {
                const bookList = toRaw(booksStore.books);
                await booksStore.fetchCurrentlyReading();
                modalStore.open(WinningBookModal, undefined, bookList);
                await supabase.from('books').update({ archived: true }).eq('archived', false);
                await supabase.from('votes').update({ archived: true }).eq('archived', false);
            },
        )
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'books' },
            booksStore.fetchBookList,
        )
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'books' },
            booksStore.fetchBookList,
        )
        .subscribe();
    loading.value = false;
});

onBeforeUnmount(async () => {
    await supabase.removeChannel(channel);
});
</script>
