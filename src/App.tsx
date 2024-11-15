import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ModalContext from './context/ModalContext.js'

import './App.css'
import Header from './partials/Header'
import Posts from './partials/Posts'
import LinkQuote from './partials/LinkQuote'
import Modal from './partials/Modal'
import QuoteForm from './partials/quoteForm/QuoteForm'
import PostsForm from './partials/PostsForm'
import useGetQuotes from './hooks/useGetQuotes'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState({ header: '', body: '' })
  const { quote, quotes, setQuote } = useGetQuotes()
  //const [quote, setQuote] = useState<Quote>(inital)

  return (
    <div className="app">
      <ModalContext.Provider
        value={{ showModal, setShowModal, modalText, setModalText }}
      >
        <Modal />
      </ModalContext.Provider>

      <Header />
      
        <div className="main">
          <h1 className="blog-header">
            Wintertons.us <small>The Whole Famn Damily</small>
          </h1>
          <div className="postData">
            <Routes>
              <Route
                path="/nav/:slug"
                element={<Posts quotes={quotes} setQuote={setQuote} />}
              />
              <Route
                path="/post/:id"
                element={<Posts quotes={quotes} setQuote={setQuote} />}
              />
              <Route path="/addQuote" element={<QuoteForm />} />
              <Route path="/addPost" element={<PostsForm />} />
              <Route
                path="/"
                element={<Posts quotes={quotes} setQuote={setQuote} />}
              />
            </Routes>
          </div>
        </div>
        <ModalContext.Provider
          value={{ showModal, setShowModal, modalText, setModalText }}
        >
          <LinkQuote {...quote} />
        </ModalContext.Provider>
      
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
  )
}

export default App
