<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useDarkModeStore } from './stores/darkModeStore'
import cherryblossoms from '@/assets/cherryblossoms.svg'
import cherryblossomsDark from '@/assets/cherryblossoms-dark.svg'

const darkModeStore = useDarkModeStore()
const show = ref(true)
</script>

<template>
  <div
    class="bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 dark:bg-gradient-to-r dark:from-purple-700 dark:via-purple-800 dark:to-purple-900"
  >
    <div class="container mx-auto">
      <div
        class="font-sans dark-mode-switch-container p-2 bg-fuchsia-950 shadow-lg text-white dark:text-gray-800 dark:bg-rose-300 rounded-b-lg"
      >
        <div class="switch" @click="darkModeStore.toggleDarkMode">
          <div
            class="switch-button"
            :class="{ 'switch-button-on': darkModeStore.isDarkMode }"
          ></div>
        </div>
        <hr class="border-t border-gray-200 my-2" />
        <button class="mewoglee-rotation-for-fun" @click="show = !show">
          <font-awesome-icon icon="expand" /> {{ show ? 'Hide' : 'Show' }}
        </button>
      </div>
      <div id="sakura-branch" :class="{ dark: isDark }"></div>
      <header class="flex flex-col md:flex-row min-h-screen gap-4 -z-1 min-h-screen">
        <Transition name="slide-fade">
          <div
            v-if="show"
            class="prose prose-h1:mb-0 prose-p:mt-1 prose-a:no-underline prose-headings:none dark:prose-invert md:prose-md sm:prose-sm lg:prose-md xl:prose-lg 2xl:prose-xl z-10 w-full h-screen flex items-center justify-center p-4 dark:text-white"
          >
            <div class="z-10">
              <div class="">
                <h1>Cute.Converter</h1>
                <p>Ideal for when you need fast and free image convert</p>
              </div>
              <nav
                class="w-full text-center mt-8 text-xs md:text-left md:ml-[-1rem] md:text-base md:py-4 md:mt-4 dark:text-white"
              >
                <RouterLink
                  class="inline-block px-4 border-l border-[var(--color-border)] first:border-0 dark:border-white"
                  to="/"
                >
                  <font-awesome-icon icon="user" /> About
                </RouterLink>
                <RouterLink
                  class="inline-block px-4 border-l border-[var(--color-border)] first:border-0 dark:border-white"
                  to="/about"
                  ><font-awesome-icon icon="file-import" /> Сonvertr</RouterLink
                >
                <a
                  class="inline-block px-4 border-l border-[var(--color-border)] first:border-0 dark:border-white"
                  href="https://github.com/Ducheved/Cute.Converter"
                  target="_blank"
                  ><font-awesome-icon :icon="['fab', 'github']" /> GitHub</a
                >
              </nav>
            </div>
          </div>
        </Transition>

        <div class="w-full">
          <div class="leading-6 h-screen flex items-center p-4 dark:text-white">
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
