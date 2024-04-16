import { defineStore } from 'pinia';
import { fetchMostRecentWinningBook, insertWinningBook } from '../api/winningBooks';
import { useAlertStore } from '../stores/useAlertStore';

export const useWinningBooksStore = defineStore('winningBooks', {
    state: () => ({
        currentlyReading: null,
    }),
    actions: {
        async fetchCurrentlyReading() {
            const { data, error } = await fetchMostRecentWinningBook();

            if (error) {
                useAlertStore().newAlert('Could not fetch current book. Try refreshing the page.');
                return;
            }

            this.currentlyReading = data[0]?.books;
        },
        async addWinningBook(bookId) {
            const { error } = await insertWinningBook(bookId);

            if (error) {
                useAlertStore().newAlert('Could not add winning book. Try again.');
                return;
            }
        },
    },
    debounce: {
        fetchCurrentlyReading: [250, { leading: true, trailing: false }],
    },
});
