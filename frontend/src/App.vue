<script setup>
import { ref, computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useDarkModeStore } from './stores/darkModeStore';
import { useMenuExpandStore } from './stores/menuExpandStore';
import cherryblossoms from '@/assets/cherryblossoms.svg';
import cherryblossomsDark from '@/assets/cherryblossoms-dark.svg';

const darkModeStore = useDarkModeStore();
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
</script>

<template>
  <div
    class="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 dark:bg-gradient-to-r dark:from-purple-700 dark:via-purple-800 dark:to-purple-900">
    <div class="container mt-6 sm:mt-6 md:mb-0 mb-6 sm:md-6 md:mb-0 mx-auto">
      <div class="inline-block text-md sm:text-md md:text-lg   dark-mode-switch-container ">
        <transition name="slide" @before-enter="beforeEnter" @after-leave="afterLeave">
          <div
            class="inline-block z-1000 rounded-tl-lg bg-fuchsia-950 p-2 font-sans text-white shadow-lg dark:bg-rose-300 dark:text-gray-800"
            v-if="!menuExpandStore.isMenuExpanded">
            <div>
              <RouterLink
                class="kittymenu inline-block border-l border-[var(--color-border)] px-2 sm:px-2 md:px-4 first:border-0 dark:border-white"
                to="/"> <font-awesome-icon icon="user" /> Me </RouterLink>
              <RouterLink
                class="kittymenu inline-block border-l border-[var(--color-border)] px-2 sm:px-2 md:px-4 first:border-0 dark:border-white"
                to="/about"> <font-awesome-icon icon="file-import" /> Cnvrt </RouterLink>
              <div
                class="inline-block border-l border-[var(--color-border)] px-2 sm:px-2 md:px-4 first:border-0 dark:border-white">
                <font-awesome-icon icon="tree" /></div>
              <div class="switch mr-2" @click="darkModeStore.toggleDarkMode">
                <div class="switch-button" :class="{ 'switch-button-on': darkModeStore.isDarkMode }"></div>
              </div>
            </div>
          </div>
        </transition>
        <div
          class="inline-block kittybutt bg-fuchsia-950 p-2 font-sans text-white shadow-lg dark:bg-rose-300 dark:text-gray-800"
          :class="menuExpandClass">
          <button class="inline-block border-l border-[var(--color-border)] px-2 sm:px-2 md:px-4 first:border-0 dark:border-white"
            @click="toggleMenu"><font-awesome-icon icon="expand" /> {{ menuExpandStore.isMenuExpanded ? 'Hide' : 'Show'
            }}</button>
        </div>
      </div>
      <div id="sakura-branch"></div>
      <header class="-z-1 flex min-h-screen min-h-screen flex-col gap-4 md:flex-row">
        <Transition name="slide-fade">
          <div v-if="menuExpandStore.isMenuExpanded"
            class="prose-headings:none md:prose-md lg:prose-md prose z-10 flex w-full items-center justify-center p-4 dark:prose-invert sm:prose-sm xl:prose-lg 2xl:prose-xl prose-h1:mb-0 prose-p:mt-1 prose-a:no-underline dark:text-white md:h-screen">
            <div class="z-10">
              <div class="">
                <h1>Cute.Converter</h1>
                <p>Ideal for when you need fast and free image convert</p>
              </div>
              <nav
                class="mt-8 w-full text-center text-xs dark:text-white md:ml-[-1rem] md:mt-4 md:py-4 md:text-left md:text-base">
                <RouterLink
                  class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white" to="/">
                  <font-awesome-icon icon="user" /> About </RouterLink>
                <RouterLink
                  class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white"
                  to="/about"><font-awesome-icon icon="file-import" /> Сonvertr</RouterLink>
                <a class="inline-block border-l border-[var(--color-border)] px-4 first:border-0 dark:border-white"
                  href="https://github.com/Ducheved/Cute.Converter" target="_blank"><font-awesome-icon
                    :icon="['fab', 'github']" /> GitHub</a>
              </nav>
            </div>
          </div>
        </Transition>

        <div class="w-full">
          <div class="flex items-center p-4 leading-6 dark:text-white h-full">
            <router-view />
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<style scoped>
#sakura-branch {
  background: url('@/assets/cherryblossoms.svg') no-repeat;
}

.dark #sakura-branch {
  background: url('@/assets/cherryblossoms-dark.svg') no-repeat;
}

.switch {
  @apply relative inline-block align-middle dark:bg-fuchsia-950 shadow-inner shadow bg-rose-300 rounded-xl cursor-pointer transition-colors duration-200 ease-in;
  width: 2em;
  height: calc(1em + 0.2rem);
}

.switch-button {
  @apply absolute top-0 left-0 h-full w-1/2 bg-white shadow-lg rounded-xl shadow-md transform transition-transform duration-200 ease-in;
}

.switch-button-on {
  @apply translate-x-full bg-purple-600;
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

.dark .kittymenu.router-link-active:hover  {
  @apply text-fuchsia-500;
}</style>
