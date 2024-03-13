<template>
  <div class="switch mr-2" @click="darkModeStore.toggleDarkMode">
    <div
      class="switch-button"
      :class="{ 'switch-button-on': darkModeStore.isDarkMode }"
    ></div>
  </div>
</template>

<script>
import { useDarkModeStore } from '@/stores/darkModeStore';

export default {
  setup() {
    const darkModeStore = useDarkModeStore();

    return {
      darkModeStore,
    };
  },
};
</script>

<style scoped>
.switch {
  @apply relative inline-block cursor-pointer rounded-xl bg-rose-300 align-middle shadow shadow-inner transition-colors duration-200 ease-in dark:bg-fuchsia-950;
  width: 2em;
  height: calc(1em + 0.2rem);
}

.switch-button {
  @apply absolute left-0 top-0 h-full w-1/2 transform rounded-xl bg-white shadow-lg shadow-md transition-transform duration-200 ease-in;
}

.switch-button-on {
  @apply translate-x-full bg-purple-600;
}
</style>
