import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import './App.scss';
import Header from './partials/Header'
import Posts from './partials/Posts';
import LinkQuote from './partials/LinkQuote'

function App() {

  return (
    <div className="App">      
      <Router>
        <Header />
        <div className="container">
            <div className="main">
              <h1 className="blog-header">Wintertons.us <small>The Whole Famn Damily</small></h1>
              <div className="postData">

                  <Route exact = {true} path = "/" >
                    <Redirect to = "/user/Main" />
                  </Route>
                  <Route path = "/user/:slug" render = {(props) => (<Posts key={props.match.params.slug} slug={props.match.params.slug}/>)} />
                  <Route path = "/post/:id" render = {(props) => (<Posts key={props.match.params.id} id={props.match.params.id} />)} />                  

              </div>
            </div>
          <LinkQuote />
        </div>
      </Router>
      <footer className="footer">Copyright © Wintertons.us 2020</footer>
    </div>
  );
}

export default App;
