import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueQRCodeComponent from 'vue-qrcode-component'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.component('qr-code', VueQRCodeComponent)
Vue.use( VueQrcodeReader)

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
