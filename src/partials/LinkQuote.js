import React from 'react';
import FamilyLinks from './FamilyLinks'
import RandomQuotes from './RandomQuotes'

function LinkQuote (props) {
	//const quotes = useContext(QuoteContext);
	return (
		<aside className="linkQuote">
      <FamilyLinks />
			<RandomQuotes />      
    </aside>
	)
}

export default LinkQuote;