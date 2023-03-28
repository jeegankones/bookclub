import { reactive } from 'vue';

export const alertStore = reactive({
  show: false,
  message: 'There was an error, please try again.',
  newAlert(message) {
    if (message) {
      this.message = message;
    }
    this.show = true;

    setTimeout(() => {
      this.show = false;
    }, 5000);
  },
});
