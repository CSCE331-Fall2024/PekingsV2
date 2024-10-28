import React, {useState} from 'react';
import './rightPane.css'

let orderItems;

const orderItemDisplay = (label, price) => {
    return (
        <div className="orderItemRow">
            <button className="orderItemRowText">
                <div className="orderItemsText">{label}</div>
                <div className="orderItemsPrice">${price}</div>
            </button>
            <button className="editBtn">E</button>
            <button className="orderItemX">X</button>
        </div>
    );
};

function handlePayment(){
    console.log(orderItems);
}

function RightPane(orderItemsList) {
    orderItems = orderItemsList;
    let subtotal = 59.99;
    let tax = (subtotal*0.0625).toFixed(2);
    let total = subtotal + parseFloat(tax);

    for (let i = 0; i < orderItemsList.length; i++){
        let orderItem = orderItemsList[i];
        orderItems.push(orderItemDisplay(orderItem.name, orderItem.price));
    }

    return(
        <div className="rightRect">
            <div className="orderNumber">Order<br/>#5</div>
            <hr className="separator"/>

            <div className="orderItemsContainer">
                {orderItems}
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