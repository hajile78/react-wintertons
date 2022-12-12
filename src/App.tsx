import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ModalContext from './context/ModalContext'

import './App.scss'
import Header from './partials/Header'
import Posts from './partials/Posts'
import LinkQuote from './partials/LinkQuote'
import Modal from './partials/Modal'
import QuoteForm from './partials/quoteForm/QuoteForm'
import PostsForm from './partials/PostsForm'
import useGetQuotes from './hooks/useGetQuotes'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState({})
  const {quote, quotes, setQuote} = useGetQuotes()
  //const [quote, setQuote] = useState<Quote>(inital)
  
  return (
    <div className="App">
      <ModalContext.Provider
        value={{ showModal, setShowModal, modalText, setModalText }}
      >
        <Modal />
      </ModalContext.Provider>

      <Header />
      <div className="container">
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
      </div>
      <footer className="footer">Copyright © Wintertons.us 2020</footer>
    </div>
  )
}

export default App
