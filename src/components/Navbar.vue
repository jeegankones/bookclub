<template>
    <div class="navbar fixed top-0 z-30 bg-base-100 shadow-lg">
        <div class="container mx-auto flex justify-between px-4 py-2">
            <h1 class="my-2 font-bold">Book Club</h1>
            <div v-if="isLoggedIn">
                <div class="dropdown-end dropdown">
                    <label tabindex="0">
                        <div class="avatar">
                            <div class="w-12 rounded-full">
                                <img :src="userAvatar" />
                            </div>
                        </div>
                    </label>
                    <div
                        tabindex="0"
                        class="dropdown-content rounded-box bg-base-100 shadow"
                    >
                        <button
                            class="btn w-40"
                            @click="signout"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
            <button
                v-else
                class="btn"
                @click="signInWithDiscord"
            >
                Sign in
                <i class="fab fa-discord ml-2"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { supabase } from '../lib/supabase';
import { useAlertStore } from '../stores/useAlertStore';
import { useSessionStore } from '../stores/useSessionStore';

const alertStore = useAlertStore();
const sessionStore = useSessionStore();

const { userAvatar, isLoggedIn } = storeToRefs(sessionStore);

async function signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: import.meta.env.VITE_APP_SUPABASE_REDIRECT_URL,
        },
    });

    if (error) {
        alertStore.newAlert('Could not sign in. Try again.');
    }
}

async function signout() {
    await supabase.auth.signOut();
}
</script>
