<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ label }}</p>
        <button
          class="delete"
          aria-label="close"
          @click="(closeModal(), closeNotification())"
        ></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
        <template
          v-for="(value, key) in calculatorPresetsStatusCopy"
          :key="key"
        >
          <div class="field-status" v-if="key !== 'id'">
            <label class="label"> {{ key }}:</label>
            <input
              class="input"
              :type="typeof value == 'number' ? 'number' : 'text'"
              :placeholder="key"
              v-model="calculatorPresetsStatusCopy[key]"
            />
          </div>
        </template>
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-success" @click="emitEventNewPreset()">
            Save changes
          </button>
          <button class="button" @click="(closeModal(), closeNotification())">
            Cancel
          </button>
          <div
            v-show="showModalNotification"
            class="notification"
            :class="[modalSaveError ? 'is-danger' : 'is-success']"
          >
            <button class="delete" @click="closeNotification()"></button>
            <span class="mr-6" v-if="modalSaveError">
              {{ modalErrorMsg }}
            </span>
            <span class="mr-6" v-else>
              {{ modalSaveMsg }}
            </span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { watch, ref } from "vue";

export default {
  name: "PresetFormModal",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    modalErrorMsg: {
      type: String,
    },
    showModalNotification: {
      type: Boolean,
    },
    modalSaveMsg: {
      type: String,
    },
    modalSaveError: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    let calculatorPresetsStatusCopy = ref(
      props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : {},
    );

    watch(
      () => props.modelValue,
      (newValue) => {
        calculatorPresetsStatusCopy.value = JSON.parse(
          JSON.stringify(newValue),
        );
      },
      { immediate: true, deep: true },
    );

    const emitEventNewPreset = () => {
      emit("save-preset", calculatorPresetsStatusCopy.value);
    };
    const closeNotification = () => {
      emit("close-notification");
    };
    const closeModal = () => {
      emit("close-modal");
    };
    return {
      calculatorPresetsStatusCopy,
      emitEventNewPreset,
      closeNotification,
      closeModal,
    };
  },
};
</script>

<style scoped>
.modal-card-body {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center !important;
  grid-gap: 10px;
}
</style>
