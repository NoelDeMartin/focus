import Vue from 'vue';

import App from './App.vue';

import './plugins/vuetify';
import './plugins/registerServiceWorker';

import './styles/main.scss';

Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
