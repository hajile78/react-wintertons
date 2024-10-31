import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

const rootElemet = document.getElementById('root')

if (rootElemet) {
  const root = ReactDOM.createRoot(rootElemet)
  root.render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found!')
}
