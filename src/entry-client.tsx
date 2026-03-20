import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { AppContent } from './App'

import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

const app = <AppContent path={window.location.pathname} />

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return

      const runUpdate = () => registration.update().catch(() => undefined)

      runUpdate()

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          runUpdate()
        }
      })

      window.addEventListener('focus', runUpdate)
    },
    onNeedRefresh() {
      updateSW()
    },
    onRegisterError(error) {
      console.error('Service worker registration failed:', error)
    },
  })
}

// `vite` dev serves a plain index.html with an empty root, while SSR paths inject
// rendered markup into #root. Hydrate only when real SSR element content exists.
if (rootElement.firstElementChild) {
  ReactDOM.hydrateRoot(rootElement, app)
} else {
  ReactDOM.createRoot(rootElement).render(app)
}
