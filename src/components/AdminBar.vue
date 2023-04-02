<template>
  <div class="container mx-auto px-2">
    <div class="card bg-base-200 max-w-7xl mx-auto shadow-md shadow-base-300">
      <div class="card-body p-4">
        <h2 class="card-title mb-2">Admin</h2>
        <div>
          <button
            v-if="voting"
            class="btn btn-sm btn-error mr-2"
            @click="setVoting(false)"
          >
            End voting
          </button>
          <button
            v-else
            class="btn btn-sm btn-success mr-2"
            @click="setVoting(true)"
          >
            Start voting
          </button>
        </div>
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
