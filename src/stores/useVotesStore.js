import { defineStore } from 'pinia';
import { deleteVote, fetchUserVotes, insertVote } from '../api/votes';
import { useAlertStore } from './useAlertStore';
import { useBooksStore } from './useBooksStore';

export const useVotesStore = defineStore('votes', {
    state: () => ({
        userVotes: [],
    }),
    actions: {
        async fetchUserVotes() {
            const { data, error } = await fetchUserVotes();

            if (error) {
                useAlertStore().newAlert();
                return;
            }

            this.userVotes = data;
            useBooksStore().updateUserVotes(this.userVotes);
        },
        async insertVote(book) {
            const { error } = await insertVote(book);

            if (error) {
                useAlertStore().newAlert('Could not add vote. Try again.');
                return;
            }

            await this.fetchUserVotes();
        },
        async deleteVote(book) {
            const { error } = await deleteVote(book);

            if (error) {
                useAlertStore().newAlert('Could not remove vote. Try again.');
                return;
            }

            await this.fetchUserVotes();
        },
    },
});
