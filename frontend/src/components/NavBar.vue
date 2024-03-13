<template>
  <div
    class="text-md sm:text-md dark-mode-switch-container inline-block md:text-lg"
  >
    <transition
      name="slide"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
    >
      <div
        class="z-1000 inline-block rounded-tl-lg bg-fuchsia-950 p-2 font-sans text-white shadow-lg dark:bg-rose-300 dark:text-gray-800"
        v-if="!menuExpandStore.isMenuExpanded"
      >
        <div>
          <RouterLink
            class="kittymenu inline-block border-l border-[var(--color-border)] px-2 first:border-0 dark:border-white sm:px-2 md:px-4"
            to="/"
          >
            <font-awesome-icon icon="user" /> Me
          </RouterLink>
          <RouterLink
            class="kittymenu inline-block border-l border-[var(--color-border)] px-2 first:border-0 dark:border-white sm:px-2 md:px-4"
            to="/converter"
          >
            <font-awesome-icon icon="file-import" /> Cnvrt
          </RouterLink>
          <div
            class="inline-block border-l border-[var(--color-border)] px-2 first:border-0 dark:border-white sm:px-2 md:px-4"
          >
            <font-awesome-icon icon="tree" />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </transition>
    <div
      class="kittybutt inline-block bg-fuchsia-950 p-2 font-sans text-white shadow-lg dark:bg-rose-300 dark:text-gray-800"
      :class="menuExpandClass"
    >
      <button
        class="inline-block border-l border-[var(--color-border)] px-2 first:border-0 dark:border-white sm:px-2 md:px-4"
        @click="toggleMenu"
      >
        <font-awesome-icon icon="expand" />
        {{ menuExpandStore.isMenuExpanded ? 'Hide' : 'Show' }}
      </button>
    </div>
  </div>
</template>

<script>
import { useMenuExpandStore } from '@/stores/menuExpandStore';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import { ref, computed } from 'vue';

export default {
  components: {
    ThemeSwitcher,
  },
  setup() {
    const menuExpandStore = useMenuExpandStore();

    let show = ref(localStorage.getItem('menuExpanded') === 'true');
    const roundedClass = ref(false);
    const afterLeave = () => {
      roundedClass.value = !false;
    };

    const beforeEnter = () => {
      roundedClass.value = !true;
    };
    const toggleMenu = () => {
      menuExpandStore.toggleMenu();
    };

    const menuExpandClass = computed(() => ({
      '': menuExpandStore.isMenuExpanded,
      'rounded-tl-lg': menuExpandStore.isMenuExpanded,
    }));

    return {
      menuExpandStore,
      show,
      roundedClass,
      afterLeave,
      beforeEnter,
      toggleMenu,
      menuExpandClass,
    };
  },
};
</script>
