import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueQRCodeComponent from 'vue-qrcode-component'
import VueQrcodeReader from 'vue-qrcode-reader'
import VueMqtt from 'vue-mqtt';

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.component('qr-code', VueQRCodeComponent)
Vue.use(VueQrcodeReader)
Vue.use(VueMqtt, 'wss://mqtt.corp.aira.life:443')
Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
