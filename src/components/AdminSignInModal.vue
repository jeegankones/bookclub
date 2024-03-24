<template>
    <h2 class="mb-2">Sign in</h2>
    <p class="mb-4 italic">For test users only</p>
    <label class="input input-bordered mb-2 flex items-center gap-2">
        Email
        <input
            ref="email"
            type="email"
            class="grow bg-transparent"
        />
    </label>
    <label class="input input-bordered flex items-center gap-2">
        Password
        <input
            ref="password"
            type="password"
            class="grow bg-transparent"
        />
    </label>
    <div class="modal-action">
        <button class="btn btn-ghost">Cancel</button>
        <button
            class="btn"
            @click="signInWithEmail()"
        >
            Sign in
        </button>
    </div>
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
