import { defineStore } from 'pinia';
import { deleteVote, fetchUserVotes, insertVote } from '../api/votes';
import { useAlertStore } from './useAlertStore';
import { useBooksStore } from './useBooksStore';
import { useSessionStore } from './useSessionStore';

export const useVotesStore = defineStore('votes', {
    state: () => ({
        userVotes: [],
    }),
    actions: {
        async fetchUserVotes() {
            const sessionStore = useSessionStore();
            const { data, error } = await fetchUserVotes(sessionStore.userId);

            if (error) {
                useAlertStore().newAlert();
                return;
            }

            this.userVotes = data;
            useBooksStore().updateUserVotes(this.userVotes);
        },
        async insertVote(book) {
            const sessionStore = useSessionStore();
            const { error } = await insertVote(book, sessionStore.userId);

            if (error) {
                useAlertStore().newAlert('Could not add vote. Try again.');
                return;
            }

            await this.fetchUserVotes();
        },
        async deleteVote(book) {
            const sessionStore = useSessionStore();
            const { error } = await deleteVote(book, sessionStore.userId);

            if (error) {
                useAlertStore().newAlert('Could not remove vote. Try again.');
                return;
            }

            await this.fetchUserVotes();
        },
    },
});
