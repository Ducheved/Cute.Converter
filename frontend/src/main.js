import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './index.css';
import { useDarkModeStore } from './stores/darkModeStore';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUserSecret, faUser, faHeart, faFileImport, faPlus, faRulerCombined, faImage, faClock, faCalendarAlt, faExpand } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;

const app = createApp(App);
library.add(faUserSecret, faUser, faHeart, faGithub, faFileImport, faPlus, faRulerCombined, faImage, faClock, faCalendarAlt, faExpand);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(createPinia());
const darkModeStore = useDarkModeStore();
if (darkModeStore.isDarkMode) {
  document.documentElement.classList.add('dark');
}
app.use(router);
app.mount('#app');
