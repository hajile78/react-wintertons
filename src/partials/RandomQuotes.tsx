// import useGetQuotes from '../hooks/useGetQuotes'
import { Quote } from './quoteForm/Quote'

function RandomQuotes(quote: Quote) {
  //const {quote} = useGetQuotes()

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
