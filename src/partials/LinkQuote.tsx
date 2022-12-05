import FamilyLinks from './FamilyLinks'
import { Quote } from './quoteForm/Quote'
import RandomQuotes from './RandomQuotes'

function LinkQuote(quote: Quote) {
  return (
    <aside className="linkQuote">
      <FamilyLinks />
      <RandomQuotes {...quote}/>
    </aside>
  )
}

export default LinkQuote
