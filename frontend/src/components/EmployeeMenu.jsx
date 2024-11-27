import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Link, useNavigate} from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";
import Cashier from "../Cashier.jsx";
import Manager from "../Manager.jsx";

export default function BasicMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [roles, setRoles] = React.useState([]);
    const { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
       if (!isAuthenticated)
           return

       setRoles(user["https://auth.pekings.ceedric.dev/roles"])
    }, [isAuthenticated, user])

    // Role-based menu items mapping
    const menuItemsByRole = {
        cashier: [{ label: "Cashier", path: <Cashier /> }],
        manager: [
            { label: "Manager", path: <Manager /> },
            [{ label: "Cashier", path: <Cashier /> }],
        ]
    };

    const getMenuItems = () => {
        const items = [];
        roles.forEach(role => {
            if (menuItemsByRole[role]) {
                menuItemsByRole[role].forEach(item => {
                    if (Array.isArray(item)) {
                        items.push(...item); // Flatten nested arrays
                    } else {
                        items.push(item);
                    }
                });
            }
        });
        return items;
    };

    const menuItems = getMenuItems();

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
     setAnchorEl(event.currentTarget);
    };

    const handleChangeScreen = (newScreen) => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`/api/employee?email=${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const currentEmployee = await response.json();
                    if (newScreen.toLowerCase() === "cashier")
                        navigate("/Cashier", {state: {employee: currentEmployee}})
                } else {
                    console.error("Failed to fetch employees:", response.status);
                }
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployee();
    }

    const handleClose = () => {
     setAnchorEl(null);
    };

    return (
     <div className='nav-item'>
       <Link
         id="basic-button"
         className='nav-links'
         aria-controls={open ? 'basic-menu' : undefined}
         aria-haspopup="true"
         aria-expanded={open ? 'true' : undefined}
         onClick={handleClick}
       >
         Dashboard <KeyboardArrowDownIcon />
       </Link>
       <Menu
         id="basic-menu"
         anchorEl={anchorEl}
         open={open}
         onClose={handleClose}
         MenuListProps={{
           'aria-labelledby': 'basic-button',
         }}
       >
           {menuItems.map((item, index) => (
               <MenuItem
                   key={index}
                   onClick={() => {
                       handleClose();
                       handleChangeScreen(item.label)
                   }}
               >
                   {item.label}
               </MenuItem>
           ))}
       </Menu>
     </div>
    );
}