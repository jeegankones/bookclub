import { defineStore } from 'pinia';
import { markRaw } from 'vue';

export const useModalStore = defineStore('modal', {
    state: () => ({
        component: null,
        props: {},
        onModalClose: null,
        afterEnter: false,
    }),
    actions: {
        open(component, config) {
            if (this.component) {
                this.close();
            }

            this.component = markRaw(component);

            if (config) {
                const { props, onModalClose } = config;
                this.props = props;
                this.onModalClose = onModalClose;
            }
        },
        close() {
            if (typeof this.onModalClose === 'function') {
                this.onModalClose();
            }
            this.$reset();
        },
    },
});
