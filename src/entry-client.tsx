import React from 'react'
import ReactDOM from 'react-dom/client'
import { AppContent } from './App'

import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

const app = <AppContent path={window.location.pathname} />

// `vite` dev serves a plain index.html with an empty root, while SSR paths inject
// rendered markup into #root. Hydrate only when real SSR element content exists.
if (rootElement.firstElementChild) {
  ReactDOM.hydrateRoot(rootElement, app)
} else {
  ReactDOM.createRoot(rootElement).render(app)
}
