import { defineStore } from 'pinia';
import { getSettings } from '../api/settings';
import VotingStartModal from '../components/VoteStartModal.vue';
import { useAlertStore } from './useAlertStore';
import { useModalStore } from './useModalStore';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        voting: false,
    }),
    actions: {
        async fetchSettings() {
            const { data, error } = await getSettings();

            if (error) {
                useAlertStore().newAlert();
                return;
            }

            const settings = data.reduce((object, row) => {
                return (object[row.setting] = row.value);
            }, {});
            this.voting = settings.voting;
        },
        updateVoting(value) {
            this.voting = value;

            if (value) {
                useModalStore().open(VotingStartModal);
            }
        },
    },
});
