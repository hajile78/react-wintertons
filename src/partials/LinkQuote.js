import React from 'react';
import FamilyLinks from './FamilyLinks'
import RandomQuotes from './RandomQuotes'

function LinkQuote (props) {
	const quotes = props.data.quotes;
	return (
		<aside className="linkQuote">
      <FamilyLinks />
      <RandomQuotes data = {quotes} />
    </aside>
	)
}

export default LinkQuote;