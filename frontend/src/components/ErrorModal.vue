<template>
  <div v-if="show" class="modal">
    <div
      class="modal-content mb-2 mt-2 mt-2 flex items-center justify-start gap-4"
    >
      <p
        class="text-bold block text-xl font-medium text-black text-rose-800 dark:text-white"
      >
        <font-awesome-icon icon="exclamation-triangle" /> {{ message }}
      </p>
      <button
        class="text-md rounded bg-rose-800 px-2 py-1 text-white dark:bg-fuchsia-600 dark:text-white"
        @click="closeModal"
      >
        Ok
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['show', 'message'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
