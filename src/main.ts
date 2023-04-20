import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import vuetify from '@/plugin/vuetify';

import App from './App.vue';
import router from './router';

import './assets/scss/main.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createI18n);

app.use(vuetify).mount('#app');
