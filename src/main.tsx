import { createRoot } from 'react-dom/client'
import './scss/main.scss'
import App from './App'

// Polyfills for Node.js globals in browser
(window as any).global = window;

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
