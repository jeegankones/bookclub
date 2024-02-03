import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
    state: () => ({
        show: false,
        message: 'There was an error, please try again.',
    }),
    actions: {
        newAlert(message) {
            if (message) {
                this.message = message;
            }

            this.show = true;

            setTimeout(() => {
                this.show = false;
            }, 5000);
        },
    },
});
