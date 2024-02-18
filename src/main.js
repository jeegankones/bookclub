import './style.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import { setProfile, supabase, userSession } from './lib/supabase';

const pinia = createPinia();

createApp(App).use(pinia).mount('#app');

supabase.auth.onAuthStateChange(async (event, session) => {
    userSession.value = session;
    await setProfile();
});
