import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import ModalContext from './context/ModalContext'

import './App.scss'
import Header from './partials/Header'
import Posts from './partials/Posts'
import LinkQuote from './partials/LinkQuote'
import Modal from './partials/Modal'
import QuoteForm from './partials/QuoteForm'
import PostsForm from './partials/PostsForm'

function App() {
  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState({})

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
            <Switch>
              <Route
                path="/nav/:slug"
                render={(props) => (
                  <Posts
                    key={props.match.params.slug}
                    slug={props.match.params.slug}
                  />
                )}
              />
              <Route
                path="/post/:id"
                render={(props) => (
                  <Posts
                    key={props.match.params.id}
                    id={props.match.params.id}
                  />
                )}
              />
              <Route path="/addQuote" exact render={() => <QuoteForm />} />
              <Route path="/addPost" exact render={() => <PostsForm />} />
              <Route
                path="/"
                exact
                render={() => <Posts key={'Main'} slug={'Main'} />}
              />
            </Switch>
          </div>
        </div>
        <ModalContext.Provider
          value={{ showModal, setShowModal, modalText, setModalText }}
        >
          <LinkQuote />
        </ModalContext.Provider>
      </div>
      <footer className="footer">Copyright © Wintertons.us 2020</footer>
    </div>
  )
}

export default App
