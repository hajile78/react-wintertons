import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Header from './partials/Header'
import LinkQuote from './partials/LinkQuote'

import './App.scss';
import FamilyLinks from './partials/FamilyLinks';
import RandomQuotes from './partials/RandomQuotes';

function App() {
  const [quotes, setQuotes] = useState([]);

  useEffect(async () => {
      const server = 'https://apiwintertons.uc.r.appspot.com';
      //const server = 'http://localhost:5000'
      await fetch(`${server}/quotes`).then(
        (response) => response.json()
      ).then(
        (data) => setQuotes(data)
      ).catch(e => console.log(`Error Message ${e}`));
  }, []);

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
          <LinkQuote data = {quotes} />
        </div>
      </Router>
      <footer className="footer">Copyright © Wintertons.us 2020</footer>
    </div>
  );
}

export default App;
