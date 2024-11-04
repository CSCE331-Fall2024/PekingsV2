import React, {useEffect, useState} from 'react';
import './rightPane.css'
// import {getOrderItems, clearItems, removeItem} from "../cashier/menu.jsx";


// function orderItemDisplay(menuItem) {
//     let name = menuItem.name;
//     let price = menuItem.price;
//     return (
//         <div className="orderItemRow">
//             <button className="orderItemRowText">
//                 <div className="orderItemsText">{name}</div>
//                 <div className="orderItemsPrice">${price}</div>
//             </button>
//             <button className="editBtn">E</button>
//             <button className="orderItemX" onClick={removeItem(menuItem)}>X</button>
//         </div>
//     );
// };

// function handlePayment(){
//     clearItems();
//     total = 0;
//     tax = 0;
//     subtotal = 0;
// }

function RightPane({orderNumber, orderItems}) {
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    let removeItem = (menuItem) => () => {
        const index = orderItems.findIndex(item => item === menuItem);
        if (index !== -1) {
            orderItems.splice(index, 1);
        }
    }

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

    const [orderItemsRows, setOrderItemsRows] = useState([]);

    const updateOrderItems = () => {
        const rows = orderItems.map(item => orderItemDisplay(item));
        setOrderItemsRows(rows);
    };

    const updateOrderTotal = () => {
        let st = 0;

        for (let i = 0; i < orderItems.length; i++) {
            st += orderItems[i].price;
        }

        st = parseFloat(st.toFixed(2));
        let tax = parseFloat((st*0.0625).toFixed(2));
        let total = parseFloat((st*1.0625).toFixed(2));

        setSubtotal(st);
        setTax(tax);
        setTotal(total);
    }

    function handlePayment(){
        orderItems.length = 0; // Clear the array, this does trigger the useEffect function

        setSubtotal(0);
        setTax(0);
        setTotal(0);
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