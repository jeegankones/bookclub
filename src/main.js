import './style.css';
import { PiniaDebounce } from '@pinia/plugin-debounce';
import debounce from 'lodash/debounce';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

const pinia = createPinia();
pinia.use(PiniaDebounce(debounce));

createApp(App).use(pinia).mount('#app');
