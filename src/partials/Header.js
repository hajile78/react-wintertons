import React from 'react';
import { Link } from 'react-router-dom'

function Header() {
	return(
		<header className="App-header">
			<div className="headerContainer">
				<div className="brand">
					<span href="/">Wintertons.us</span>
				</div>
				<div className="menu">
					<ul className="items">
						<li className="item"><Link to={'/#'}>Home</Link></li>
						<li className="item"><Link to={'/user/Elijah'}>Elijah</Link></li>
						<li className="item"><Link to={'/user/Katie'}>Katie</Link></li>
						<li className="item"><Link to={'/user/Kalob'}>Kalob</Link></li>
						<li className="item"><Link to={'/user/Sam'}>Sam</Link></li>
						<li className="item"><Link to={'/user/Ben'}>Ben</Link></li>
					</ul>
				</div>
			</div>
		</header>
	)
}

export default Header;