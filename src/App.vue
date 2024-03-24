<template>
    <Home />
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { supabase } from './lib/supabase';
import Home from './pages/Home.vue';
import { useSessionStore } from './stores/useSessionStore';

const sessionStore = useSessionStore();

onMounted(async () => {
    supabase.auth.onAuthStateChange((event, session) => {
        sessionStore.setSession(session);
    });
});

onBeforeUnmount(async () => {
    await supabase.removeAllChannels();
});
</script>
