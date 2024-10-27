import React from 'react';
import './rightPane.css'

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

function RightPane() {
    let orderItems = [];
    let subtotal = 59.99;
    let tax = (subtotal*0.0625).toFixed(2);
    let total = subtotal + parseFloat(tax);

    for (let i = 0; i < 10; i++){
        if(i%2 === 0){
            orderItems.push(orderItemDisplay("Chicken", 9.99));
        }else{
            orderItems.push(orderItemDisplay("Beef Beef Beef Beef Beef Beef Beef", 12.99));
        }
        if(i%3 === 0){
            orderItems.push(orderItemDisplay("AWESOME SAUCE", 199.99));
        }
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

            <button className="pay">Pay</button>
        </div>
    );
}

export default RightPane;