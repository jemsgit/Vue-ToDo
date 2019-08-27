import Vue from 'vue'
import ToDo from './components/app.vue'

new Vue({
   render: h => h(ToDo)
 }).$mount('#app')