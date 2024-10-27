
import React from 'react';
import './MenuGrid.css';

//I LOVE HASHMAP!!
const MenuGrid = ({ items, onAddToOrder }) => {
    return (
        <div className="menu-section">
            <h2 className="menu-title">Choose an item to start your order</h2>
            <div className="menu-grid">
                {items.map((item, index) => (
                    // inserting menu items :)
                    <button key={index} className="menu-item" onClick={() => onAddToOrder && onAddToOrder(item)}>
                        <div className="menu-item-content">
                            <img src={item.image || "/images/placeholder.png"} alt={item.name}className="menu-item-image"/>
                            <h3 className="menu-item-name">{item.name}</h3>
                            <p className="menu-item-price">${item.price.toFixed(2)}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MenuGrid;