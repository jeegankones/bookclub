<template>
  <div class="navbar bg-base-200 flex justify-between">
    <h1 class="my-2 font-bold">Book club</h1>
    <div v-if="userSession">
      <div class="dropdown dropdown-end">
        <label tabindex="0">
          <div class="avatar">
            <div class="w-12 rounded-full">
              <img :src="userSession.user.user_metadata.avatar_url" />
            </div>
          </div>
        </label>
        <div
          tabindex="0"
          class="dropdown-content shadow bg-base-100 rounded-box"
        >
          <button class="btn w-40" @click="signout">Sign out</button>
        </div>
      </div>
    </div>
    <button v-else class="btn" @click="signInWithDiscord">
      Sign in
      <i class="fab fa-discord ml-2"></i>
    </button>
  </div>
</template>

<script setup>
import { supabase, userSession } from '../lib/supabase';

async function signInWithDiscord() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
  });
}

async function signout() {
  const { error } = await supabase.auth.signOut();
}
</script>
