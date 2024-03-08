import { defineStore } from 'pinia';
import { getSettings } from '../api/settings';
import { useAlertStore } from './useAlertStore';

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
                object[row.setting] = row.value;
                return object;
            }, {});
            this.voting = settings.voting;
        },
        updateVoting(value) {
            this.voting = value;
        },
    },
});
