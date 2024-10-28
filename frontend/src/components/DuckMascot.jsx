import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './DuckMascot.css';

const TAX_RATE = 0.0825;

const DuckMascot = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    
    // function that handles when a menu item is clicked, will add to the order list
    useImperativeHandle(ref, () => ({
        addItem: (item) => {
            setOrderItems(prevItems => [...prevItems, item]);
            setIsOpen(true);
        }
    }));

    // changing duck image function lol
    const toggleDuck = () => {
        setIsOpen(!isOpen);
    };

    //functions needed for calcs & order functionality
    //NOTE: use toFixed(2) to make it into a string and round to dollar amount 1 -> 1.00

    const removeItem = (index) => {
        setOrderItems(orderItems.filter((_, i) => i !== index));
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((sum, item) => sum + item.price, 0);
    };

    const calculateTax = () => {
        return calculateSubtotal() * TAX_RATE;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const handleOrder = () => {
        alert('Order placed!');
        setOrderItems([]);
        setIsOpen(false);
    };

    return (
        <div className="duck-mascot-container">
            {isOpen && (
                <div className="speech-box">
                    <div className="speech-box-header">
                        <h3>Order Summary</h3>
                        <button className="close-button" onClick={toggleDuck}></button>
                    </div>
                    
                    <div className="speech-box-content">
                        {orderItems.length === 0 ? (<p className="empty-message">Your cart is empty</p>) : (
                            orderItems.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span>{item.name}</span>
                                    <span>${item.price.toFixed(2)}</span> 
                                    <button className="remove-item"onClick={() => removeItem(index)}>
                                        ×
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="speech-box-footer">
                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>Subtotal:</span>
                                <span>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className="price-row">
                                <span>Tax (8.25%):</span>
                                <span>${calculateTax().toFixed(2)}</span>
                            </div>
                            <div className="price-row total">
                                <span>Total:</span>
                                <span>${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="order-button" onClick={handleOrder} disabled={orderItems.length === 0} >
                            Place Order
                        </button>
                    </div>

                </div>
            )}
            <img src={isOpen ? '/images/duckopen.png' : '/images/duckidle.png'} alt="Duck Mascot" className="duck-mascot" onClick={toggleDuck}/>
        </div>
    );
});

export default DuckMascot;