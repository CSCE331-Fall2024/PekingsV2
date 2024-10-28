import React, {useState, useEffect} from 'react';
import './rightPane.css'
import {getOrderItems, clearItems, removeItem} from "../cashier/menu.jsx";

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
    // console.log(getOrderItems().length);
}

function RightPane() {
    const [orderItemsRows, setOrderItemsRows] = useState([]);

    const updateOrderItems = () => {
        const items = getOrderItems();
        const rows = items.map(item => orderItemDisplay(item));
        setOrderItemsRows(rows);
    };

    useEffect(() => {
        updateOrderItems(); // Initial update

        const intervalId = setInterval(updateOrderItems, 1000); // Check every second

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []); // Empty dependency array means this runs once on mount

    let subtotal = 59.99;
    let tax = (subtotal*0.0625).toFixed(2);
    let total = subtotal + parseFloat(tax);


    return(
        <div className="rightRect">
            <div className="orderNumber">Order<br/>#5</div>
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