import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <a href="/">
          <span>Wintertons.us</span>
        </a>
      </div>
      
      <label htmlFor="menu-toggle">X</label>
      <input type="checkbox" name="menu-toggle" id="menu-toggle" />
      
       
      <nav className="menu">
        <ul className="items">
          <li className="item">
            <Link to={'/#'}>Home</Link>
          </li>
          <li className="item">
            <Link to={'/nav/Elijah'}>Elijah</Link>
          </li>
          <li className="item">
            <Link to={'/nav/Katie'}>Katie</Link>
          </li>
          <li className="item">
            <Link to={'/nav/Kalob'}>Kalob</Link>
          </li>
          <li className="item">
            <Link to={'/nav/Sam'}>Sam</Link>
          </li>
          <li className="item">
            <Link to={'/nav/Ben'}>Ben</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
