import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import compression from 'compression'
import { createServer as createViteServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProduction = process.env.NODE_ENV === 'production'

async function createServer() {
  const app = express()

  // Enable compression
  app.use(compression())

  // Security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    // Allow fonts, WebSocket, Vercel Analytics, Three.js assets, GitHub API, blob/data URLs
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' https: data:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; img-src 'self' data: https: blob:; connect-src 'self' https: ws://localhost:* wss://localhost:* blob: data:; media-src 'self' https: blob: data:;")

    next()
  })


  let vite

  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist/client'), {
      index: false,
      maxAge: 0,
      setHeaders: (res, filePath) => {
        if (
          filePath.endsWith('index.html') ||
          filePath.endsWith('sw.js') ||
          filePath.endsWith('manifest.webmanifest')
        ) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
          return
        }

        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          return
        }

        res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate')
      }
    }))
  }

  app.use('*', async (req, res, next) => {
    // Skip API and static file requests
    if (req.originalUrl.startsWith('/api/') || 
        req.originalUrl.startsWith('/.well-known/') ||
        req.originalUrl.includes('.')) {
      return next()
    }

    const url = req.originalUrl

    try {
      let template
      let render

      if (!isProduction) {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render
      }

      const { html: appHtml } = render(url)

      const html = template
        .replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/, '')
        .replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }).end(html)
    } catch (e) {
      console.error('SSR Error:', e)
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(e)
      }
      // Fallback to client-side rendering
      res.status(500).send('Server Error')
    }
  })

  return { app, vite }
}

createServer().then(({ app }) => {
  app.listen(5173, () => {
    console.log('SSR Server running at http://localhost:5173')
  })
}).catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
