<template>
    <div class="navbar fixed top-0 z-30 bg-base-100 shadow-lg">
        <div class="container mx-auto flex justify-between px-4 py-2">
            <h1 class="my-2 font-bold">Book Club</h1>
            <div v-if="isLoggedIn">
                <div class="dropdown dropdown-end">
                    <label tabindex="0">
                        <button
                            v-if="userAvatar"
                            :title="userName"
                            class="avatar"
                        >
                            <div class="flex w-12 rounded-full">
                                <img :src="userAvatar" />
                            </div>
                        </button>
                        <button
                            v-else
                            class="btn btn-neutral"
                            :title="userEmail"
                        >
                            {{ userEmail }}
                        </button>
                    </label>
                    <div
                        tabindex="0"
                        class="dropdown-content rounded-box w-52 bg-base-100 p-2 shadow-lg"
                    >
                        <button
                            class="btn w-full"
                            @click="signout()"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
            <button
                v-else-if="isLocal"
                class="btn"
                @click="adminSignIn()"
            >
                Sign in
            </button>
            <div
                v-else-if="isDev"
                class="dropdown dropdown-end"
            >
                <label tabindex="0">
                    <button class="btn">Sign in</button>
                </label>
                <div
                    tabindex="0"
                    class="dropdown-content rounded-box w-52 bg-base-100 p-2 shadow-lg"
                >
                    <button
                        class="btn mb-2 w-full"
                        @click="signInWithDiscord()"
                    >
                        Discord
                        <i class="fab fa-discord ml-2"></i>
                    </button>
                    <button
                        class="btn w-full"
                        @click="adminSignIn()"
                    >
                        Test user
                    </button>
                </div>
            </div>
            <button
                v-else
                class="btn"
                @click="signInWithDiscord()"
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
import { useModalStore } from '../stores/useModalStore';
import { useSessionStore } from '../stores/useSessionStore';
import { isDev, isLocal } from '../utils/viteMode';
import AdminSignInModal from './AdminSignInModal.vue';

const alertStore = useAlertStore();
const sessionStore = useSessionStore();
const modalStore = useModalStore();

const { userAvatar, isLoggedIn, userEmail, userName } = storeToRefs(sessionStore);

async function signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
    });

    if (error) {
        alertStore.newAlert('Could not sign in. Try again.');
    }
}

function adminSignIn() {
    modalStore.open(AdminSignInModal);
}

async function signout() {
    await supabase.auth.signOut();
}
</script>
