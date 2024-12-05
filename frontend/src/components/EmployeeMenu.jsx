import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {Link, useNavigate} from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useAuth0} from "@auth0/auth0-react";
import {useState} from "react";

export default function BasicMenu(roles) {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useAuth0();
    const navigate = useNavigate();

    const menuItemsByRole = {
        CASHIER: [{ label: "Cashier", path: "/Cashier" }],
        KITCHEN: [{ label: "Kitchen", path: "/Kitchen" }],
        MANAGER: [{ label: "Manager", path: "/Manager" }]
    };

    const getMenuItems = () => {
        const items = [];
        roles["roles"].forEach(role => {
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

    const handleChangeScreen = (newScreen, path) => {
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
                        navigate(path, { state: { employee: currentEmployee } });
                    else
                        navigate(path);
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
                onClick={(event) => {
                    event.preventDefault(); // Prevent default navigation
                    handleClick(event); // Open the menu
                }}
            >
                Dashboard <KeyboardArrowDownIcon/>
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
                            handleChangeScreen(item.label, item.path);
                        }}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}
