import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from 'firebase'

Vue.config.productionTip = false

declare module 'vue/types/vue' {
  interface Vue {
    $eventHub: Vue
  }
}
Vue.prototype.$eventHub = new Vue()

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
  created(): void {
    firebase.initializeApp({
      apiKey: 'AIzaSyDDfuOco-5KV-kfdG1IGjTxHIl_F8BMK5g',
      authDomain: 'ffc-fb.firebaseapp.com',
      projectId: 'ffc-fb',
      storageBucket: 'ffc-fb.appspot.com',
      messagingSenderId: '1043072853830',
      appId: '1:1043072853830:web:369555f01940dd8b0fa747',
    })
  },
}).$mount('#app')
