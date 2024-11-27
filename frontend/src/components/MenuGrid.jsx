
import React from 'react';
import './MenuGrid.css';

/**
 * The `MenuGrid` component renders a grid of menu items for the PeKings restaurant application.
 * It displays menu items with images, names, and prices, allowing users to add items to their order.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Array<Object>} props.items - List of menu items to display
 * @param {Function} [props.onAddToOrder] - Optional callback function to add an item to the order
 * 
 * @returns {JSX.Element} A grid of clickable menu item buttons
 *
 * @example
 * <MenuGrid 
 *   items={[
 *     { 
 *       name: "Peking Duck", 
 *       price: 25.00, 
 *       image: "/images/peking-duck.jpg" 
 *     }
 *   ]} 
 *   onAddToOrder={handleAddItem} 
 * />
 *
 * @remarks
 * - Uses a default placeholder image if no image is provided
 * - Formats price to two decimal places
 * - Supports optional click handler for adding items to order
 */

//I LOVE HASHMAP!!
const MenuGrid = ({ items, onAddToOrder }) => {
    return (
        <div className="menu-section">
            {/* <h2 className="menu-title">Choose an item to start your order</h2> */}
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