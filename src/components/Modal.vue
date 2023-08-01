<template>
  <div
    v-show="showChild"
    class="modal"
    :class="{ 'modal-open': useModal.isOpen }"
    @click.self="useModal.close()"
  >
    <Transition
      name="bounce"
      @before-enter="showChild = true"
      @after-leave="showChild = false"
    >
      <div v-if="useModal.isOpen" class="modal-box relative">
        <label
          class="btn btn-sm btn-circle absolute top-6 right-6"
          @click="useModal.close()"
          ><i class="fas fa-xmark"></i
        ></label>
        <component
          v-if="useModal.model !== null"
          :is="useModal.view"
          v-model="useModal.model"
        ></component>
        <component v-else :is="useModal.view"></component>
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
