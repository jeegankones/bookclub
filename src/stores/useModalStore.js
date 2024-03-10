import { defineStore } from 'pinia';
import { markRaw, nextTick } from 'vue';

export const useModalStore = defineStore('modal', {
    state: () => ({
        component: null,
        config: {
            componentProps: null,
            hasOkButton: false,
            hasCancelButton: false,
            okButtonText: 'Ok',
            cancelButtonText: 'Cancel',
            okButtonCallback: null,
            cancelButtonCallback: null,
            onModalClose: null,
        },
        afterEnter: false,
    }),
    getters: {
        componentProps: (state) => state.config.componentProps,
        hasOkButton: (state) => state.config.hasOkButton,
        hasCancelButton: (state) => state.config.hasCancelButton,
        okButtonText: (state) => state.config.okButtonText,
        cancelButtonText: (state) => state.config.cancelButtonText,
        okButtonCallback() {
            return this.config.okButtonCallback ?? this.close;
        },
        cancelButtonCallback() {
            return this.config.cancelButtonCallback ?? this.close;
        },
        onModalClose: (state) => state.config.onModalClose,
    },
    actions: {
        async open(component, config = {}) {
            if (this.component) {
                await this.close();
            }

            this.component = markRaw(component);
            this.config = {
                ...this.config,
                ...config,
            };
        },
        async close() {
            if (typeof this.onModalClose === 'function') {
                this.onModalClose();
            }
            this.$reset();
            await nextTick();
        },
    },
});
