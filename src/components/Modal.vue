<template>
    <Teleport to="body">
        <div
            v-show="showChild"
            class="modal z-40"
            :class="{ 'modal-open': component }"
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
                    v-if="component"
                    class="modal-box relative flex flex-col"
                    :class="[fullSize ? 'max-w-full' : 'max-w-2xl']"
                >
                    <label
                        class="btn btn-circle btn-sm absolute right-6 top-6"
                        @click="modalStore.close()"
                        ><i class="fas fa-xmark"></i
                    ></label>
                    <component
                        :is="component"
                        v-bind="componentProps"
                    ></component>
                    <div
                        v-if="hasOkButton || hasCancelButton"
                        class="modal-action"
                    >
                        <button
                            v-if="hasCancelButton"
                            class="btn btn-ghost"
                            @click="cancelButtonCallback()"
                        >
                            {{ cancelButtonText }}
                        </button>
                        <button
                            v-if="hasOkButton"
                            class="btn"
                            @click="okButtonCallback()"
                        >
                            {{ okButtonText }}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    </Teleport>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useModalStore } from '../stores/useModalStore';

const modalStore = useModalStore();
const {
    component,
    componentProps,
    hasOkButton,
    hasCancelButton,
    okButtonText,
    cancelButtonText,
    okButtonCallback,
    cancelButtonCallback,
    fullSize,
} = storeToRefs(modalStore);

const showChild = ref(false);

function afterEnter() {
    modalStore.afterEnter = true;
}

function afterLeave() {
    showChild.value = false;
    modalStore.afterEnter = false;
}
</script>
