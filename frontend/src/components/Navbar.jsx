import React, {useState} from 'react';
import { Button } from './Button';
import {Link} from 'react-router-dom';

import './Navbar.css';

/**
 * The `Navbar` component renders the site's navigation menu with responsive design.
 * Supports mobile menu toggling and adaptive button display based on screen width.
 *
 * @component
 * @returns {JSX.Element} A responsive navigation bar with menu items and login option
 *
 * @state
 * @state {boolean} click - Controls mobile menu open/close state
 * @state {boolean} button - Determines button visibility based on screen width
 *
 * @methods
 * @method handleClick - Toggles mobile menu visibility
 * @method closeMobileMenu - Closes mobile menu
 * @method showButton - Adapts button display based on screen width
 *
 * @example
 * <Navbar />
 *
 * @remarks
 * - Includes responsive design for mobile and desktop
 * - Provides navigation links to Home, Menu Board, and Careers
 * - Implements dynamic button rendering based on screen size
 */

// const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
// const navbarLinks = document.querySelector('.navbar-links');

// // Toggle the mobile menu visibility
// mobileMenuIcon.addEventListener('click', () => {
//     navbarLinks.classList.toggle('active');
// });

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true)

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false)

    //like media from css
    const showButton = () => {
        if (window.innerWidth <= 960) {
          setButton(false);
        } else {
          setButton(true);
        }
      };
    
    //   useEffect(() => {
    //     showButton();
    //   }, []);
      
      //whenever I resize I want showButton to work for me
      window.addEventListener('resize', showButton);
    

  return (
    <>
    <nav className="navbar">
        <div className="navbar-container">
            <Link to = "/" className = "navbar-logo">
                <img src = "/images/pekingslogo.png"></img>
            </Link>
            <div className='menu-icon' onClick={handleClick}>
                <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/MenuBoard'
                className='nav-links'
                onClick={closeMobileMenu}
                // could also be menu board if needed
              >  
                Menu Board
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/Careers'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Careers
              </Link>
            </li>

            <li>
              <Link
                to='/log-in'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Log in
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='btn--outline'>Log in</Button>}
        </div>
    </nav>
    </>
  );
}

export default Navbar;