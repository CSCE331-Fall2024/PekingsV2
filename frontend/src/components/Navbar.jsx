import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import './Navbar.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from "./Button.jsx";
import BasicMenu from "./EmployeeMenu.jsx";

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
  const { user, isAuthenticated, loginWithPopup, logout, getAccessTokenSilently } = useAuth0();
  const [roles, setRoles] = useState([])

  const addRoles = (role) => {

      if (role === "MANAGER") {
          setRoles(["CASHIER", "MANAGER", "KITCHEN"]);
      } else {
          setRoles([...roles, role.toUpperCase()]);
      }
  };


  useEffect(() => {
    if (!user) return;

    const fetchItems = async () => {
      try {
          const response = await fetch(`/api/employee?email=${user["email"]}`, {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${await getAccessTokenSilently()}`,
                  "Content-Type": "application/json",
              },
          });

          if (response.ok) {
              const employee = await response.json();
              const role = await employee["position"];

              addRoles(role)
          } else {
              console.error("Failed to fetch items:", response.status);
          }
      } catch (error) {
          console.error("Error fetching items:", error);
      }};

      if (isAuthenticated && Array.isArray(roles) && roles.length === 0) {
          fetchItems();
      }
  }, [isAuthenticated, getAccessTokenSilently, user]);

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
            <Link to="/" className="navbar-logo" aria-label="PeKings Home">
                <img src="/images/pekingslogo.png" alt="PeKings Home Logo"></img>
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
                {isAuthenticated && (roles.includes("MANAGER") || roles.includes("CASHIER")) ?
                    <li className='nav-item'>
                        <BasicMenu roles={roles} />
                    </li>
                    :
                    <li className='nav-item'>
                        <Link
                            to='/Careers'
                            className='nav-links'
                            onClick={closeMobileMenu}
                        >
                            Careers
                        </Link>
                    </li>}
            </ul>
            {isAuthenticated ? (
                <Button buttonStyle="btn--outline"
                        onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
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