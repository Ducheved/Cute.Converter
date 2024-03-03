import { defineStore } from 'pinia';

export const useMenuExpandStore = defineStore({
  id: 'menuExpand',
  state: () => ({
    isMenuExpanded: localStorage.getItem('menuExpanded') === 'true',
  }),
  actions: {
    toggleMenu() {
      this.isMenuExpanded = !this.isMenuExpanded;
      localStorage.setItem('menuExpanded', this.isMenuExpanded);
    },
  },
});