import React, { useState, useEffect } from 'react'

function RandomQuotes(props) {
  const [quote, setQuote] = useState(null)
  const [quotes, setQuotes] = useState(null)

  const getQuotes = async () => {
    const server = 'https://apiwintertons.uc.r.appspot.com'
    //const server = 'http://localhost:5000'
    await fetch(`${server}/quotes`)
      .then((response) => response.json())
      .then((data) => {
        setQuotes(data.quotes)
        localStorage.setItem('quotes', data.quotes)
        setQuote(data.quotes[Math.floor(Math.random() * data.quotes.length)])
      })
      .catch((e) => console.log(`Error Message ${e}`))
  }

  useEffect(() => {
    const local = localStorage.getItem('quotes')
    if (local && quotes) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)])
    } else {
      getQuotes()
    }
  }, [quotes])

  return (
    <div className="quote">
      {quote ? (
        <>
          <h3>Random Quotes</h3>
          <blockquote>
            {quote.quote}
            <footer>{quote.author}</footer>
          </blockquote>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default RandomQuotes
