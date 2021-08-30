import { useState, useEffect } from 'react'

type Quote = {
  quote: string,
  author: string
}
type QuoteData = {
  quotes: Quote[]
}

function RandomQuotes() {
  const [quote, setQuote] = useState<Quote>()
  const [quotes, setQuotes] = useState<Quote[]>()

  const getQuotes = async () => {
    const server = 'https://apiwintertons.uc.r.appspot.com'
    //const server = 'http://localhost:5000'
    await fetch(`${server}/quotes`)
      .then((response) => response.json())
      .then((data: QuoteData) => {
        setQuotes(data.quotes)
        localStorage.setItem('quotes', JSON.stringify(data.quotes))
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
