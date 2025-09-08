import { useState } from 'react'
import { Routes, Route, useRoutes } from 'react-router-dom'
import ModalContext from './context/ModalContext.js'

import './App.css'
import Header from './partials/Header'
import LinkQuote from './partials/LinkQuote'
import Modal from './partials/Modal'
import useGetQuotes from './hooks/useGetQuotes'
import { createRoutes } from './routes'
import ErrorBoundary from './components/common/ErrorBoundary'
import ErrorFallback from './components/common/ErrorFallback'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState({ header: '', body: '' })
  const { quote, quotes, setQuote } = useGetQuotes()

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ModalContext.Provider
        value={{ showModal, setShowModal, modalText, setModalText }}
      >
        <div className="app">
          <Modal />
          <Header />
        
        <div className="main">
          <h1 className="blog-header">
            Wintertons.us <small>The Whole Famn Damily</small>
          </h1>
          <div className="postData">
            <Routes>
              {createRoutes(quotes, setQuote).map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </div>
        </div>
        <LinkQuote {...quote} />
      
        <footer className="footer">
          Copyright © Wintertons.us 2020 | Built with
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-11.5 -10.23174 23 20.46348"
          >
            <title>React Logo</title>
            <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
            <g stroke="#61dafb" stroke-width="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
        </footer>
      </div>
      </ModalContext.Provider>
    </ErrorBoundary>
  )
}

export default App
