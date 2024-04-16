<template>
    <Modal />
    <Alert />
    <Navbar />
    <div class="mt-28">
        <div
            v-if="!loading"
            class="container mx-auto mb-5 space-y-5 px-2"
        >
            <AdminBar
                v-if="userRole === 'admin'"
                :voting="voting"
            />
            <CurrentlyReading v-if="isCurrentlyReadingVisible" />
            <BookInput v-if="!voting && isLoggedIn" />
            <VotingBookList v-if="voting && isLoggedIn" />
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
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
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
import { supabase } from '../lib/supabase';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';
import { useSessionStore } from '../stores/useSessionStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useVotesStore } from '../stores/useVotesStore';
import { useWinningBooksStore } from '../stores/useWinningBooksStore';

let channel;
const loading = ref(null);

const modalStore = useModalStore();
const booksStore = useBooksStore();
const winningBooksStore = useWinningBooksStore();
const settingsStore = useSettingsStore();
const sessionStore = useSessionStore();
const votesStore = useVotesStore();

const { globalVoteCountByBookId } = storeToRefs(votesStore);
const { books } = storeToRefs(booksStore);
const { currentlyReading } = storeToRefs(winningBooksStore);
const { voting } = storeToRefs(settingsStore);
const { userRole, isLoggedIn } = storeToRefs(sessionStore);

onMounted(async () => {
    loading.value = true;
    await settingsStore.fetchSettings();
    await booksStore.fetchBookList();
    await winningBooksStore.fetchCurrentlyReading();

    channel = supabase
        .channel('home-channel')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'settings' },
            async () => {
                await settingsStore.fetchSettings();
            },
        )
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'winning_books' },
            async () => {
                await winningBooksStore.fetchCurrentlyReading();
                const archiveAll = async () => {
                    await booksStore.archiveActiveBooks();
                    await votesStore.archiveActiveVotes();
                };
                const archiveLocal = async () => {
                    await booksStore.$reset();
                    await votesStore.$reset();
                };
                modalStore.open(WinningBookModal, {
                    componentProps: {
                        bookList: [...books.value],
                        winningBook: currentlyReading,
                        votesByBookId: { ...globalVoteCountByBookId.value },
                    },
                    fullSize: true,
                    onModalClose: userRole.value === 'admin' ? archiveAll : archiveLocal,
                });
            },
        )
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'books' }, async () => {
            await booksStore.fetchBookList();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'books' }, async () => {
            await booksStore.fetchBookList();
        })
        .subscribe();
    loading.value = false;
});

onBeforeUnmount(async () => {
    await supabase.removeChannel(channel);
});

const isCurrentlyReadingVisible = computed(
    () => !voting.value && modalStore.component !== WinningBookModal && currentlyReading.value,
);
</script>
