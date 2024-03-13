<template>
  <div
    class="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 dark:bg-gradient-to-r dark:from-purple-700 dark:via-purple-800 dark:to-purple-900"
  >
    <div class="sm:md-6 container mx-auto mb-6 mt-6 sm:mt-6 md:mb-0 md:mb-0">
      <NavBar />
      <div v-once id="sakura-branch"></div>
      <header
        class="-z-1 flex min-h-screen min-h-screen flex-col gap-4 md:flex-row"
      >
        <Transition name="slide-fade">
          <div
            v-if="menuExpandStore.isMenuExpanded"
            class="prose-headings:none md:prose-md lg:prose-md prose z-10 flex w-full items-center justify-center p-4 dark:prose-invert sm:prose-sm xl:prose-lg 2xl:prose-xl prose-h1:mb-0 prose-p:mt-1 prose-a:no-underline dark:text-white md:h-screen"
          >
            <div class="z-10">
              <div class="">
                <h1>Cute.Converter</h1>
                <p>Ideal for when you need fast and free image convert</p>
              </div>
              <nav
                class="mt-8 w-full text-center text-xs dark:text-white md:ml-[-1rem] md:mt-4 md:py-4 md:text-left md:text-base"
              >
                <RouterLink
                  class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white"
                  to="/"
                >
                  <font-awesome-icon icon="user" /> About
                </RouterLink>
                <RouterLink
                  class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white"
                  to="/converter"
                >
                  <font-awesome-icon icon="file-import" /> Сonvertr
                </RouterLink>
                <a
                  class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white"
                  href="https://github.com/Ducheved/Cute.Converter"
                  target="_blank"
                >
                  <font-awesome-icon :icon="['fab', 'github']" /> GitHub
                </a>
              </nav>
            </div>
          </div>
        </Transition>

        <div class="w-full">
          <div class="flex h-full items-center p-4 leading-6 dark:text-white">
            <router-view />
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<script>
import { useMenuExpandStore } from '@/stores/menuExpandStore';
import NavBar from '@/components/NavBar.vue';

export default {
  components: {
    NavBar,
  },
  setup() {
    const menuExpandStore = useMenuExpandStore();

    return {
      menuExpandStore,
    };
  },
};
</script>

<style scoped>
#sakura-branch {
  background: url('@/assets/cherryblossoms.svg') no-repeat;
}

.dark #sakura-branch {
  background: url('@/assets/cherryblossoms-dark.svg') no-repeat;
}

.kittymenu.router-link-active {
  @apply text-rose-300;
}

.dark .kittymenu.router-link-active {
  @apply text-fuchsia-800;
}

.kittymenu.router-link-active:hover {
  @apply text-rose-400;
}

.dark .kittymenu.router-link-active:hover {
  @apply text-fuchsia-500;
}
</style>
