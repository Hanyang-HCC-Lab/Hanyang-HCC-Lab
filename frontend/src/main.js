import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import './assets/main.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faLink, faEnvelope, faGraduationCap, faCircle, faMedal, faTrophy, faVideo } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUserSecret, faLink, faEnvelope, faGraduationCap, faMedal, faTrophy, faVideo, faCircle)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')

