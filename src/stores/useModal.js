import { markRaw, reactive } from 'vue';

export const useModal = reactive({
  isOpen: false,
  view: {},
  actions: [],
  open(view, actions = []) {
    this.isOpen = true;
    this.actions = actions;
    this.view = markRaw(view);
  },
  close() {
    this.isOpen = false;
    this.actions = [];
    this.view = {};
  },
});
