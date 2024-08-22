import './bootstrap';
import { createApp } from 'vue';
import App from '../views/components/app.vue';
import router from './router/index.js';
import pusherJs from 'pusher-js';

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

pusherJs.logToConsole = true;

var pusher = new pusherJs('ae27b0e226863c387b04', {
    cluster: 'ap2'
})

createApp(App)
.provide('pusher', pusher)
.use(Toast, {})
.use(router).mount("#app");