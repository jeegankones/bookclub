import { defineStore } from 'pinia';
import {
    archiveActiveBooks,
    archiveBook,
    getActiveBooksWithProfiles,
    submitBook,
} from '../api/books';
import { archiveVotesByBookId } from '../api/votes';
import { useAlertStore } from '../stores/useAlertStore';
import { useModalStore } from './useModalStore';
import { useSessionStore } from './useSessionStore';

export const useBooksStore = defineStore('books', {
    state: () => ({
        books: [],
        loadingStates: {},
    }),
    getters: {
        isSubmitLoading: (state) => {
            return (id) => state.loadingStates[id] === 'submit';
        },
        isArchiveLoading: (state) => {
            return (id) => state.loadingStates[id] === 'archive';
        },
        booksSortedByUpdatedAt: (state) => {
            return state.books.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        },
        bookIds: (state) => {
            return state.books.map((book) => book.google_id);
        },
    },
    actions: {
        async fetchBookList() {
            const { data, error } = await getActiveBooksWithProfiles();

            if (error) {
                useAlertStore().newAlert('Could not fetch books. Try refreshing the page.');
                return;
            }

            this.books = data;
        },
        async archiveBook(id) {
            this.loadingStates[id] = 'archive';

            const { error } = await archiveBook(id);
            const { error: archiveError } = await archiveVotesByBookId(id);

            if (error || archiveError) {
                useAlertStore().newAlert('Could not archive book. Try again.');
                this.loadingStates[id] = null;
                return;
            }

            this.loadingStates[id] = null;
        },
        async submitBook(book) {
            const sessionStore = useSessionStore();
            const modalStore = useModalStore();

            this.loadingStates[book.id] = 'submit';
            const { error } = await submitBook(book, sessionStore.userId);

            if (error) {
                useAlertStore().newAlert('Could not submit book. Try again.');
                this.loadingStates[book.id] = null;
                return;
            }

            await modalStore.close();
            this.loadingStates[book.id] = null;
        },
        async archiveActiveBooks() {
            const { error } = await archiveActiveBooks();

            if (error) {
                useAlertStore().newAlert();
                throw new Error(error.message);
            }
        },
    },
    debounce: {
        fetchBookList: [250, { leading: true, trailing: false }],
    },
});
