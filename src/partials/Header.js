import React from 'react';
import { Link } from 'react-router-dom'

function Header() {
	return(
		<header className="App-header">
			<div className="container">
				<div className="brand">
					<span href="/">Wintertons.us</span>
				</div>
				<div className="menu">
					<ul className="items">
						<li className="item"><Link to={'/'}>Home</Link></li>
						<li className="item"><Link to={'/elijah'}>Eliah</Link></li>
						<li className="item"><Link to={'/katie'}>Katie</Link></li>
						<li className="item"><Link to={'/kalob'}>Kalob</Link></li>
						<li className="item"><Link to={'/sam'}>Sam</Link></li>
						<li className="item"><Link to={'/ben'}>Ben</Link></li>
					</ul>
				</div>
			</div>
		</header>
	)
}

export default Header;