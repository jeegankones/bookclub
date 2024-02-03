import { defineStore } from 'pinia';
import { markRaw } from 'vue';

export const useModalStore = defineStore('modal', {
    state: () => ({
        isOpen: false,
        view: {},
        actions: [],
        model: null,
        afterEnter: false,
    }),
    actions: {
        open(view, actions = [], model = null) {
            if (this.isOpen) {
                this.close();
            }
            this.view = markRaw(view);
            this.actions = actions;
            this.model = model;
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
            this.view = {};
            this.actions = [];
            this.model = null;
        },
    },
});
