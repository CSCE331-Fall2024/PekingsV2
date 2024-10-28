import React, {useRef} from 'react';
import './rightPane.css'

let orderItemsList;
let orderItemsRows = [];

function orderItemDisplay(label, price) {
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

function updateItemDisplay(){
    // console.log(orderItemsList.length);
    // console.log(orderItemsRows.length);
    // for (let i = 0; i < orderItemsList.length; i++){
    //     let orderItem = orderItemsList[i];
    //     orderItemsRows.push(orderItemDisplay(orderItem.name, orderItem.price));
    // }
}

function handlePayment(){
    // console.log("x" + orderItemsRows);
    updateItemDisplay();
}

// eslint-disable-next-line react/prop-types
function RightPane({orderItemsListTemp}) {
    orderItemsList = orderItemsListTemp;
    let subtotal = 59.99;
    let tax = (subtotal*0.0625).toFixed(2);
    let total = subtotal + parseFloat(tax);


    // for(let i = 0; i < 20; i++){
    //     orderItemsRows.push(orderItemDisplay("Chicken", 9.99));
    // }


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