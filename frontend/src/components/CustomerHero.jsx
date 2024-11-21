import React, {useEffect, useRef, useState} from 'react';
import '../App.css';
import './CustomerHero.css';
import DuckMascot from './DuckMascot';
import MenuGrid from './MenuGrid';

function CustomerHero() {

    const [menuItems, setMenuItems] = useState([])
    const [seasonItems, setSeasonItems] = useState([])

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/menuitem/all", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    // setMenuItems(await response.json());
                    const items = await response.json();
                    // Separate items based on category
                    const menu = items.filter(item => item.category === "food" || item.category === "drinks");
                    const seasonal = items.filter(item => item.category === "seasonal");

                    setMenuItems(menu);
                    setSeasonItems(seasonal);

                } else {
                    console.error("Failed to fetch items:", response.status);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems()
    })

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
                            <source src="/videos/foodstock.mp4" type="video/mp4" />
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