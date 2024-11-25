import { useState } from 'react';
import {Link} from 'react-router-dom';

import './Navbar.css';
import { useAuth0 } from '@auth0/auth0-react';
import {Button} from "./Button.jsx";
import centerScreen from "./cashier/CenterScreen.jsx";

// const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
// const navbarLinks = document.querySelector('.navbar-links');

// // Toggle the mobile menu visibility
// mobileMenuIcon.addEventListener('click', () => {
//     navbarLinks.classList.toggle('active');
// });

function Navbar() {
  const [click, setClick] = useState(false);
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false)


    // //like media from css
    // const showButton = () => {
    //     if (window.innerWidth <= 960) {
    //       setButton(false);
    //     } else {
    //       setButton(true);
    //     }
    //   };
    
    //   useEffect(() => {
    //     showButton();
    //   }, []);
      
      //whenever I resize I want showButton to work for me
      // window.addEventListener('resize', showButton);

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
          </ul>
            {isAuthenticated ? (
                <Button buttonStyle="btn--outline" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >Logout</Button>
            ) : (
                <Button buttonStyle="btn--outline" onClick={() => loginWithPopup()}>Login</Button>
            )}
        </div>
    </nav>
    </>
  );
}

export default Navbar;