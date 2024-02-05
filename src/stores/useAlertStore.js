import { defineStore } from 'pinia';

let timer;

export const useAlertStore = defineStore('alert', {
    state: () => ({
        show: false,
        message: 'There was an error.',
    }),
    actions: {
        newAlert(message) {
            if (message) {
                this.message = message;
            }

            this.show = true;

            clearTimeout(timer);
            timer = setTimeout(() => {
                this.show = false;
            }, 5000);
        },
    },
});
