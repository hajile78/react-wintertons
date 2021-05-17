import React from 'react';

function FamilyLinks(props) {
	const { toggleModal, updateModalText } = props;
	const showModal = (e) => {
		e.preventDefault()
		let header = 'PRAYER FOR THE AUTHOR AND OTHER WINTERTONS WHO GROW OLDER DAY BY DAY'
		let body = `<p>Lord, thou knowest better than I know myself that I am growing older and will some day be old.  Keep me from the fatal habit of thinking I must say something on every subject- and on every occasion.  Release me from craving to try to straighten out every Winterton’s affairs.</p>
		<p>Lord, make me thoughtful but not moody; helpful but not bossy. With my vast store of wisdom, it seems a pity not to use it all--but thou knowest, Lord, that I want a few friends at the end.</p>
		<p>Lord, keep my mind free from the recital of endless details.. . Give me wings to get to the point. Seal my lips on my aches and pains. They are increasing and love of rehearsing them is becoming sweeter as the years go by... I dare not ask for grace enough to enjoy the tales of other Winterton pains but help me to endure them with patience.</p>
		<p>Lord, I dare not ask for improved memory, but allow me a growing humility and a lessening cocksureness when my memory seems to clash with the memories of other Wintertons. Teach me the glorious lesson that occasionally I may be mistaken.</p>
		<p>Lord, keep me reasonably sweet; I do not want to be a saint--some of them are so hard to live with- -but a sour old per son is one of the crowning works of the devil. Give me the ability to see good things in unexpected places and talents in ordinary people.  Give me the grace to tell them so.</p>
		<p>Amen</p>
		Curtiousy of <a href="http://www.jackandsharensimmons.com/pioneers/#_Toc106434646" target="_blank" rel="noopener noreferrer">Jack and Sharen Simmons</a> site`
		updateModalText(header, body)
		toggleModal()
	}
	return (
		<div className="links">
			<h4>Winterton Links</h4>
			<ul className="list-unstyled">
				{/* <li>
						<a href="http://www.jackandsharensimmons.com/pioneers/#_Toc106434646" target="_blank" rel="noopener noreferrer">Winterton Prayer</a>
				</li> */}
				<li>
					<a href="" onClick={showModal} >Winterton Prayer</a>
				</li>
				<li>
					<a href="http://www.jackandsharensimmons.com/pioneers/index.htm" target="_blank" rel="noopener noreferrer">Winterton Pioneers</a>
				</li>
				<li>
					<a href="http://www.jackandsharensimmons.com/" target="_blank" rel="noopener noreferrer">Winterton History Doc's</a>
				</li>
			</ul>
		</div>
	);
}

export default FamilyLinks;