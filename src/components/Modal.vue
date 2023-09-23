<template>
    <div
        v-show="showChild"
        class="modal"
        :class="{ 'modal-open': useModal.isOpen }"
        @click.self="useModal.close()"
    >
        <Transition
            name="bounce"
            mode="out-in"
            @enter="showChild = true"
            @after-enter="afterEnter()"
            @after-leave="afterLeave()"
        >
            <div
                v-if="useModal.isOpen"
                class="modal-box relative max-w-2xl"
            >
                <label
                    class="btn btn-circle btn-sm absolute right-6 top-6"
                    @click="useModal.close()"
                    ><i class="fas fa-xmark"></i
                ></label>
                <component
                    :is="useModal.view"
                    v-if="useModal.model"
                    v-model="useModal.model"
                ></component>
                <component
                    :is="useModal.view"
                    v-if="!useModal.model"
                ></component>
                <div
                    v-if="useModal.actions.length"
                    class="modal-action"
                >
                    <button
                        v-for="(action, index) in useModal.actions"
                        :key="index"
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

function afterEnter() {
    useModal.afterEnter = true;
}

function afterLeave() {
    showChild.value = false;
    useModal.afterEnter = false;
}
</script>
