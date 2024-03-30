<template>
    <h2 class="mb-2">Sign in</h2>
    <p class="mb-4 italic">For test users only</p>
    <form
        class="form-control w-full"
        @submit.prevent="signInWithEmail()"
    >
        <label class="label">
            <span class="label-text">Email</span>
        </label>
        <input
            ref="email"
            type="email"
            class="input input-bordered w-full"
        />
        <label class="label">
            <span class="label-text">Password</span>
        </label>
        <input
            ref="password"
            type="password"
            class="input input-bordered w-full"
        />
        <div class="modal-action">
            <button class="btn btn-ghost">Cancel</button>
            <button
                type="submit"
                class="btn"
            >
                Sign in
            </button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import { useAlertStore } from '../stores/useAlertStore';
import { useModalStore } from '../stores/useModalStore';

const email = ref();
const password = ref();

async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
        email: email.value.value,
        password: password.value.value,
    });

    if (error) {
        useAlertStore().newAlert(error.message);
    }

    await useModalStore().close();
}
</script>
