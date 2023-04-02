<template>
  <div
    v-show="showChild"
    class="modal modal-open"
    @click.self="useModal.close()"
  >
    <Transition
      name="bounce"
      @before-enter="showChild = true"
      @after-leave="showChild = false"
    >
      <div v-if="useModal.isOpen" class="modal-box relative">
        <label
          class="btn btn-sm btn-circle absolute top-4 right-4"
          @click="useModal.close()"
          ><i class="fas fa-xmark"></i
        ></label>
        <component :is="useModal.view"></component>
        <div v-if="useModal.actions.length" class="modal-action">
          <button
            v-for="action in useModal.actions"
            class="btn"
            @click="action.callback()"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModal } from '../stores/useModal';

const showChild = ref(false);
</script>
