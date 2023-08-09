import './style.css';

import { createApp } from 'vue';

import App from './App.vue';
import { setProfile, supabase, userSession } from './lib/supabase';

createApp(App).mount('#app');

supabase.auth.onAuthStateChange(async (event, session) => {
    userSession.value = session;
    await setProfile();
});
