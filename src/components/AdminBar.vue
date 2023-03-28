<template>
  <div class="card bg-base-200">
    <div class="card-body p-4">
      <h2 class="card-title mb-2">Admin</h2>
      <div>
        <button
          v-if="voting"
          class="btn btn-sm btn-error"
          @click="setVoting(false)"
        >
          End voting
        </button>
        <button v-else class="btn btn-sm btn-success" @click="setVoting(true)">
          Start voting
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

const voting = ref(null);
const props = defineProps(['voting']);

onMounted(() => {
  voting.value = props.voting;
});

async function setVoting(value) {
  const { data, error } = await supabase
    .from('settings')
    .update({ value })
    .eq('setting', 'voting')
    .select('value');
  voting.value = data[0].value;
}
</script>
