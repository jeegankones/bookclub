<template>
    <Modal v-if="userSession" />
    <Alert />
    <Navbar />
    <div class="mt-28">
        <AdminBar
            v-if="!loading && profile?.role === 'admin'"
            class="mt-5"
            :voting="voting"
        />
        <div
            v-if="!loading"
            class="container mx-auto px-2"
        >
            <CurrentlyReading
                v-if="!voting && booksStore.currentlyReading"
                class="mt-5"
            />
            <BookInput
                v-if="!voting && userSession"
                class="mt-5"
            />
            <VotingBookList
                v-if="voting && userSession"
                class="mt-5"
            />
            <BookList
                v-else
                class="my-5"
            />
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref, toRaw } from 'vue';

import AdminBar from '../components/AdminBar.vue';
import Alert from '../components/Alert.vue';
import BookInput from '../components/BookInput.vue';
import BookList from '../components/BookList.vue';
import CurrentlyReading from '../components/CurrentlyReading.vue';
import Modal from '../components/Modal.vue';
import Navbar from '../components/Navbar.vue';
import VotingStartModal from '../components/VoteStartModal.vue';
import VotingBookList from '../components/VotingBookList.vue';
import WinningBookModal from '../components/WinningBookModal.vue';
import { profile, setProfile, supabase, userSession } from '../lib/supabase';
import { useBooksStore } from '../stores/useBooksStore';
import { useModalStore } from '../stores/useModalStore';

const voting = ref(null);
const loading = ref(null);
let channel;

const modalStore = useModalStore();
const booksStore = useBooksStore();

onBeforeMount(async () => {
    loading.value = true;
    userSession.value = (await supabase.auth.getSession()).data?.session;
    await setProfile();

    const { data } = await supabase.from('settings').select('value').eq('setting', 'voting');
    voting.value = data[0]?.value;
    loading.value = false;
});

onMounted(async () => {
    await booksStore.updateBookList();
    await booksStore.updateCurrentlyReading();

    channel = supabase
        .channel('home-channel')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'settings' },
            (payload) => {
                if (payload.new.setting === 'voting') {
                    voting.value = payload.new.value;
                    if (voting.value) {
                        modalStore.open(VotingStartModal);
                    }
                }
            },
        )
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'winning_books' },
            async () => {
                const bookList = toRaw(booksStore.books);
                await booksStore.updateCurrentlyReading();
                modalStore.open(WinningBookModal, undefined, bookList);
                await supabase.from('books').update({ archived: true }).eq('archived', false);
                await supabase.from('votes').update({ archived: true }).eq('archived', false);
            },
        )
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'books' }, () => {
            booksStore.updateBookList();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'books' }, () => {
            booksStore.updateBookList();
        })
        .subscribe();
});

onBeforeUnmount(async () => {
    await supabase.removeChannel(channel);
});
</script>
