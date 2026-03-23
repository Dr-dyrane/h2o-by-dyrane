import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { PassThrough } from 'node:stream'
import { AppContent } from './App'

const ABORT_DELAY_MS = 10000

export function render(url: string): Promise<{ html: string }> {
  return new Promise((resolve, reject) => {
    let html = ''
    const body = new PassThrough()

    body.on('data', (chunk) => {
      html += chunk.toString()
    })
    body.on('end', () => {
      resolve({ html })
    })
    body.on('error', reject)

    const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
      <AppContent path={url} />,
      {
        onShellReady() {
          pipe(body)
        },
        onShellError(error) {
          reject(error)
        },
        onError(error) {
          // Surface SSR rendering issues while still allowing shell streaming.
          console.error('SSR stream error:', error)
        },
      }
    )

    setTimeout(() => {
      abort()
    }, ABORT_DELAY_MS)
  })
}
