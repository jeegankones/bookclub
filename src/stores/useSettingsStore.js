import { defineStore } from 'pinia';
import { getSettings, updateSetting } from '../api/settings';
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
        async updateVoting(value) {
            if (value === this.voting) {
                return;
            }

            const { data, error } = await updateSetting('voting', value);

            if (error) {
                useAlertStore().newAlert('Could not update voting setting. Try again.');
                return;
            }

            this.voting = data.find((row) => row.setting === 'voting')?.value;
        },
    },
});
