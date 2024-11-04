import React, {useState} from 'react';
import './centerScreen.css'
import TopPane from './topPane.jsx';
import Menu from './menu.jsx';

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

        price: 8.99
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

// eslint-disable-next-line react/prop-types
function CenterScreen({center, menuItemList, alternateOrders, handlePreviousBtnClick}){
    const [currentMenu, setCurrentMenu] = useState('main'); // Default to 'main'

    let alternateOrderButtons = [];
    for(let i = 0; i < alternateOrders.length; i++){
        if(alternateOrders[i].status){
            alternateOrderButtons.push(
                <button className="alternateOrderBtn-cash" onClick={() => {handlePreviousBtnClick(alternateOrders[i])}}>{alternateOrders[i].id}</button>
            );
        }
    }


    const handleMenuChange = (menu) => {
        setCurrentMenu(menu);
    };

    return(
        <div className="centerScreen-cash">
            <div className="centerScreenContainers-cash" style={{display: center === 'menu' ? 'block' : 'none'}}>
                <TopPane screenChange={handleMenuChange} />
                {Menu(menuItems1, menuItems2, menuItems3, {currentMenu, menuItemList})}
            </div>

            <div className="centerScreenContainers-cash" style={{display: center === 'previous' ? 'block' : 'none'}}>
                <div className="previousOrdersTitle-cash">Previous Orders</div>
                <div className="previousOrdersDisplayBox-cash">{alternateOrderButtons}</div>
            </div>
        </div>
    );
}

export default CenterScreen;