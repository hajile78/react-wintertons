import useGetQuotes from '../hooks/useGetQuotes'

function RandomQuotes() {
  const {quote} = useGetQuotes()

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
