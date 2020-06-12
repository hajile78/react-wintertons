import React from 'react';
import FamilyLinks from './FamilyLinks'
import RandomQuotes from './RandomQuotes'

function LinkQuote () {
	return (
		<aside className="linkQuote">
      <FamilyLinks />
      <RandomQuotes />
    </aside>
	)
}

export default LinkQuote;