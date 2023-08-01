import { markRaw, reactive } from 'vue';

export const useModal = reactive({
  isOpen: false,
  view: {},
  actions: [],
  model: null,
  open(view, actions = [], model = null) {
    if (this.isOpen) {
      this.close();
    }
    this.actions = actions;
    this.model = model;
    this.view = markRaw(view);
    this.isOpen = true;
  },
  close() {
    this.isOpen = false;
    this.actions = [];
    this.model = null;
    this.view = {};
  },
});
