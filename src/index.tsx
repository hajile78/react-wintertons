import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'

const rootElemet = document.getElementById('root')

if (rootElemet) {
  const root = ReactDOM.createRoot(rootElemet)
  const queryClient = new QueryClient()
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found!')
}
