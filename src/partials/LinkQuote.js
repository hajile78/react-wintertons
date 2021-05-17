import React from 'react';
import FamilyLinks from './FamilyLinks'
import RandomQuotes from './RandomQuotes'

function LinkQuote (props) {
	const {toggleModal, updateModalText} = props;
	//const quotes = useContext(QuoteContext);
	return (
		<aside className="linkQuote">
      		<FamilyLinks toggleModal={toggleModal} updateModalText={updateModalText} />
			<RandomQuotes />      
    	</aside>
	)
}

export default LinkQuote;