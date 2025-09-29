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
      
      <input type="checkbox" name="menu-toggle" id="menu-toggle" />
      <label htmlFor="menu-toggle"></label>      
       
      <nav className="menu">
        <ul className="items">
          <li className="item" onClick={() => closeMenu()}>
            <Link to={'/#'}>Home</Link>
          </li>
          <li className="item"  onClick={() => closeMenu()}>
            <Link to={'/nav/Elijah'}>Elijah</Link>
          </li>
          <li className="item"  onClick={() => closeMenu()}>
            <Link to={'/nav/Katie'}>Katie</Link>
          </li>
          <li className="item" onClick={() => closeMenu()}>
            <Link to={'/nav/Kalob'}>Kalob</Link>
          </li>
          <li className="item"  onClick={() => closeMenu()}>
            <Link to={'/nav/Sam'}>Sam</Link>
          </li>
          <li className="item" onClick={() => closeMenu()}>
            <Link to={'/nav/Ben'}>Ben</Link>
          </li>
        </ul>
      </nav>
    </header>
  )

  function closeMenu(){
    
      const checkbox = document.getElementById('menu-toggle') as HTMLInputElement
      checkbox.checked = false
    
  }
}

export default Header
