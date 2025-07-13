import { createRoot } from 'react-dom/client'
import './scss/main.scss'
import App from './App'

// Import jQuery and make it globally available
import $ from 'jquery'
declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}
window.$ = window.jQuery = $

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <App />
)
