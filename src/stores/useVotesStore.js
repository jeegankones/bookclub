import cloneDeep from 'lodash/cloneDeep';
import round from 'lodash/round';
import { defineStore } from 'pinia';
import {
    archiveActiveVotes,
    fetchGlobalVoteCount,
    fetchUserVotes,
    insertVotes,
} from '../api/votes';
import { useAlertStore } from './useAlertStore';
import { useSessionStore } from './useSessionStore';
import { useSettingsStore } from './useSettingsStore';
import { useWinningBooksStore } from './useWinningBooksStore';

export const useVotesStore = defineStore('votes', {
    state: () => ({
        userVotes: [],
        globalVotes: [],
        isSubmitLoading: false,
        isFetchLoading: false,
        areVotesSubmitted: false,
    }),
    getters: {
        totalVotes: (state) => {
            return state.globalVotes.reduce((num, vote) => {
                return num + vote.weight;
            }, 0);
        },
        globalVoteCountByBookId: (state) => {
            return state.globalVotes.reduce((obj, vote) => {
                obj[vote.book_id] = (obj[vote.book_id] ?? 0) + vote.weight;
                return obj;
            }, {});
        },
        getPercentOfTotal() {
            return (bookId) => {
                const percent = (this.globalVoteCountByBookId[bookId] / this.totalVotes) * 100 || 0;
                return round(percent, 0);
            };
        },
        globalVoteRatiosByBookId: (state) => {
            let maxVotes = 0;
            const voteCountByWeightByBookId = state.globalVotes.reduce((obj, vote) => {
                obj[vote.book_id] = obj[vote.book_id] ?? {
                    weights: { 3: 0, 2: 0, 1: 0 },
                };
                obj[vote.book_id].weights[vote.weight]++;
                maxVotes = Math.max(maxVotes, obj[vote.book_id].weights[vote.weight]);
                return obj;
            }, {});

            const voteRatioByWeightByBookId = cloneDeep(voteCountByWeightByBookId);
            Object.entries(voteCountByWeightByBookId).forEach(([id, book]) => {
                voteRatioByWeightByBookId[id] = [];

                Object.entries(book.weights).forEach(([weight, count]) => {
                    voteRatioByWeightByBookId[id].push({
                        weight,
                        ratio: count / maxVotes,
                    });
                });

                voteRatioByWeightByBookId[id].sort((a, b) => b.weight - a.weight);
            });

            return voteRatioByWeightByBookId;
        },
        placeByBookId: (state) => {
            return state.userVotes.reduce((obj, vote, index) => {
                obj[vote.book_id] = index;
                return obj;
            }, {});
        },
    },
    actions: {
        async fetchUserVotes() {
            const sessionStore = useSessionStore();

            this.isFetchLoading = true;
            const { data, error } = await fetchUserVotes(sessionStore.userId);

            if (error) {
                this.isFetchLoading = false;
                useAlertStore().newAlert('Could not fetch vote data. Try refreshing the page.');
                return;
            }

            if (data.length === 0) {
                this.areVotesSubmitted = false;
            } else {
                this.userVotes = data;
                this.areVotesSubmitted = true;
                await this.fetchGlobalVoteCount();
            }
            this.isFetchLoading = false;
        },
        async fetchGlobalVoteCount() {
            const { data, error } = await fetchGlobalVoteCount();

            if (error) {
                useAlertStore().newAlert();
                return;
            }

            this.globalVotes = data;
        },
        async getNewWinningBook() {
            const winningBooksStore = useWinningBooksStore();
            const settingsStore = useSettingsStore();

            const picks = [];

            Object.entries(this.globalVoteCountByBookId).forEach(([bookId, voteCount]) => {
                const numberOfPicks = Math.round(Math.pow(voteCount, 1.5));

                for (let i = 0; i < numberOfPicks; i++) {
                    picks.push(bookId);
                }
            });

            if (picks.length === 0) {
                useAlertStore().newAlert('Could not pick a winner.');
                return;
            }

            const winningBookId = picks[Math.floor(Math.random() * picks.length)];
            await winningBooksStore.addWinningBook(winningBookId);
            await settingsStore.updateVoting(false);
        },
        async submitVotes() {
            const sessionStore = useSessionStore();

            this.isSubmitLoading = true;
            const votes = this.userVotes.map((vote) => {
                return { ...vote, profile_id: sessionStore.userId };
            });
            const { error } = await insertVotes(votes);

            if (error) {
                this.isSubmitLoading = false;
                useAlertStore().newAlert('Could not submit votes. Try again.');
                return;
            }

            await this.fetchGlobalVoteCount();
            this.areVotesSubmitted = true;
            this.isSubmitLoading = false;
        },
        async archiveActiveVotes() {
            const { error } = await archiveActiveVotes();

            if (error) {
                useAlertStore().newAlert('Could not archive votes.');
                throw new Error(error.message);
            }
        },
        async insertVote(book, weight) {
            this.userVotes.push({ book_id: book.id, weight });
        },
        async deleteVote() {
            this.userVotes.pop();
        },
    },
    debounce: {
        fetchUserVotes: [250, { leading: true, trailing: false }],
        fetchGlobalVoteCount: [250, { leading: true, trailing: false }],
    },
});
