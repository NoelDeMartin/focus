import Vue from 'vue';

import App from '@/App.vue';

import '@/soukai/soukai';

import '@/plugins/vuetify';
import '@/plugins/registerServiceWorker';

import '@/styles/main.scss';

import Auth from '@/services/Auth';

Vue.config.productionTip = false;

Vue.prototype.$auth = Auth;

new Vue({
    render: h => h(App),
}).$mount('#app');
