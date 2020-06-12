import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './partials/Header'
import LinkQuote from './partials/LinkQuote'

import './App.css';
import FamilyLinks from './partials/FamilyLinks';
import RandomQuotes from './partials/RandomQuotes';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <div className="container">
            <div className="main">
              <Route exact={true} path='/' render={() => (<h1>Welcome to Wintertons.us</h1>)} />
              <Route exact={true} path="/:slug" component={FamilyLinks} />
              <Route exact={true} path="/post/:id" component={RandomQuotes} />

              </div>
          <LinkQuote />
        </div>
      </Router>
      <footer className="footer">Copyright © Wintertons.us 2020</footer>
    </div>
  );
}

export default App;
