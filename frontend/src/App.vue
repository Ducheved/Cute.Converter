<script setup>
  import { ref } from 'vue';
  import { RouterLink, RouterView } from 'vue-router';
  import { useDarkModeStore } from './stores/darkModeStore';
  import cherryblossoms from '@/assets/cherryblossoms.svg';
  import cherryblossomsDark from '@/assets/cherryblossoms-dark.svg';

  const darkModeStore = useDarkModeStore();
  const show = ref(true);
</script>

<template>
  <div class="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 dark:bg-gradient-to-r dark:from-purple-700 dark:via-purple-800 dark:to-purple-900">
    <div class="container mx-auto">
      <div class="dark-mode-switch-container rounded-b-lg bg-fuchsia-950 p-2 font-sans text-white shadow-lg dark:bg-rose-300 dark:text-gray-800">
        <div class="switch" @click="darkModeStore.toggleDarkMode">
          <div class="switch-button" :class="{ 'switch-button-on': darkModeStore.isDarkMode }"></div>
        </div>
        <hr class="my-2 border-t border-gray-200" />
        <button class="mewoglee-rotation-for-fun" @click="show = !show"><font-awesome-icon icon="expand" /> {{ show ? 'Hide' : 'Show' }}</button>
      </div>
      <div id="sakura-branch" :class="{ dark: isDark }"></div>
      <header class="-z-1 flex min-h-screen min-h-screen flex-col gap-4 md:flex-row">
        <Transition name="slide-fade">
          <div v-if="show" class="prose-headings:none md:prose-md lg:prose-md prose z-10 flex h-screen w-full items-center justify-center p-4 dark:prose-invert sm:prose-sm xl:prose-lg 2xl:prose-xl prose-h1:mb-0 prose-p:mt-1 prose-a:no-underline dark:text-white">
            <div class="z-10">
              <div class="">
                <h1>Cute.Converter</h1>
                <p>Ideal for when you need fast and free image convert</p>
              </div>
              <nav class="mt-8 w-full text-center text-xs dark:text-white md:ml-[-1rem] md:mt-4 md:py-4 md:text-left md:text-base">
                <RouterLink class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white" to="/"> <font-awesome-icon icon="user" /> About </RouterLink>
                <RouterLink class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white" to="/about"><font-awesome-icon icon="file-import" /> Сonvertr</RouterLink>
                <a class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white" href="https://github.com/Ducheved/Cute.Converter" target="_blank"><font-awesome-icon :icon="['fab', 'github']" /> GitHub</a>
              </nav>
            </div>
          </div>
        </Transition>

        <div class="w-full">
          <div class="flex h-screen items-center p-4 leading-6 dark:text-white">
            <router-view />
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<style scoped>
  .switch {
    width: 60px;
    height: 34px;
    padding: 5px;
    background: white;
    border-radius: 34px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .switch-button {
    width: 24px;
    height: 24px;
    background: black;
    border-radius: 50%;
    transition: transform 0.3s;
  }

  .switch-button-on {
    transform: translateX(26px);
  }

  .dark .switch {
    background: black;
  }

  .dark .switch-button {
    background: white;
  }

  .dark-mode-switch-container {
    position: fixed;
    bottom: 0px;
    right: 16px;
    z-index: 1000;
    transform: rotate(180deg);
  }

  .mewoglee-rotation-for-fun {
    transform: rotate(180deg);
  }

  #sakura-branch {
    background: url('@/assets/cherryblossoms.svg') no-repeat;
  }

  .dark #sakura-branch {
    background: url('@/assets/cherryblossoms-dark.svg') no-repeat;
  }
</style>
