import React, {useState} from 'react';
import './centerScreen.css'
import TopPane from './topPane.jsx';
import Menu from './menu.jsx';
import {getOrderItems} from "./menu.jsx";

const menuItems = [
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
export {getOrderItems};


function CenterScreen(){
    return(
        <div className="centerScreen">
            <TopPane />
            {Menu(menuItems)}
            {/*<button className="Test" onClick={()=>{console.log(orderItems)}}>Btn</button>*/}
        </div>
    );
}

export default CenterScreen;