import React, { useRef } from 'react';
import '../App.css';
import './CustomerHero.css';
import DuckMascot from './DuckMascot';
import MenuGrid from './MenuGrid';

// Pre-API menuItems
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
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },
    {
        name: "Egg Rolls",

        price: 10.00
    },

];

// Pre-API menuItems
const seasonItems = [
    {
      name: "Teriyaki Chicken",
      image: "/images/teriyaki.png",
      price: 10.00
    },
    {
        name: "Teriyaki Chicken",
        image: "/images/teriyaki.png",
        price: 10.00
    },

];


function CustomerHero() {
    const duckMascotRef = useRef();
    
    //also handles adding order to orderItems in relation to menuItems list
    const handleAddToOrder = (item) => {
        if (duckMascotRef.current) {
            duckMascotRef.current.addItem(item);
        }
    };

    return (
        <div className='hero-container'>
            <div className='content-wrapper'>
                <div className='video-section'>
                    <div className='video-container'>
                        <video autoPlay loop muted className='background-video'>
                            <source src="/videos/asiancooking.mp4" type="video/mp4" />
                        </video>
                        <div className='video-overlay'></div>
                        <div className='title-content'>
                            <div className='title-wrapper'>
                                <h1>PeKings</h1>
                                <p>Our mission is to deliver ducking awesome food right to you.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='video-section'>
                    <div className='video-container'>
                        <video autoPlay loop muted className='background-video'>
                            <source src="/videos/seasonal.mp4" type="video/mp4" />
                        </video>
                        <div className='video-overlay'>
                            <h2 className="season-title">Special Seasonal Items:</h2>
                            <MenuGrid items={seasonItems} onAddToOrder={handleAddToOrder} />
                        </div>
                    </div>
                </div>
                <div className='marble-section'>
                    <h2 className="menu-title">Choose an item to start your order</h2>
                    <MenuGrid items={menuItems} onAddToOrder={handleAddToOrder} />
                </div>
                
            </div>
            <DuckMascot ref={duckMascotRef} />
        </div>
    );
}

export default CustomerHero;