import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { AppContent } from './App'

export function render(url: string) {
  const html = ReactDOMServer.renderToString(
    <AppContent path={url} />
  )

  return { html }
}
