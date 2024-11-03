import React, {useState, useEffect} from 'react';
import './rightPane.css'
import {getOrderItems, clearItems, removeItem} from "../cashier/menu.jsx";

let subtotal = 0;
let tax = parseFloat((subtotal*0.0625).toFixed(2));
let total = parseFloat((subtotal*1.0625).toFixed(2));

function orderItemDisplay(menuItem) {
    let name = menuItem.name;
    let price = menuItem.price;
    return (
        <div className="orderItemRow">
            <button className="orderItemRowText">
                <div className="orderItemsText">{name}</div>
                <div className="orderItemsPrice">${price}</div>
            </button>
            <button className="editBtn">E</button>
            <button className="orderItemX" onClick={removeItem(menuItem)}>X</button>
        </div>
    );
};

function handlePayment(){
    clearItems();
    total = 0;
    tax = 0;
    subtotal = 0;
}

function RightPane({orderNumber}) {
    const [orderItemsRows, setOrderItemsRows] = useState([]);

    const updateOrderItems = () => {
        const items = getOrderItems();
        const rows = items.map(item => orderItemDisplay(item));
        setOrderItemsRows(rows);
    };

    const updateOrderTotal = () => {
        const items = getOrderItems();
        subtotal = 0;
        tax = 0;
        total = 0;

        for (let i = 0; i < items.length; i++) {
            subtotal += items[i].price;
            tax = parseFloat((subtotal*0.0625).toFixed(2));
            total = parseFloat((subtotal*1.0625).toFixed(2));
        }
        subtotal = parseFloat(subtotal.toFixed(2));
    }

    useEffect(() => {
        updateOrderItems(); // Initial update
        updateOrderTotal(); // Initial update

        const intervalId1 = setInterval(updateOrderItems, 1);
        const intervalId2 = setInterval(updateOrderTotal, 1);// Check every second

        return () => {
            clearInterval(intervalId1);
            clearInterval(intervalId2);
        } // Cleanup on unmount
    }, []); // Empty dependency array means this runs once on mount


    return(
        <div className="rightRect">
            <div className="orderNumber">Order<br/>#{orderNumber}</div>
            <hr className="separator"/>

            <div className="orderItemsContainer">
                {orderItemsRows}
            </div>
            <hr className="separator"/>

            <div className="priceContainer">
                <div className="subtotal">Subtotal: ${subtotal}</div>
                <div className="tax">Tax: ${tax}</div>
                <div className="total">Total: ${total}</div>
            </div>

            <button className="pay" onClick={handlePayment}>Pay</button>
        </div>
    );
}

export default RightPane;