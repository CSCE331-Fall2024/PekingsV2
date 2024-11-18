import React, {useState} from 'react';
import { Button } from './Button';
import {Link} from 'react-router-dom';

import './Navbar.css';

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