import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './App.scss';
import Header from './partials/Header'
import LinkQuote from './partials/LinkQuote'
import Posts from './partials/Posts';

function App() {

  return (
    <div className="App">
      
      <Router>
        <Header />
        <div className="container">
            <div className="main">
              <h1 className="blog-header">Wintertons.us <small>The Whole Famn Damily</small></h1>
              <div className="postData">
                <Route exact={true} path = "/" render = {() => (<Posts slug='Main'/>)} />
                <Route path = "/user/:slug" render = {(props) => (<Posts slug={props.match.params.slug}/>)} />
                <Route path = "/post/:id" render = {(props) => (<Posts id={props.match.params.id}/>)} />
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
