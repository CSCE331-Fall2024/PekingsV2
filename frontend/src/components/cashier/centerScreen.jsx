import React, {useState} from 'react';
import './centerScreen.css'
import TopPane from './topPane.jsx';
import Menu from './menu.jsx';
import {getOrderItems} from "./menu.jsx";

const menuItems1 = [
    {
        name: "Teriyaki Chicken",
        image: "/images/teriyaki.png",
        price: 10.00
    },
    {
        name: "Broccoli Beef",
        image: "/images/brocbeef.png",
        price: 10.00
    },
    {
        name: "Chicken Fried Rice",
        image: "/images/CFR.png",
        price: 10.00
    },
    {
        name: "Beef Fried Rice",
        image: "/images/BFR.png",
        price: 10.00
    },
    {
        name: "Orange Chicken",

        price: 10.00
    },
    {
        name: "Beijing Beef",

        price: 10.00
    },
    {
        name: "Crab Rangoon",

        price: 10.00
    },
    {
        name: "Fortune Cookies",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    }
];
const menuItems2 = [
    {
        name: "Teriyaki Chicken",
        image: "/images/teriyaki.png",
        price: 10.00
    },
    {
        name: "Broccoli Beef",
        image: "/images/brocbeef.png",
        price: 10.00
    },
    {
        name: "Chicken Fried Rice",
        image: "/images/CFR.png",
        price: 10.00
    },
    {
        name: "Beef Fried Rice",
        image: "/images/BFR.png",
        price: 10.00
    }
];
const menuItems3 = [
    {
        name: "Teriyaki Chicken",
        image: "/images/teriyaki.png",
        price: 10.00
    },
    {
        name: "Broccoli Beef",
        image: "/images/brocbeef.png",
        price: 10.00
    }
];
export {getOrderItems};


function CenterScreen(){
    const [currentMenu, setCurrentMenu] = useState('main'); // Default to 'main'

    const handleMenuChange = (menu) => {
        setCurrentMenu(menu);
    };

    return(
        <div className="centerScreen">
            <TopPane screenChange={handleMenuChange} />

            {Menu(menuItems1, menuItems2, menuItems3, {currentMenu})}
        </div>
    );
}

export default CenterScreen;