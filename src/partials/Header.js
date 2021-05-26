import React from 'react';
import { Link } from 'react-router-dom'

function Header() {
	return(
		<header className="App-header">
			<nav className="headerContainer">
				<div className="brand">
					<span href="/">Wintertons.us</span>
				</div>
				<div className="menu">
					<ul className="items">
						<li className="item"><Link to={'/#'}>Home</Link></li>
						<li className="item"><Link to={'/nav/Elijah'}>Elijah</Link></li>
						<li className="item"><Link to={'/nav/Katie'}>Katie</Link></li>
						<li className="item"><Link to={'/nav/Kalob'}>Kalob</Link></li>
						<li className="item"><Link to={'/nav/Sam'}>Sam</Link></li>
						<li className="item"><Link to={'/nav/Ben'}>Ben</Link></li>
					</ul>
				</div>
			</nav>
		</header>
	)
}

export default Header;