import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

// Import the CORRECT router with authentication
import router from './router/index.js'

// Import the ServiceProvider to initialize services
import serviceProvider from './domain/ServiceProvider'

// Create Pinia store
const pinia = createPinia()

// Ensure the service provider is initialized
console.log('Initializing ServiceProvider...', serviceProvider);

// Create and mount app
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')