import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/ThemeProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/react'
import { NoSSR } from '@/components/NoSSR'
import App from './App'

import './index.css'

const queryClient = new QueryClient()

ReactDOM.hydrateRoot(
  document.getElementById('root')!,
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <NoSSR>
          <Toaster />
          <Sonner />
          <Analytics />
        </NoSSR>
        <BrowserRouter>

          <App />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)
