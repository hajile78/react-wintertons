import React from 'react';

function RandomQuotes(props) {
	let quotes = props.data || [{quote: "", author: "", id: ""}]; 
	let quote = quotes[Math.floor(Math.random() * quotes.length)];
	return (
		<div className="quote" >
			<h4>Random Quotes</h4>
			<blockquote>
				{quote.quote}
	<footer>{quote.author}</footer>
			</blockquote>
		</div>
	);
}

export default RandomQuotes;