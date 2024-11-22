import React, { useEffect, useState } from 'react';
import '../App.css';
import './MenuSect.css';

function MenuSect() {
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
                    const items = await response.json();
                    const menu = items.filter(item => item.category === "food" || item.category === "drink" || item.category === "dessert");
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
        fetchItems();
    }, []);

    return (
        <div className='mission-container'>
            <div className='mission-background'>
                <div className='menu-board-container'>

                    {/* Regular Menu Section */}
                    <div className='menu-section-MB'>
                        <h1 className='menu-board-title'>MENU BOARD</h1>
                        <div className='menu-grid-MB'>
                            {menuItems.map((item, index) => (
                                <div key={index} className='menu-item-MB'>
                                    <span className='item-name'>{item.name}</span>
                                    <span className='item-price'>${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Seasonal Menu Section */}
                    <div className='menu-section-MB'>
                        <h1 className='menu-board-title'>Seasonal Specials</h1>
                        <div className='menu-grid-MB'>
                            {seasonItems.map((item, index) => (
                                <div key={index} className='menu-item-MB'>
                                    <span className='item-name'>{item.name}</span>
                                    <span className='item-price'>${item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuSect;