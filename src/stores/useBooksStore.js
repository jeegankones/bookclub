import { defineStore } from 'pinia';

import { archiveBook, getActiveBooksWithProfiles, submitBook } from '../api/books';
import { archiveVotesByBookId } from '../api/votes';
import { getMostRecentWinningBook } from '../api/winningBooks';
import { supabase } from '../lib/supabase';
import { useAlertStore } from '../stores/useAlertStore';

export const useBooksStore = defineStore('books', {
    state: () => ({
        books: [],
        currentlyReading: null,
    }),
    getters: {
        booksSortedByUpdatedAt: (state) => {
            return state.books.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        },
        bookIds: (state) => {
            return state.books.map((book) => book.google_id);
        },
    },
    actions: {
        async fetchCurrentlyReading() {
            const alertStore = useAlertStore();
            const { data, error } = await getMostRecentWinningBook();

            if (error) {
                alertStore.newAlert('Could not fetch current book. Try refreshing the page.');
                return;
            }

            this.currentlyReading = data[0]?.books;
        },
        async fetchBookList() {
            const alertStore = useAlertStore();
            const { data, error } = await getActiveBooksWithProfiles();

            if (error) {
                alertStore.newAlert('Could not fetch books. Try refreshing the page.');
                return;
            }

            this.books = data;
        },
        async archiveBook(id) {
            const alertStore = useAlertStore();
            const book = this.books.find((book) => book.id === id);
            book.archiveLoading = true;
            const { error } = await archiveBook(id);

            if (error) {
                book.archiveLoading = false;
                alertStore.newAlert('Could not archive book. Try again.');
                return;
            }

            await archiveVotesByBookId(id);
        },
        async submitBook(book) {
            const alertStore = useAlertStore();
            const { error } = await submitBook(book);

            if (error) {
                alertStore.newAlert('Could not submit book. Try again.');
                return;
            }
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
            const alertStore = useAlertStore();
            const { data: globalVoteCounts, error } = await supabase.rpc(
                'count_votes_group_by_book_id',
            );

            if (error) {
                alertStore.newAlert();
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
