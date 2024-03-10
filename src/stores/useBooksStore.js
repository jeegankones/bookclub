import { defineStore } from 'pinia';
import { archiveBook, getActiveBooksWithProfiles, submitBook } from '../api/books';
import { archiveVotesByBookId } from '../api/votes';
import { getMostRecentWinningBook } from '../api/winningBooks';
import { supabase } from '../lib/supabase';
import { useAlertStore } from '../stores/useAlertStore';
import { useModalStore } from './useModalStore';
import { useSessionStore } from './useSessionStore';

export const useBooksStore = defineStore('books', {
    state: () => ({
        books: [],
        currentlyReading: null,
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
        async fetchCurrentlyReading() {
            const { data, error } = await getMostRecentWinningBook();

            if (error) {
                useAlertStore().newAlert('Could not fetch current book. Try refreshing the page.');
                return;
            }

            this.currentlyReading = data[0]?.books;
        },
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

            await this.fetchBookList();
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
            } else {
                modalStore.close();
            }

            await this.fetchBookList();
            this.loadingStates[book.id] = null;
        },
        async updateUserVotes(votes) {
            this.books.map((book) => (book.userVoteCount = 0));

            votes.map((vote) => {
                const bookWithVote = this.books.find((book) => book.id === vote.book_id);

                if (bookWithVote.userVoteCount) {
                    bookWithVote.userVoteCount++;
                } else {
                    bookWithVote.userVoteCount = 1;
                }
            });
        },
        async updateGlobalVoteCounts() {
            const { data: globalVoteCounts, error } = await supabase.rpc(
                'count_votes_group_by_book_id',
            );

            if (error) {
                useAlertStore().newAlert();
                return;
            }

            this.books.forEach((book) => {
                let matchingVoteCount = globalVoteCounts.find(
                    (voteCount) => voteCount.book_id === book.id,
                );

                if (matchingVoteCount) {
                    book.voteCount = matchingVoteCount.vote_count;
                } else {
                    book.voteCount = 0;
                }
            });
        },
    },
});
