import './assets/styles.scss'
import * as bootstrap from 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    defaults: {
        VBtn: { variant: 'tonal' },
        VTextField: { variant: 'outlined' },
    }
})

import { configure } from 'vee-validate';
// Default values
configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true, // controls if `update:modelValue` events should trigger validation with `handleChange` handler
});

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.mount('#app')
