import { createApp } from 'vue';
import App from './App.vue';
import { createFloatingPanelStore } from './store/useFloatingPanelStore';

const app = createApp(App);
app.provide('FloatingPanelStore', createFloatingPanelStore);
app.mount('#app');
