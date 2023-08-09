<template>
    <div class="navbar fixed top-0 z-50 bg-base-100 shadow-lg">
        <div class="container mx-auto flex justify-between px-4 py-2">
            <h1 class="my-2 font-bold">Book Club</h1>
            <div v-if="userSession">
                <div class="dropdown-end dropdown">
                    <label tabindex="0">
                        <div class="avatar">
                            <div class="w-12 rounded-full">
                                <img :src="userSession.user.user_metadata.avatar_url" />
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
import { supabase, userSession } from '../lib/supabase';
import { useAlert } from '../stores/useAlert';

async function signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: import.meta.env.VITE_APP_SUPABASE_REDIRECT_URL,
        },
    });
    if (error) {
        useAlert.newAlert();
    }
}

async function signout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        useAlert.newAlert();
    }
}
</script>
