import Vue from 'vue'
import VueCarousel from 'vue-carousel'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueAxios, axios)
Vue.use(VueCarousel)

new Vue({
    el: '#app',
    render: h => h(App)
}).$mount('#app')