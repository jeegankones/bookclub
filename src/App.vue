<template>
    <Home />
</template>

<script setup>
import { onMounted } from 'vue';
import { supabase } from './lib/supabase';
import Home from './pages/Home.vue';
import { useSessionStore } from './stores/useSessionStore';

const sessionStore = useSessionStore();

onMounted(async () => {
    const { data } = await supabase.auth.getSession();
    sessionStore.setSession(data.session);

    supabase.auth.onAuthStateChange((event, session) => {
        sessionStore.setSession(session);
    });
});
</script>
