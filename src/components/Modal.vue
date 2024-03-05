<template>
    <Teleport to="body">
        <div
            v-show="showChild"
            class="modal z-40"
            :class="{ 'modal-open': modalStore.component }"
            @click.self="modalStore.close()"
        >
            <Transition
                name="bounce"
                mode="out-in"
                @enter="showChild = true"
                @after-enter="afterEnter()"
                @after-leave="afterLeave()"
            >
                <div
                    v-if="modalStore.component"
                    class="modal-box relative max-w-2xl"
                >
                    <label
                        class="btn btn-circle btn-sm absolute right-6 top-6"
                        @click="modalStore.close()"
                        ><i class="fas fa-xmark"></i
                    ></label>
                    <component
                        :is="modalStore.component"
                        v-bind="modalStore.props"
                    ></component>
                    <div
                        v-if="modalStore.actions?.length"
                        class="modal-action"
                    >
                        <button
                            v-for="(action, index) in modalStore.actions"
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
    </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { useModalStore } from '../stores/useModalStore';

const modalStore = useModalStore();

const showChild = ref(false);

function afterEnter() {
    modalStore.afterEnter = true;
}

function afterLeave() {
    showChild.value = false;
    modalStore.afterEnter = false;
}
</script>
