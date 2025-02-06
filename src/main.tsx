import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { initMobileFeatures } from './mobile'

// React is used implicitly for JSX
const root = React.createElement(App)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => {
        console.log('ServiceWorker registration successful')
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err)
      })
  })
}

initMobileFeatures()

createRoot(document.getElementById('root')!).render(
  React.createElement(React.StrictMode, null, root)
)
